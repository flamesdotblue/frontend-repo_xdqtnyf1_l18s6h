import React, { useEffect, useMemo, useRef, useState } from 'react';
import WeekView from './WeekView';

function startOfWeek(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday=0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function addWeeks(d, n) {
  return addDays(d, n * 7);
}

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

export default function WeekScroller({
  slotsForDate,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
  anchorWeekStart,
}) {
  // Keep a window of weeks: previous, current, and upcoming as you scroll
  const [weeks, setWeeks] = useState(() => {
    const start = startOfWeek(anchorWeekStart);
    return [addWeeks(start, -1), start, addWeeks(start, 1)];
  });

  const containerRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const start = startOfWeek(anchorWeekStart);
    setWeeks([addWeeks(start, -1), start, addWeeks(start, 1)]);
  }, [anchorWeekStart]);

  useEffect(() => {
    const el = containerRef.current;
    const sentinel = sentinelRef.current;
    if (!el || !sentinel) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Append one more week at the end for infinite forward scroll
          setWeeks((ws) => {
            const last = ws[ws.length - 1];
            return [...ws, addWeeks(last, 1)];
          });
        }
      });
    }, { root: el, threshold: 1.0 });

    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-[70vh] overflow-y-auto rounded-lg space-y-6">
      {weeks.map((w) => (
        <WeekView
          key={dateKey(w)}
          weekStart={w}
          getSlotsForDate={slotsForDate}
          onAddSlot={onAddSlot}
          onEditSlot={onEditSlot}
          onDeleteSlot={onDeleteSlot}
        />
      ))}
      <div ref={sentinelRef} className="h-8" />
    </div>
  );
}
