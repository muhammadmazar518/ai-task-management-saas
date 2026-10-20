"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { buttonClasses, statusDots } from "@/lib/ui";
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

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));

  const days = useMemo(() => getMonthDays(currentMonth), [currentMonth]);

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

    const nextDay = Math.min(Number(selectedDate.slice(8, 10)), daysInNextMonth);

    setSelectedDate(
      dateKey(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextDay))
    );
  }

  function goToToday() {
    const now = new Date();

    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(dateKey(now));
  }

  const monthLabel = currentMonth.toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  });

  const selectedLabel = new Date(
    `${selectedDate}T12:00:00`
  ).toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">{monthLabel}</h3>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className={buttonClasses({ variant: "secondary", size: "md" })}
          >
            <Icon name="chevronLeft" size={15} />
          </button>

          <button
            type="button"
            onClick={goToToday}
            className={buttonClasses({ variant: "secondary", size: "md" })}
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className={buttonClasses({ variant: "secondary", size: "md" })}
          >
            <Icon name="chevronRight" size={15} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border)]">
        <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[var(--surface-muted)]">
          {WEEKDAYS.map((weekday) => (
            <div
              key={weekday}
              className="py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]"
            >
              <span className="hidden sm:inline">{weekday}</span>
              <span className="sm:hidden">{weekday.charAt(0)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-[var(--border)]">
          {days.map((day) => {
            const key = dateKey(day);
            const inMonth = day.getMonth() === currentMonth.getMonth();
            const dayTasks = tasksByDate[key] ?? [];
            const selected = key === selectedDate;
            const isToday = key === today;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDate(key)}
                aria-pressed={selected}
                aria-label={`${day.toDateString()}, ${dayTasks.length} ${
                  dayTasks.length === 1 ? "task" : "tasks"
                }`}
                className={`flex min-h-16 min-w-0 flex-col gap-1 bg-[var(--surface)] p-1.5 text-left transition focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring)] sm:min-h-24 sm:p-2 ${
                  selected ? "bg-[var(--primary-soft)]" : "hover:bg-[var(--surface-muted)]"
                } ${inMonth ? "" : "opacity-45"}`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                    isToday
                      ? "bg-[var(--primary)] text-[var(--primary-contrast)]"
                      : "text-[var(--foreground)]"
                  }`}
                >
                  {day.getDate()}
                </span>

                <span className="hidden w-full space-y-0.5 sm:block">
                  {dayTasks.slice(0, 2).map((task) => (
                    <span
                      key={task.id}
                      className="flex items-center gap-1 truncate rounded px-1 py-0.5 text-[10px] leading-4 text-[var(--muted-strong)]"
                      title={task.title}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          task.status === "done"
                            ? statusDots.done
                            : isOverdue(task)
                              ? "bg-red-400"
                              : statusDots[task.status] ?? "bg-[var(--primary)]"
                        }`}
                      />
                      <span className="truncate">{task.title}</span>
                    </span>
                  ))}

                  {dayTasks.length > 2 && (
                    <span className="block px-1 text-[10px] text-[var(--muted)]">
                      +{dayTasks.length - 2} more
                    </span>
                  )}
                </span>

                {dayTasks.length > 0 && (
                  <span className="flex gap-0.5 sm:hidden" aria-hidden="true">
                    {dayTasks.slice(0, 3).map((task) => (
                      <span
                        key={task.id}
                        className={`h-1.5 w-1.5 rounded-full ${
                          task.status === "done"
                            ? statusDots.done
                            : isOverdue(task)
                              ? "bg-red-400"
                              : statusDots[task.status] ?? "bg-[var(--primary)]"
                        }`}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3.5 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold">{selectedLabel}</h4>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              {selectedTasks.length}{" "}
              {selectedTasks.length === 1 ? "task" : "tasks"} scheduled
            </p>
          </div>

          <button
            type="button"
            onClick={() => onCreateTask?.(selectedDate)}
            disabled={busy}
            className={buttonClasses({ variant: "primary", size: "md" })}
          >
            <Icon name="plus" size={15} />
            Add task
          </button>
        </div>

        {selectedTasks.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-4 py-6 text-center text-sm text-[var(--muted)]">
            Nothing scheduled for this date.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {selectedTasks.map((task) =>
              task.id === editingId && renderEditForm ? (
                <div
                  key={task.id}
                  className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] p-3"
                >
                  {renderEditForm(task)}
                </div>
              ) : (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onEditTask?.(task)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-left transition hover:border-[var(--border-strong)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
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
                      <span className="flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className={`h-1.5 w-1.5 rounded-full ${
                            statusDots[task.status] ?? "bg-[var(--primary)]"
                          }`}
                        />
                        {STATUS_LABELS[task.status]}
                      </span>

                      {isOverdue(task) && (
                        <span className="rounded-md border border-red-500/25 bg-red-500/10 px-1.5 py-0.5 font-medium text-red-700 dark:text-red-300">
                          Overdue
                        </span>
                      )}
                    </span>
                  </span>

                  <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-[var(--primary)]">
                    Edit
                    <Icon name="arrowRight" size={13} />
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
