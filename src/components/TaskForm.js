
"use client";

import { useState } from "react";
import {
  PRIORITIES,
  STATUSES,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "@/lib/tasks";

const MAX_TITLE_LENGTH = 100;

const emptyForm = {
  title: "",
  priority: "medium",
  status: "todo",
  dueDate: "",
};

export default function TaskForm({
  onSubmit,
  initialTask = null,
  initialDueDate = "",
  onCancel = null,
  busy = false,
}) {
  const isEditing = Boolean(initialTask);

  const [form, setForm] = useState(
    initialTask
      ? {
          title: initialTask.title,
          priority: initialTask.priority,
          status: initialTask.status,
          dueDate: initialTask.dueDate,
        }
      : { ...emptyForm, dueDate: initialDueDate || "" }
  );

  const [error, setError] = useState("");
  const prefix = isEditing ? `edit-${initialTask.id}` : "new";

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (name === "title") {
      setError("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setError("Please enter a task title.");
      return;
    }

    if (title.length > MAX_TITLE_LENGTH) {
      setError(`Title must be ${MAX_TITLE_LENGTH} characters or less.`);
      return;
    }

    onSubmit({
      title,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate,
    });

    if (!isEditing) {
      setForm({ ...emptyForm });
    }

    setError("");
  }

  const fieldClass =
    "mt-2 w-full min-w-0 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/10";

  const labelClass = "text-sm font-medium text-[var(--foreground)]";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-300">
            Task details
          </p>

          <h2 className="mt-2 text-lg font-semibold">
            {isEditing ? "Edit task" : "Add a task"}
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            {isEditing
              ? "Update the details of your task."
              : "What would you like to accomplish?"}
          </p>
        </div>

        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-xl text-violet-600 dark:text-violet-300"
          aria-hidden="true"
        >
          {isEditing ? "✎" : "+"}
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor={`${prefix}-title`} className={labelClass}>
              Task title
            </label>

            <span
              className={`text-xs ${
                form.title.length > MAX_TITLE_LENGTH
                  ? "text-red-600 dark:text-red-300"
                  : "text-[var(--muted)]"
              }`}
            >
              {form.title.length}/{MAX_TITLE_LENGTH}
            </span>
          </div>

          <input
            id={`${prefix}-title`}
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            maxLength={MAX_TITLE_LENGTH + 1}
            placeholder="e.g. Finish project report"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${prefix}-error` : undefined}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor={`${prefix}-priority`} className={labelClass}>
            Priority
          </label>

          <select
            id={`${prefix}-priority`}
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={fieldClass}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs text-[var(--muted)]">
            Choose how important this task is.
          </p>
        </div>

        <div>
          <label htmlFor={`${prefix}-status`} className={labelClass}>
            Status
          </label>

          <select
            id={`${prefix}-status`}
            name="status"
            value={form.status}
            onChange={handleChange}
            className={fieldClass}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs text-[var(--muted)]">
            Track where you are with this task.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${prefix}-dueDate`} className={labelClass}>
            Due date <span className="font-normal text-[var(--muted)]">(optional)</span>
          </label>

          <input
            id={`${prefix}-dueDate`}
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>
      </div>

      {error && (
        <p
          id={`${prefix}-error`}
          role="alert"
          className="mt-4 rounded-xl border border-red-400/20 bg-red-500/[0.08] px-3 py-2.5 text-sm text-red-600 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3 border-t border-[var(--border)] pt-5">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? (
            "Saving..."
          ) : (
            <>
              <span>{isEditing ? "✓" : "+"}</span>
              {isEditing ? "Save changes" : "Add task"}
            </>
          )}
        </button>

        {isEditing && (
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-violet-400/40 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
