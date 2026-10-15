"use client";

import { useState } from "react";
import StatCard from "@/components/StatCard";
import TaskForm from "@/components/TaskForm";
import {
  filterTasks,
  getTaskStats,
  isOverdue,
  PRIORITIES,
  STATUSES,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "@/lib/tasks";

const defaultFilters = { search: "", status: "all", priority: "all" };

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);

  const stats = getTaskStats(tasks);
  const visibleTasks = filterTasks(tasks, filters);
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all";

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function handleAddTask(values) {
    const task = { id: crypto.randomUUID(), ...values };
    setTasks((current) => [task, ...current]);
  }

  function handleUpdateTask(id, values) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, ...values } : task))
    );
    setEditingId(null);
  }

  function handleMarkDone(id) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, status: "done" } : task))
    );
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    setTasks((current) => current.filter((task) => task.id !== id));
    if (editingId === id) setEditingId(null);
  }

  const smallButton =
    "rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100";
  const filterField =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none";

  return (
    <>
      <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total tasks" value={stats.total} tone="slate" />
        <StatCard label="Completed" value={stats.completed} tone="green" />
        <StatCard label="Pending" value={stats.pending} tone="amber" />
        <StatCard label="Overdue" value={stats.overdue} tone="red" />
      </section>

      <section className="mt-6">
        <TaskForm onSubmit={handleAddTask} />
      </section>

      {tasks.length > 0 && (
        <section className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search tasks..."
            aria-label="Search tasks"
            className={`${filterField} sm:flex-1`}
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            aria-label="Filter by status"
            className={filterField}
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            aria-label="Filter by priority"
            className={filterField}
          >
            <option value="all">All priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => setFilters(defaultFilters)}
              className={smallButton}
            >
              Clear filters
            </button>
          )}
        </section>
      )}

      <section className="mt-6">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="font-semibold text-slate-900">No tasks yet</h2>
            <p className="mt-1 text-sm text-slate-600">
              Add your first task using the form above.
            </p>
          </div>
        ) : visibleTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="font-semibold text-slate-900">No matching tasks</h2>
            <p className="mt-1 text-sm text-slate-600">
              Try a different search or clear the filters.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visibleTasks.map((task) =>
              task.id === editingId ? (
                <li key={task.id}>
                  <TaskForm
                    initialTask={task}
                    onSubmit={(values) => handleUpdateTask(task.id, values)}
                    onCancel={() => setEditingId(null)}
                  />
                </li>
              ) : (
                <li
                  key={task.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p
                      className={`font-medium ${
                        task.status === "done"
                          ? "text-slate-400 line-through"
                          : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {PRIORITY_LABELS[task.priority]} priority ·{" "}
                      {STATUS_LABELS[task.status]}
                      {task.dueDate ? ` · Due ${task.dueDate}` : ""}
                      {isOverdue(task) && (
                        <span className="ml-2 font-medium text-red-600">
                          Overdue
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {task.status !== "done" && (
                      <button
                        type="button"
                        onClick={() => handleMarkDone(task.id)}
                        className={smallButton}
                      >
                        Mark done
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditingId(task.id)}
                      className={smallButton}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </section>
    </>
  );
}