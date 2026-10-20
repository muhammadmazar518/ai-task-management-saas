import { getToday, isOverdue } from "./tasks";
import { addDaysKey } from "./analytics";

export const RECOMMENDATION_KINDS = [
  "next_task",
  "urgent",
  "order",
  "upcoming",
  "breakdown",
];

export const RECOMMENDATION_LABELS = {
  next_task: "Next task",
  urgent: "Overdue & high priority",
  order: "Suggested order",
  upcoming: "Due in the next 7 days",
  breakdown: "Break it into steps",
};

export const RECOMMENDATION_ICONS = {
  next_task: "→",
  urgent: "!",
  order: "≡",
  upcoming: "◷",
  breakdown: "⊞",
};

const PRIORITY_RANK = { high: 3, medium: 2, low: 1 };
const MAX_LIST_IDS = 5;
const MAX_WHY_LENGTH = 300;
const MAX_STEPS = 5;
const MAX_STEP_LENGTH = 160;
const NO_DUE_DATE = "9999-99-99";

export const GENERIC_BREAKDOWN_STEPS = [
  'Write down what "done" looks like for this task',
  "Name the first action you could finish in under 10 minutes",
  "Put that first action on your calendar for today",
];

function urgencyRank(task, today) {
  if (isOverdue(task, today)) return 0;
  if (task.dueDate === today) return 1;

  const weekEnd = addDaysKey(today, 7);

  if (task.dueDate && task.dueDate > today && task.dueDate <= weekEnd) {
    return 2;
  }

  if (task.priority === "high") return 3;

  return 4;
}

export function sortPendingTasks(tasks = [], today = getToday()) {
  return tasks
    .filter((task) => task && task.id && task.status !== "done")
    .slice()
    .sort((a, b) => {
      const byRank = urgencyRank(a, today) - urgencyRank(b, today);
      if (byRank !== 0) return byRank;

      const aDue = a.dueDate || NO_DUE_DATE;
      const bDue = b.dueDate || NO_DUE_DATE;
      if (aDue !== bDue) return aDue.localeCompare(bDue);

      const aPriority = PRIORITY_RANK[a.priority] || 0;
      const bPriority = PRIORITY_RANK[b.priority] || 0;
      if (aPriority !== bPriority) return bPriority - aPriority;

      return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
    });
}

function finalize(recs, source) {
  return recs.map((rec) => ({
    id: `${rec.kind}:${rec.taskIds.join("-") || "list"}`,
    kind: rec.kind,
    taskIds: rec.taskIds,
    why: rec.why,
    steps: rec.steps ?? [],
    source: rec.source || source || "rules",
  }));
}

export function buildFallbackRecommendations(tasks = [], today = getToday()) {
  const pending = sortPendingTasks(tasks, today);

  if (pending.length === 0) return [];

  const recs = [];

  recs.push({
    kind: "next_task",
    taskIds: [pending[0].id],
    why: "Starting with the most urgent open task clears the biggest risk first and gives you momentum for the rest of the day.",
    steps: [],
  });

  const urgentTasks = pending
    .filter((task) => isOverdue(task, today) || task.priority === "high")
    .slice(0, MAX_LIST_IDS);

  if (urgentTasks.length > 0) {
    recs.push({
      kind: "urgent",
      taskIds: urgentTasks.map((task) => task.id),
      why: "Overdue and high-priority work costs the most if it slips further, so it belongs at the top of your list.",
      steps: [],
    });
  }

  if (pending.length > 1) {
    recs.push({
      kind: "order",
      taskIds: pending.slice(0, MAX_LIST_IDS).map((task) => task.id),
      why: "Following this order lets deadlines and priority drive your sequence instead of whichever task happens to feel easiest.",
      steps: [],
    });
  }

  const weekEnd = addDaysKey(today, 7);

  const upcoming = pending
    .filter(
      (task) => task.dueDate && task.dueDate >= today && task.dueDate <= weekEnd
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, MAX_LIST_IDS);

  if (upcoming.length > 0) {
    recs.push({
      kind: "upcoming",
      taskIds: upcoming.map((task) => task.id),
      why: "Seeing everything due today or in the next 7 days lets you plan the week before deadlines become emergencies.",
      steps: [],
    });
  }

  recs.push({
    kind: "breakdown",
    taskIds: [pending[0].id],
    why: "Splitting a task into small steps makes the first move obvious and removes the friction of getting started.",
    steps: GENERIC_BREAKDOWN_STEPS.slice(),
  });

  return finalize(recs, "rules");
}

export function normalizeAiRecommendations(raw, tasks = [], today = getToday()) {
  if (!raw || !Array.isArray(raw.recommendations)) return null;

  const pendingIds = new Set(
    sortPendingTasks(tasks, today).map((task) => task.id)
  );
  const seen = new Set();
  const recs = [];

  for (const item of raw.recommendations) {
    if (!item || typeof item !== "object") continue;

    const kind = item.kind;
    if (!RECOMMENDATION_KINDS.includes(kind) || seen.has(kind)) continue;

    const rawIds = Array.isArray(item.taskIds) ? item.taskIds : [];
    const validIds = [];

    for (const id of rawIds) {
      if (typeof id !== "string" || !pendingIds.has(id)) continue;
      if (validIds.includes(id)) continue;

      validIds.push(id);

      if (validIds.length >= MAX_LIST_IDS) break;
    }

    const perKindLimit =
      kind === "next_task" || kind === "breakdown" ? 1 : MAX_LIST_IDS;
    const taskIds = validIds.slice(0, perKindLimit);

    if (taskIds.length === 0) continue;

    const why =
      typeof item.why === "string"
        ? item.why.trim().replace(/\s+/g, " ").slice(0, MAX_WHY_LENGTH)
        : "";

    if (!why) continue;

    let steps = [];

    if (kind === "breakdown") {
      steps = (Array.isArray(item.steps) ? item.steps : [])
        .filter((step) => typeof step === "string" && step.trim())
        .map((step) =>
          step.trim().replace(/\s+/g, " ").slice(0, MAX_STEP_LENGTH)
        )
        .slice(0, MAX_STEPS);

      if (steps.length === 0) continue;
    }

    seen.add(kind);

    recs.push({ kind, taskIds, why, steps, source: "ai" });
  }

  if (recs.length === 0) return null;

  return finalize(recs, "ai");
}

export function backfillRecommendations(aiRecs, tasks = [], today = getToday()) {
  const present = new Set(aiRecs.map((rec) => rec.kind));

  const extra = buildFallbackRecommendations(tasks, today).filter(
    (rec) => !present.has(rec.kind)
  );

  if (extra.length === 0) return aiRecs;

  return [...aiRecs, ...extra].sort(
    (a, b) =>
      RECOMMENDATION_KINDS.indexOf(a.kind) - RECOMMENDATION_KINDS.indexOf(b.kind)
  );
}

export function sanitizeRecommendations(list) {
  if (!Array.isArray(list)) return [];

  return list
    .filter(
      (rec) =>
        rec &&
        typeof rec === "object" &&
        RECOMMENDATION_KINDS.includes(rec.kind) &&
        Array.isArray(rec.taskIds)
    )
    .map((rec) => ({
      id: typeof rec.id === "string" ? rec.id : `${rec.kind}:list`,
      kind: rec.kind,
      taskIds: rec.taskIds.filter((id) => typeof id === "string"),
      why: typeof rec.why === "string" ? rec.why : "",
      steps: Array.isArray(rec.steps)
        ? rec.steps.filter((step) => typeof step === "string")
        : [],
      source: rec.source === "ai" ? "ai" : "rules",
    }))
    .sort(
      (a, b) =>
        RECOMMENDATION_KINDS.indexOf(a.kind) -
        RECOMMENDATION_KINDS.indexOf(b.kind)
    );
}

export function sanitizeTaskRefs(list) {
  if (!Array.isArray(list)) return [];

  return list
    .filter(
      (task) =>
        task && typeof task === "object" && typeof task.id === "string" && task.id
    )
    .map((task) => ({
      id: task.id,
      title: typeof task.title === "string" ? task.title : "Untitled task",
      priority: ["low", "medium", "high"].includes(task.priority)
        ? task.priority
        : "medium",
      status: ["todo", "in_progress", "done"].includes(task.status)
        ? task.status
        : "todo",
      dueDate: typeof task.dueDate === "string" ? task.dueDate : "",
    }));
}
