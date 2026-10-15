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

export default function TaskForm({ onSubmit, initialTask = null, onCancel = null }) {
  const isEditing = Boolean(initialTask);
  const [form, setForm] = useState(
    initialTask
      ? {
          title: initialTask.title,
          priority: initialTask.priority,
          status: initialTask.status,
          dueDate: initialTask.dueDate,
        }
      : emptyForm
  );
  const [error, setError] = useState("");
  const prefix = isEditing ? `edit-${initialTask.id}` : "new";

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
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
    if (!isEditing) setForm(emptyForm);
    setError("");
  }

  const fieldClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none";
  const labelClass = "text-sm font-medium text-slate-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5"
    >
      <h2 className="font-semibold text-slate-900">
        {isEditing ? "Edit task" : "Add a task"}
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${prefix}-title`} className={labelClass}>
            Title
          </label>
          <input
            id={`${prefix}-title`}
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Finish project report"
            className={`mt-1 ${fieldClass}`}
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
            className={`mt-1 ${fieldClass}`}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
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
            className={`mt-1 ${fieldClass}`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
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
            className={`mt-1 ${fieldClass}`}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {isEditing ? "Save changes" : "Add task"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}