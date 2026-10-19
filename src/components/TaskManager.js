
"use client";

import { useState } from "react";
import StatCard from "@/components/StatCard";
import TaskForm from "@/components/TaskForm";
import { createClient } from "@/lib/supabase/client";
import {
  filterTasks,
  fromRow,
  toRow,
  getTaskStats,
  isOverdue,
  PRIORITIES,
  STATUSES,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "@/lib/tasks";

const defaultFilters = {
  search: "",
  status: "all",
  priority: "all",
};

const columnStyles = {
  todo: {
    border: "border-sky-400/20",
    dot: "bg-sky-400",
    badge: "bg-sky-400/10 text-sky-300",
  },
  in_progress: {
    border: "border-amber-400/20",
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-300",
  },
  done: {
    border: "border-emerald-400/20",
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-300",
  },
};

export default function TaskManager({
  initialTasks = [],
  loadError = "",
}) {
  const [supabase] = useState(() => createClient());
  const [tasks, setTasks] = useState(initialTasks);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(loadError);
  const [isBoardView, setIsBoardView] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);

  const stats = getTaskStats(tasks);
  const visibleTasks = filterTasks(tasks, filters);

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all";

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleAddTask(values) {
    setBusy(true);
    setError("");

    const { data, error: dbError } = await supabase
      .from("tasks")
      .insert(toRow(values))
      .select()
      .single();

    setBusy(false);

    if (dbError) {
      setError("Could not add the task. Please try again.");
      return;
    }

    setTasks((current) => [fromRow(data), ...current]);
  }

  async function handleUpdateTask(id, values) {
    setBusy(true);
    setError("");

    const { data, error: dbError } = await supabase
      .from("tasks")
      .update(toRow(values))
      .eq("id", id)
      .select()
      .single();

    setBusy(false);

    if (dbError) {
      setError("Could not save your changes. Please try again.");
      return;
    }

    setTasks((current) =>
      current.map((task) =>
        task.id === id ? fromRow(data) : task
      )
    );

    setEditingId(null);
  }

  async function handleMoveTask(id, newStatus) {
    if (!STATUSES.includes(newStatus) || busy) {
      return;
    }

    const task = tasks.find((item) => item.id === id);

    if (!task || task.status === newStatus) {
      return;
    }

    setBusy(true);
    setError("");

    const { data, error: dbError } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id)
      .select()
      .single();

    setBusy(false);

    if (dbError) {
      setError(
        "Could not move the task. Your previous status has been kept."
      );
      return;
    }

    setTasks((current) =>
      current.map((item) =>
        item.id === id ? fromRow(data) : item
      )
    );
  }

  async function handleMarkDone(id) {
    await handleMoveTask(id, "done");
  }

  async function handleDelete(id) {
    if (
      busy ||
      !window.confirm("Delete this task? This cannot be undone.")
    ) {
      return;
    }

    setBusy(true);
    setError("");

    const { error: dbError } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    setBusy(false);

    if (dbError) {
      setError("Could not delete the task. Please try again.");
      return;
    }

    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );

    if (editingId === id) {
      setEditingId(null);
    }
  }

  function handleDragStart(event, taskId) {
    if (busy) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(taskId));
    setDraggedTaskId(taskId);
  }

  function handleDragOver(event, status) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverStatus(status);
  }

  async function handleDrop(event, status) {
    event.preventDefault();

    const transferredId = event.dataTransfer.getData("text/plain");
    const taskId = draggedTaskId ?? transferredId;

    setDragOverStatus(null);
    setDraggedTaskId(null);

    if (!taskId) {
      return;
    }

    await handleMoveTask(taskId, status);
  }

  function handleDragEnd() {
    setDraggedTaskId(null);
    setDragOverStatus(null);
  }

  const smallButton =
    "rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50";

  const filterField =
    "min-w-0 rounded-xl border border-white/10 bg-[#0c0c14] px-3 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-violet-400/60";

  function renderTaskActions(task) {
    return (
      <div className="flex flex-wrap gap-2">
        {task.status !== "done" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => handleMarkDone(task.id)}
            className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
             Mark done
          </button>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={() => setEditingId(task.id)}
          className={smallButton}
        >
          Edit
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => handleDelete(task.id)}
          className="rounded-xl border border-red-400/20 bg-red-500/[0.08] px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    );
  }

  function renderTaskDetails(task) {
    return (
      <>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              task.status === "done"
                ? "bg-emerald-400"
                : isOverdue(task)
                  ? "bg-red-400"
                  : task.priority === "high"
                    ? "bg-orange-400"
                    : task.priority === "medium"
                      ? "bg-amber-300"
                      : "bg-sky-400"
            }`}
          />

          <p
            className={`break-words font-medium ${
              task.status === "done"
                ? "text-slate-500 line-through"
                : "text-slate-100"
            }`}
          >
            {task.title}
          </p>

          {task.status === "done" && (
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
              Completed
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`rounded-lg border px-2.5 py-1 ${
              task.priority === "high"
                ? "border-orange-400/20 bg-orange-400/10 text-orange-300"
                : task.priority === "medium"
                  ? "border-amber-400/20 bg-amber-400/10 text-amber-200"
                  : "border-sky-400/20 bg-sky-400/10 text-sky-300"
            }`}
          >
            {PRIORITY_LABELS[task.priority]} priority
          </span>

          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-slate-300">
            {STATUS_LABELS[task.status]}
          </span>

          {task.dueDate && (
            <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-slate-400">
              Due {task.dueDate}
            </span>
          )}

          {isOverdue(task) && (
            <span className="rounded-lg border border-red-400/20 bg-red-400/10 px-2.5 py-1 font-medium text-red-300">
              Overdue
            </span>
          )}
        </div>
      </>
    );
  }

  function renderEditingForm(task) {
    return (
      <div className="rounded-2xl border border-violet-400/25 bg-[#11111b] p-4 sm:p-5">
        <h4 className="mb-4 font-semibold text-white">Edit task</h4>

        <TaskForm
          initialTask={task}
          busy={busy}
          onSubmit={(values) => handleUpdateTask(task.id, values)}
          onCancel={() => setEditingId(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.08] p-4 text-sm text-red-300"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 font-medium underline underline-offset-4 hover:text-red-200"
          >
            Dismiss
          </button>
        </div>
      )}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Total tasks" value={stats.total} tone="slate" />
        <StatCard label="Completed" value={stats.completed} tone="green" />
        <StatCard label="Pending" value={stats.pending} tone="amber" />
        <StatCard label="Overdue" value={stats.overdue} tone="red" />
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-4 sm:p-5">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
            Get things done
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            Create a task
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Add a task, choose its priority, and set a due date.
          </p>
        </div>

        <TaskForm onSubmit={handleAddTask} busy={busy} />
      </section>

      {tasks.length > 0 && (
        <section className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Find your tasks
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Search and filter your tasks to find what you need.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
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
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {PRIORITY_LABELS[priority]}
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
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {isBoardView ? "Kanban board" : "Your task list"}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {visibleTasks.length}{" "}
              {visibleTasks.length === 1 ? "task" : "tasks"} shown
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              aria-pressed={!isBoardView}
              onClick={() => setIsBoardView(false)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                !isBoardView
                  ? "border-violet-400/30 bg-violet-500/15 text-violet-200"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
              }`}
            >
              List view
            </button>

            <button
              type="button"
              aria-pressed={isBoardView}
              onClick={() => setIsBoardView(true)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                isBoardView
                  ? "border-violet-400/30 bg-violet-500/15 text-violet-200"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
              }`}
            >
              Board view
            </button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#0c0c14] px-5 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-2xl text-violet-300">
              +
            </div>

            <h3 className="mt-4 font-semibold text-slate-100">
              No tasks yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
              Your workspace is ready. Create your first task using the form
              above.
            </p>
          </div>
        ) : visibleTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#0c0c14] p-10 text-center">
            <h3 className="font-semibold text-slate-100">
              No matching tasks
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Try a different search or clear your filters.
            </p>

            <button
              type="button"
              onClick={() => setFilters(defaultFilters)}
              className={`${smallButton} mt-4`}
            >
              Clear all filters
            </button>
          </div>
        ) : isBoardView ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {STATUSES.map((status) => {
              const columnTasks = visibleTasks.filter(
                (task) => task.status === status
              );

              const styles = columnStyles[status];

              return (
                <div
                  key={status}
                  onDragOver={(event) => handleDragOver(event, status)}
                  onDragLeave={() => setDragOverStatus(null)}
                  onDrop={(event) => handleDrop(event, status)}
                  className={`min-h-64 rounded-2xl border bg-[#0c0c14] p-4 transition ${
                    styles.border
                  } ${
                    dragOverStatus === status
                      ? "bg-violet-500/[0.08] ring-2 ring-violet-400/30"
                      : ""
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />

                      <h4 className="font-semibold text-white">
                        {STATUS_LABELS[status]}
                      </h4>
                    </div>

                    <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-slate-300">
                      {columnTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <article
                        key={task.id}
                        draggable={!busy && editingId !== task.id}
                        onDragStart={(event) =>
                          handleDragStart(event, task.id)
                        }
                        onDragEnd={handleDragEnd}
                        className={`rounded-xl border border-white/10 bg-[#151520] p-4 transition ${
                          draggedTaskId === task.id
                            ? "opacity-40"
                            : "opacity-100"
                        } ${
                          busy || editingId === task.id
                            ? "cursor-default"
                            : "cursor-grab hover:border-violet-400/30 active:cursor-grabbing"
                        }`}
                      >
                        {task.id === editingId ? (
                          renderEditingForm(task)
                        ) : (
                          <>
                            {renderTaskDetails(task)}

                            <label className="mt-4 block text-xs text-slate-400">
                              Change status

                              <select
                                value={task.status}
                                disabled={busy}
                                onChange={(event) =>
                                  handleMoveTask(
                                    task.id,
                                    event.target.value
                                  )
                                }
                                className={`${filterField} mt-2 w-full`}
                              >
                                {STATUSES.map((option) => (
                                  <option key={option} value={option}>
                                    {STATUS_LABELS[option]}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <div className="mt-3">
                              {renderTaskActions(task)}
                            </div>
                          </>
                        )}
                      </article>
                    ))}

                    {columnTasks.length === 0 && (
                      <div className="rounded-xl border border-dashed border-white/10 p-5 text-center text-xs leading-5 text-slate-500">
                        No tasks here yet.
                        <br />
                        Drag a task into this column.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <ul className="space-y-3">
            {visibleTasks.map((task) => (
              <li key={task.id}>
                {task.id === editingId ? (
                  renderEditingForm(task)
                ) : (
                  <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-4 transition hover:border-violet-400/20 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        {renderTaskDetails(task)}
                      </div>

                      <div className="sm:shrink-0">
                        {renderTaskActions(task)}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
