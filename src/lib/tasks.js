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

export function getToday() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

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

export function filterTasks(tasks, { search = "", status = "all", priority = "all" } = {}) {
  const query = search.trim().toLowerCase();
  return tasks.filter((task) => {
    if (query && !task.title.toLowerCase().includes(query)) return false;
    if (status !== "all" && task.status !== status) return false;
    if (priority !== "all" && task.priority !== priority) return false;
    return true;
  });
}

export function fromRow(row) {
  return {
    id: row.id,
    title: row.title,
    priority: row.priority,
    status: row.status,
    dueDate: row.due_date ?? "",
    createdAt: row.created_at ?? "",
  };
}

export function toRow(values) {
  return {
    title: values.title,
    priority: values.priority,
    status: values.status,
    due_date: values.dueDate || null,
  };
}
