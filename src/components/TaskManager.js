"use client";

import { useState, useSyncExternalStore } from "react";
import Icon from "@/components/Icon";
import StatCard from "@/components/StatCard";
import TaskForm from "@/components/TaskForm";
import TaskCalendar from "@/components/TaskCalendar";
import { EmptyState, SectionHeading } from "@/components/ui";
import { buttonClasses, inputClass, statusStyles, priorityStyles, priorityDots, statusDots } from "@/lib/ui";
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
  sort: "created",
};

const SORTS = {
  created: "Newest first",
  due: "Due date",
  priority: "Priority",
  title: "Title A–Z",
};

const PRIORITY_RANK = { high: 3, medium: 2, low: 1 };

const viewButtons = [
  { id: "list", label: "List", icon: "list" },
  { id: "board", label: "Board", icon: "board" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
];

const VIEW_IDS = viewButtons.map((button) => button.id);

function subscribeToHash(onChange) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function getHashView() {
  const hash = window.location.hash.replace("#", "");
  return VIEW_IDS.includes(hash) ? hash : null;
}

function getServerHashView() {
  return null;
}

function sortTasks(tasks, sort) {
  const sorted = tasks.slice();

  if (sort === "title") {
    return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sort === "priority") {
    return sorted.sort(
      (a, b) => (PRIORITY_RANK[b.priority] || 0) - (PRIORITY_RANK[a.priority] || 0)
    );
  }

  if (sort === "due") {
    return sorted.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }

  return sorted;
}

export default function TaskManager({
  initialTasks = [],
  loadError = "",
  initialView = "list",
}) {
  const [supabase] = useState(() => createClient());
  const [tasks, setTasks] = useState(initialTasks);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(loadError);
  const [selectedView, setSelectedView] = useState(
    VIEW_IDS.includes(initialView) ? initialView : "list"
  );
  const hashView = useSyncExternalStore(
    subscribeToHash,
    getHashView,
    getServerHashView
  );
  const view = hashView ?? selectedView;
  const [createPrefillDate, setCreatePrefillDate] = useState("");
  const [createFormKey, setCreateFormKey] = useState(0);
  const [createOpen, setCreateOpen] = useState(initialTasks.length === 0);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);

  const stats = getTaskStats(tasks);
  const visibleTasks = sortTasks(filterTasks(tasks, filters), filters.sort);

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

  function handleCalendarCreate(dateKey) {
    setEditingId(null);
    setCreatePrefillDate(dateKey);
    setCreateFormKey((current) => current + 1);
    setCreateOpen(true);

    window.setTimeout(() => {
      const input = document.getElementById("new-title");
      input?.focus({ preventScroll: true });
      document
        .getElementById("create-task")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
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
      current.map((task) => (task.id === id ? fromRow(data) : task))
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
      setError("Could not move the task. Your previous status has been kept.");
      return;
    }

    setTasks((current) =>
      current.map((item) => (item.id === id ? fromRow(data) : item))
    );
  }

  async function handleMarkDone(id) {
    await handleMoveTask(id, "done");
  }

  async function handleDelete(id) {
    if (busy || !window.confirm("Delete this task? This cannot be undone.")) {
      return;
    }

    setBusy(true);
    setError("");

    const { error: dbError } = await supabase.from("tasks").delete().eq("id", id);

    setBusy(false);

    if (dbError) {
      setError("Could not delete the task. Please try again.");
      return;
    }

    setTasks((current) => current.filter((task) => task.id !== id));

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

  function handleViewChange(nextView) {
    setSelectedView(nextView);

    if (nextView === "list") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } else {
      window.history.replaceState(null, "", `#${nextView}`);
    }
  }

  function renderTaskMeta(task) {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-5 ${statusStyles[task.status]}`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${statusDots[task.status]}`}
          />
          {STATUS_LABELS[task.status]}
        </span>

        <span
          className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-5 ${priorityStyles[task.priority]}`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${priorityDots[task.priority]}`}
          />
          {PRIORITY_LABELS[task.priority]}
        </span>

        {task.dueDate && (
          <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[11px] leading-5 text-[var(--muted)]">
            <Icon name="calendar" size={11} />
            {task.dueDate}
          </span>
        )}

        {isOverdue(task) && (
          <span className="inline-flex items-center gap-1 rounded-md border border-red-500/25 bg-red-500/10 px-1.5 py-0.5 text-[11px] font-medium leading-5 text-red-700 dark:text-red-300">
            <Icon name="alert" size={11} />
            Overdue
          </span>
        )}
      </div>
    );
  }

  function renderTaskActions(task, { compact = false } = {}) {
    const size = compact ? "sm" : "md";

    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {task.status !== "done" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => handleMarkDone(task.id)}
            className={buttonClasses({ variant: "success", size })}
          >
            <Icon name="check" size={compact ? 13 : 14} />
            <span className={compact ? "sr-only sm:not-sr-only" : ""}>Done</span>
          </button>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={() => setEditingId(task.id)}
          className={buttonClasses({ variant: "secondary", size })}
        >
          <Icon name="edit" size={compact ? 13 : 14} />
          <span className={compact ? "sr-only sm:not-sr-only" : ""}>Edit</span>
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => handleDelete(task.id)}
          aria-label={`Delete ${task.title}`}
          className={buttonClasses({ variant: "danger", size })}
        >
          <Icon name="trash" size={compact ? 13 : 14} />
          <span className={compact ? "sr-only" : "sr-only sm:not-sr-only"}>
            Delete
          </span>
        </button>
      </div>
    );
  }

  function renderTaskBody(task) {
    return (
      <div className="min-w-0">
        <p
          className={`break-words text-sm font-medium ${
            task.status === "done"
              ? "text-[var(--muted)] line-through"
              : "text-[var(--foreground)]"
          }`}
        >
          {task.title}
        </p>

        <div className="mt-2">{renderTaskMeta(task)}</div>
      </div>
    );
  }

  function renderEditingForm(task) {
    return (
      <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Icon name="edit" size={15} className="text-[var(--primary)]" />
          <h4 className="text-sm font-semibold">Edit task</h4>
        </div>

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
    <div className="space-y-5">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-500/25 bg-red-500/[0.07] p-3 text-sm text-red-700 dark:text-red-300"
        >
          <Icon name="alert" size={16} className="mt-0.5" />
          <span className="min-w-0 flex-1 leading-6">{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
            className="shrink-0 rounded-md p-1 transition hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Total" value={stats.total} tone="slate" hint="All tasks" />
        <StatCard label="Completed" value={stats.completed} tone="green" hint="Marked done" />
        <StatCard label="Pending" value={stats.pending} tone="amber" hint="Still open" />
        <StatCard label="Overdue" value={stats.overdue} tone="red" hint="Past due date" />
      </section>

      <section
        id="create-task"
        className="scroll-mt-20 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">Create a task</h3>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              Add a task, choose its priority, and set a due date.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen((current) => !current)}
            aria-expanded={createOpen}
            className={buttonClasses({ variant: "secondary", size: "sm" })}
          >
            <Icon name={createOpen ? "close" : "plus"} size={14} />
            {createOpen ? "Close" : "New task"}
          </button>
        </div>

        {createOpen && (
          <div className="mt-4 border-t border-[var(--border)] pt-4">
            <TaskForm
              key={createFormKey}
              initialDueDate={createPrefillDate}
              onSubmit={handleAddTask}
              busy={busy}
            />
          </div>
        )}
      </section>

      {tasks.length > 0 && (
        <section className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative min-w-0 sm:flex-1">
              <Icon
                name="search"
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              />
              <input
                type="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search tasks…"
                aria-label="Search tasks"
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              aria-label="Filter by status"
              className={`${inputClass} sm:w-40`}
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
              className={`${inputClass} sm:w-40`}
            >
              <option value="all">All priorities</option>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {PRIORITY_LABELS[priority]}
                </option>
              ))}
            </select>

            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              aria-label="Sort tasks"
              className={`${inputClass} sm:w-44`}
            >
              {Object.entries(SORTS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => setFilters(defaultFilters)}
                className={buttonClasses({ variant: "ghost", size: "md" })}
              >
                <Icon name="close" size={14} />
                Clear
              </button>
            )}
          </div>
        </section>
      )}

      <section className="scroll-mt-20">
        <SectionHeading
          title={
            view === "board"
              ? "Board"
              : view === "calendar"
                ? "Calendar"
                : "Task list"
          }
          description={`${visibleTasks.length} ${
            visibleTasks.length === 1 ? "task" : "tasks"
          } shown${hasActiveFilters ? " · filtered" : ""}`}
          actions={
            <div
              role="group"
              aria-label="Choose task view"
              className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-0.5"
            >
              {viewButtons.map((button) => (
                <button
                  key={button.id}
                  type="button"
                  aria-pressed={view === button.id}
                  onClick={() => handleViewChange(button.id)}
                  className={`inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                    view === button.id
                      ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon name={button.icon} size={14} />
                  <span className="hidden sm:inline">{button.label}</span>
                </button>
              ))}
            </div>
          }
        />

        {tasks.length === 0 ? (
          <EmptyState
            icon="tasks"
            title="No tasks yet"
            description="Your workspace is ready. Create your first task to start planning your work."
            action={
              <button
                type="button"
                onClick={() => {
                  setCreateOpen(true);
                  window.setTimeout(
                    () => document.getElementById("new-title")?.focus(),
                    0
                  );
                }}
                className={buttonClasses({ variant: "primary", size: "lg" })}
              >
                <Icon name="plus" size={15} />
                Create your first task
              </button>
            }
          />
        ) : visibleTasks.length === 0 ? (
          <EmptyState
            icon="search"
            title="No matching tasks"
            description="Try a different search term, or clear your filters to see everything again."
            action={
              <button
                type="button"
                onClick={() => setFilters(defaultFilters)}
                className={buttonClasses({ variant: "secondary", size: "lg" })}
              >
                Clear all filters
              </button>
            }
          />
        ) : view === "board" ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {STATUSES.map((status) => {
              const columnTasks = visibleTasks.filter(
                (task) => task.status === status
              );

              return (
                <div
                  key={status}
                  onDragOver={(event) => handleDragOver(event, status)}
                  onDragLeave={() => setDragOverStatus(null)}
                  onDrop={(event) => handleDrop(event, status)}
                  className={`flex min-h-64 flex-col rounded-[var(--radius-card)] border bg-[var(--surface-muted)] p-3 transition ${
                    dragOverStatus === status
                      ? "border-[var(--primary)] ring-2 ring-[var(--ring)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between gap-2 px-1">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full ${statusDots[status]}`}
                      />
                      <h4 className="text-sm font-semibold">
                        {STATUS_LABELS[status]}
                      </h4>
                    </div>

                    <span className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-xs font-medium text-[var(--muted)]">
                      {columnTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {columnTasks.map((task) => (
                      <article
                        key={task.id}
                        draggable={!busy && editingId !== task.id}
                        onDragStart={(event) => handleDragStart(event, task.id)}
                        onDragEnd={handleDragEnd}
                        className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition ${
                          draggedTaskId === task.id ? "opacity-40" : "opacity-100"
                        } ${
                          busy || editingId === task.id
                            ? "cursor-default"
                            : "cursor-grab hover:border-[var(--border-strong)] active:cursor-grabbing"
                        }`}
                      >
                        {task.id === editingId ? (
                          renderEditingForm(task)
                        ) : (
                          <>
                            <div className="flex items-start gap-2">
                              <Icon
                                name="grip"
                                size={14}
                                className="mt-0.5 hidden text-[var(--muted)] sm:block"
                              />
                              <div className="min-w-0 flex-1">
                                {renderTaskBody(task)}
                              </div>
                            </div>

                            <div className="mt-3">{renderTaskActions(task, { compact: true })}</div>
                          </>
                        )}
                      </article>
                    ))}

                    {columnTasks.length === 0 && (
                      <div className="rounded-xl border border-dashed border-[var(--border-strong)] px-4 py-6 text-center text-xs leading-5 text-[var(--muted)]">
                        No tasks here.
                        <br />
                        Drag a task into this column.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : view === "calendar" ? (
          <TaskCalendar
            tasks={visibleTasks}
            editingId={editingId}
            busy={busy}
            onEditTask={(task) => setEditingId(task.id)}
            onCreateTask={handleCalendarCreate}
            renderEditForm={renderEditingForm}
          />
        ) : (
          <ul className="space-y-2">
            {visibleTasks.map((task) => (
              <li key={task.id}>
                {task.id === editingId ? (
                  renderEditingForm(task)
                ) : (
                  <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:border-[var(--border-strong)] sm:flex-row sm:items-center sm:justify-between sm:p-4">
                    <div className="min-w-0 flex-1">{renderTaskBody(task)}</div>
                    <div className="sm:shrink-0">{renderTaskActions(task)}</div>
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
