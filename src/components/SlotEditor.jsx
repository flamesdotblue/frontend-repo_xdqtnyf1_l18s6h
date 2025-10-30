import React, { useEffect, useState } from 'react';

function toHHMM(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export default function SlotEditor({
  open,
  date,
  initial,
  onClose,
  onSaveThisDate,
  onSaveRecurring,
}) {
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setStart(initial.start);
      setEnd(initial.end);
    } else {
      const d = new Date(date);
      d.setHours(9, 0, 0, 0);
      const e = new Date(date);
      e.setHours(11, 0, 0, 0);
      setStart(toHHMM(d));
      setEnd(toHHMM(e));
    }
    setError('');
  }, [open, date, initial]);

  if (!open) return null;

  const weekday = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(date);
  const dateLabel = new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);

  function validate() {
    if (!start || !end) return 'Provide start and end';
    if (start >= end) return 'End must be after start';
    return '';
  }

  function handleSaveThis() {
    const err = validate();
    if (err) return setError(err);
    onSaveThisDate({ start, end });
  }

  function handleSaveRecurring() {
    const err = validate();
    if (err) return setError(err);
    onSaveRecurring({ start, end });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-5">
        <h3 className="text-lg font-semibold mb-1">{initial ? 'Edit slot' : 'Add slot'}</h3>
        <p className="text-sm text-gray-500 mb-4">{weekday}, {dateLabel}</p>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">Start</span>
              <input
                type="time"
                className="w-full border rounded px-2 py-1.5"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">End</span>
              <input
                type="time"
                className="w-full border rounded px-2 py-1.5"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border hover:bg-gray-50"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveThis}
              className="px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-black"
            >
              Save for this date
            </button>
            <button
              onClick={handleSaveRecurring}
              className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Save as recurring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
