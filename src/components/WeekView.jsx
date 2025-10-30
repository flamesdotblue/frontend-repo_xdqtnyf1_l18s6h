import React from 'react';
import SlotBadge from './SlotBadge';
import { Plus } from 'lucide-react';

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

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

function DayHeader({ date }) {
  const weekday = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date);
  const dayNum = date.getDate();
  const isToday = dateKey(date) === dateKey(new Date());
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">{weekday}</span>
        <span className={`inline-flex items-center justify-center rounded-full w-7 h-7 text-sm font-medium ${
          isToday ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
        }`}>{dayNum}</span>
      </div>
    </div>
  );
}

export default function WeekView({
  weekStart,
  getSlotsForDate,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="grid grid-cols-7 border-b bg-gray-50/60">
        {days.map((d) => (
          <div key={dateKey(d)} className="p-3">
            <DayHeader date={d} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 divide-x">
        {days.map((d) => {
          const slots = getSlotsForDate(d);
          return (
            <div key={dateKey(d)} className="p-3 min-h-[140px] space-y-2">
              {slots.length === 0 && (
                <p className="text-xs text-gray-400">No slots</p>
              )}

              {slots.map((slot, idx) => (
                <SlotBadge
                  key={idx}
                  slot={slot}
                  onEdit={() => onEditSlot(d, slot, idx)}
                  onDelete={() => onDeleteSlot(d, slot, idx)}
                />
              ))}

              <button
                onClick={() => onAddSlot(d)}
                className="mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border hover:bg-gray-50"
              >
                <Plus className="w-3.5 h-3.5" /> Add slot
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
