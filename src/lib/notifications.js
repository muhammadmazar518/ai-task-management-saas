import { getToday, isOverdue } from "./tasks";
import { parseDateKey, formatDateKey, formatMonthDay } from "./analytics";

export const NOTIFICATION_TYPES = {
  OVERDUE: "overdue",
  DUE_TODAY: "due_today",
  COMPLETED: "completed",
};

const TYPE_ORDER = {
  [NOTIFICATION_TYPES.OVERDUE]: 1,
  [NOTIFICATION_TYPES.DUE_TODAY]: 2,
  [NOTIFICATION_TYPES.COMPLETED]: 3,
};

export const COMPLETED_NOTIFICATION_LIMIT = 10;

const READ_STORAGE_PREFIX = "taskflow:notifications:read:v1:";
const MAX_TITLE_LENGTH = 60;

function truncateTitle(title) {
  const value = typeof title === "string" ? title.trim() : "";

  if (!value) return "Untitled task";
  if (value.length <= MAX_TITLE_LENGTH) return value;

  return `${value.slice(0, MAX_TITLE_LENGTH - 1)}…`;
}

function daysBetween(fromKey, toKey) {
  return Math.round(
    (parseDateKey(toKey).getTime() - parseDateKey(fromKey).getTime()) / 86400000
  );
}

function timestampToKey(value, today) {
  if (!value) return today;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? today : formatDateKey(date);
}

export function buildNotifications(
  tasks = [],
  today = getToday(),
  completedLimit = COMPLETED_NOTIFICATION_LIMIT
) {
  const byId = new Map();
  const completed = [];

  function add(item) {
    if (!byId.has(item.id)) {
      byId.set(item.id, item);
    }
  }

  tasks.forEach((task) => {
    if (!task || !task.id) return;

    if (task.status === "done") {
      completed.push(task);
      return;
    }

    if (!task.dueDate) return;

    if (isOverdue(task, today)) {
      const days = Math.max(daysBetween(task.dueDate, today), 1);
      const noun = days === 1 ? "day" : "days";

      add({
        id: `overdue:${task.id}:${task.dueDate}`,
        type: NOTIFICATION_TYPES.OVERDUE,
        taskId: task.id,
        title: "Task overdue",
        message: `"${truncateTitle(task.title)}" was due ${formatMonthDay(
          task.dueDate
        )} and is ${days} ${noun} overdue.`,
        occurredOn: task.dueDate,
        order: TYPE_ORDER[NOTIFICATION_TYPES.OVERDUE],
      });

      return;
    }

    if (task.dueDate === today) {
      add({
        id: `due-today:${task.id}:${task.dueDate}`,
        type: NOTIFICATION_TYPES.DUE_TODAY,
        taskId: task.id,
        title: "Due today",
        message: `"${truncateTitle(task.title)}" is due today.`,
        occurredOn: today,
        order: TYPE_ORDER[NOTIFICATION_TYPES.DUE_TODAY],
      });
    }
  });

  completed
    .sort((a, b) =>
      String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? ""))
    )
    .slice(0, completedLimit)
    .forEach((task) => {
      add({
        id: `completed:${task.id}`,
        type: NOTIFICATION_TYPES.COMPLETED,
        taskId: task.id,
        title: "Task completed",
        message: `"${truncateTitle(task.title)}" was marked complete.`,
        occurredOn: timestampToKey(task.createdAt, today),
        order: TYPE_ORDER[NOTIFICATION_TYPES.COMPLETED],
      });
    });

  return [...byId.values()].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    if (a.occurredOn !== b.occurredOn) {
      return b.occurredOn.localeCompare(a.occurredOn);
    }
    return a.title.localeCompare(b.title) || a.id.localeCompare(b.id);
  });
}

export function countCompletedTasks(tasks = []) {
  return tasks.filter((task) => task && task.status === "done").length;
}

export function countUnread(items = [], readIds) {
  const read =
    readIds instanceof Set ? readIds : new Set(Array.isArray(readIds) ? readIds : []);
  return items.filter((item) => !read.has(item.id)).length;
}

export function notificationStorageKey(userId) {
  return `${READ_STORAGE_PREFIX}${userId || "anon"}`;
}
