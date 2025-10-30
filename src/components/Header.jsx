import React from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

function formatRange(start) {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' });
  const yearFmt = new Intl.DateTimeFormat('en', { year: 'numeric' });
  return `${fmt.format(start)} - ${fmt.format(end)}, ${yearFmt.format(start)}`;
}

export default function Header({ currentWeekStart, onPrevWeek, onNextWeek, onToday }) {
  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-5 h-5 text-indigo-600" />
          <h1 className="text-lg font-semibold">Weekly Scheduler</h1>
          <span className="text-sm text-gray-500">{formatRange(currentWeekStart)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToday}
            className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={onPrevWeek}
            className="p-2 rounded-md border hover:bg-gray-50"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNextWeek}
            className="p-2 rounded-md border hover:bg-gray-50"
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
