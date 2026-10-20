
"use client";

import { useMemo, useState } from "react";
import { isOverdue, STATUS_LABELS } from "@/lib/tasks";

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonthDays(currentMonth) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstDay.getDay());
  const days = [];

  for (let i = 0; i < 42; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }

  return days;
}

export default function TaskCalendar({
  tasks = [],
  editingId = null,
  busy = false,
  onEditTask,
  onCreateTask,
  renderEditForm,
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(() =>
    dateKey(new Date())
  );

  const days = useMemo(
    () => getMonthDays(currentMonth),
    [currentMonth]
  );

  const tasksByDate = useMemo(() => {
    const grouped = {};

    tasks.forEach((task) => {
      if (!task.dueDate) return;

      if (!grouped[task.dueDate]) {
        grouped[task.dueDate] = [];
      }

      grouped[task.dueDate].push(task);
    });

    return grouped;
  }, [tasks]);

  const selectedTasks = tasksByDate[selectedDate] ?? [];
  const today = dateKey(new Date());

  function changeMonth(offset) {
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + offset,
      1
    );

    setCurrentMonth(nextMonth);

    const daysInNextMonth = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth() + 1,
      0
    ).getDate();

    const nextDay = Math.min(
      Number(selectedDate.slice(8, 10)),
      daysInNextMonth
    );

    setSelectedDate(
      dateKey(
        new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextDay)
      )
    );
  }

  function goToToday() {
    const now = new Date();

    setCurrentMonth(
      new Date(now.getFullYear(), now.getMonth(), 1)
    );
    setSelectedDate(dateKey(now));
  }

  const buttonClass =
    "rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:border-violet-400/50 hover:bg-violet-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          {currentMonth.toLocaleDateString("en", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className={buttonClass}
            aria-label="Previous month"
          >
            ←
          </button>

          <button
            type="button"
            onClick={goToToday}
            className={buttonClass}
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            className={buttonClass}
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
          (weekday) => (
            <div
              key={weekday}
              className="py-2 text-center text-xs font-semibold text-[var(--muted)]"
            >
              {weekday}
            </div>
          )
        )}

        {days.map((day) => {
          const key = dateKey(day);
          const inMonth =
            day.getMonth() === currentMonth.getMonth();
          const dayTasks = tasksByDate[key] ?? [];
          const selected = key === selectedDate;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedDate(key)}
              aria-pressed={selected}
              className={`flex min-h-20 min-w-0 flex-col items-start rounded-lg border p-1.5 text-left transition sm:min-h-24 sm:p-2 ${
                selected
                  ? "border-violet-500 bg-violet-500/10 ring-1 ring-violet-500/30"
                  : "border-[var(--border)] hover:border-violet-400/50"
              } ${
                inMonth
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)] opacity-60"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  key === today
                    ? "bg-violet-600 font-bold text-white"
                    : ""
                }`}
              >
                {day.getDate()}
              </span>

              <span className="mt-1 w-full space-y-1">
                {dayTasks.slice(0, 2).map((task) => (
                  <span
                    key={task.id}
                    className={`block truncate rounded px-1 py-0.5 text-[10px] ${
                      task.status === "done"
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : isOverdue(task)
                          ? "bg-red-500/15 text-red-700 dark:text-red-300"
                          : "bg-violet-500/15 text-violet-700 dark:text-violet-300"
                    }`}
                    title={task.title}
                  >
                    {task.title}
                  </span>
                ))}

                {dayTasks.length > 2 && (
                  <span className="block truncate text-[10px] text-[var(--muted)]">
                    +{dayTasks.length - 2} more
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-semibold text-[var(--foreground)]">
              {new Date(
                `${selectedDate}T12:00:00`
              ).toLocaleDateString("en", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h4>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {selectedTasks.length}{" "}
              {selectedTasks.length === 1 ? "task" : "tasks"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onCreateTask?.(selectedDate)}
            disabled={busy}
            className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            + Add task
          </button>
        </div>

        {selectedTasks.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-[var(--border)] p-5 text-center text-sm text-[var(--muted)]">
            No tasks scheduled for this date.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {selectedTasks.map((task) =>
              task.id === editingId && renderEditForm ? (
                <div key={task.id}>{renderEditForm(task)}</div>
              ) : (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onEditTask?.(task)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-left transition hover:border-violet-400/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
                >
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block break-words text-sm font-medium ${
                        task.status === "done"
                          ? "text-[var(--muted)] line-through"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {task.title}
                    </span>

                    <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                      {STATUS_LABELS[task.status]}
                      {isOverdue(task) && (
                        <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2 py-0.5 font-medium text-red-600 dark:text-red-300">
                          Overdue
                        </span>
                      )}
                    </span>
                  </span>

                  <span className="text-xs text-violet-600 dark:text-violet-300">
                    Edit →
                  </span>
                </button>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}
