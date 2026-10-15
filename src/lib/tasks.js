export const PRIORITIES = ["low", "medium", "high"];
export const STATUSES = ["todo", "in_progress", "done"];

export const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const STATUS_LABELS = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

// Today's date as "YYYY-MM-DD" in the user's local time.
export function getToday() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

// A task is overdue if it has a due date in the past and is not done.
export function isOverdue(task, today = getToday()) {
  return Boolean(task.dueDate) && task.status !== "done" && task.dueDate < today;
}

export function getTaskStats(tasks, today = getToday()) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const pending = total - completed;
  const overdue = tasks.filter((t) => isOverdue(t, today)).length;
  return { total, completed, pending, overdue };
}
// Returns the tasks that match the search text, status and priority.
// Use "all" for status or priority to skip that filter.
export function filterTasks(tasks, { search = "", status = "all", priority = "all" } = {}) {
  const query = search.trim().toLowerCase();
  return tasks.filter((task) => {
    if (query && !task.title.toLowerCase().includes(query)) return false;
    if (status !== "all" && task.status !== status) return false;
    if (priority !== "all" && task.priority !== priority) return false;
    return true;
  });
}
