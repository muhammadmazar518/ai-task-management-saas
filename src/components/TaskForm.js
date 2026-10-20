"use client";

import { useState } from "react";
import { buttonClasses, inputClass, labelClass } from "@/lib/ui";
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
  compact = false,
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

  return (
    <form onSubmit={handleSubmit} className={compact ? "" : "space-y-4"}>
      <div>
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={`${prefix}-title`} className={labelClass}>
            Task title
          </label>

          <span
            className={`text-xs ${
              form.title.length > MAX_TITLE_LENGTH
                ? "text-red-600 dark:text-red-400"
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
          className={`${inputClass} mt-1.5`}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor={`${prefix}-priority`} className={labelClass}>
            Priority
          </label>

          <select
            id={`${prefix}-priority`}
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={`${inputClass} mt-1.5`}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
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
            className={`${inputClass} mt-1.5`}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${prefix}-dueDate`} className={labelClass}>
            Due date
          </label>

          <input
            id={`${prefix}-dueDate`}
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className={`${inputClass} mt-1.5`}
          />
        </div>
      </div>

      {error && (
        <p
          id={`${prefix}-error`}
          role="alert"
          className="rounded-lg border border-red-500/25 bg-red-500/[0.07] px-3 py-2 text-sm text-red-700 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={busy}
          className={buttonClasses({ variant: "primary", size: "lg" })}
        >
          {busy ? "Saving…" : isEditing ? "Save changes" : "Add task"}
        </button>

        {isEditing && (
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className={buttonClasses({ variant: "secondary", size: "lg" })}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
