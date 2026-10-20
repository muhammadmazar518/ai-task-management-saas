import { getToday, isOverdue, PRIORITIES } from "./tasks";

export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDaysKey(key, amount) {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + amount);
  return formatDateKey(date);
}

export function formatMonthDay(key) {
  return parseDateKey(key).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export function getCompletionSummary(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "done").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    percent,
    remaining: total - completed,
  };
}

export function getInProgressCount(tasks) {
  return tasks.filter((task) => task.status === "in_progress").length;
}

export function getPriorityCounts(tasks) {
  const counts = { low: 0, medium: 0, high: 0 };

  tasks.forEach((task) => {
    if (PRIORITIES.includes(task.priority)) {
      counts[task.priority] += 1;
    }
  });

  return counts;
}

export function getDueOverview(tasks, today = getToday()) {
  const weekEnd = addDaysKey(today, 7);
  const byDueDate = (a, b) => a.dueDate.localeCompare(b.dueDate);

  const dueToday = tasks
    .filter((task) => task.status !== "done" && task.dueDate === today)
    .sort(byDueDate);

  const next7Days = tasks
    .filter(
      (task) =>
        task.status !== "done" &&
        task.dueDate > today &&
        task.dueDate <= weekEnd
    )
    .sort(byDueDate);

  const overdue = tasks
    .filter((task) => isOverdue(task, today))
    .sort(byDueDate);

  return { dueToday, next7Days, overdue };
}

export function getCompletionTrend(tasks, weeks = 8, today = getToday()) {
  const todayDate = parseDateKey(today);
  const daysSinceMonday = (todayDate.getDay() + 6) % 7;
  const currentWeekStart = addDaysKey(today, -daysSinceMonday);

  const buckets = [];

  for (let index = weeks - 1; index >= 0; index -= 1) {
    const start = addDaysKey(currentWeekStart, -7 * index);

    buckets.push({
      start,
      end: addDaysKey(start, 7),
      label: formatMonthDay(start),
      total: 0,
      completed: 0,
    });
  }

  const firstStart = buckets[0].start;

  tasks.forEach((task) => {
    if (!task.createdAt) return;

    const created = new Date(task.createdAt);
    if (Number.isNaN(created.getTime())) return;

    const createdKey = formatDateKey(created);
    if (createdKey < firstStart) return;

    const bucket = buckets.find(
      (item) => createdKey >= item.start && createdKey < item.end
    );

    if (!bucket) return;

    bucket.total += 1;

    if (task.status === "done") {
      bucket.completed += 1;
    }
  });

  return buckets;
}

export function describeDueDate(key, today = getToday()) {
  if (key === today) return "Today";
  if (key === addDaysKey(today, 1)) return "Tomorrow";
  if (key === addDaysKey(today, -1)) return "Yesterday";

  const options = { month: "short", day: "numeric" };

  if (key.slice(0, 4) !== today.slice(0, 4)) {
    options.year = "numeric";
  }

  return parseDateKey(key).toLocaleDateString([], options);
}
