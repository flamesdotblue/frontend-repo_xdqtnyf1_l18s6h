import React from 'react';
import { Clock, Edit, Trash } from 'lucide-react';

function toTimeLabel(t) {
  // t is "HH:MM"
  const [h, m] = t.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(d);
}

export default function SlotBadge({ slot, onEdit, onDelete }) {
  return (
    <div className="group flex items-center justify-between rounded-md border p-2 bg-white shadow-sm hover:shadow transition">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-indigo-600" />
        <span className="text-sm font-medium">{toTimeLabel(slot.start)} – {toTimeLabel(slot.end)}</span>
        {slot.scope === 'recurring' && (
          <span className="text-[10px] uppercase tracking-wide bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">Recurring</span>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={onEdit}
          className="p-1 rounded hover:bg-gray-100"
          aria-label="Edit slot"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 rounded hover:bg-gray-100 text-red-600"
          aria-label="Delete slot"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
