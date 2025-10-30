import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import WeekScroller from './components/WeekScroller';
import SlotEditor from './components/SlotEditor';

function startOfWeek(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday=0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addWeeks(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n * 7);
  return x;
}

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

// App-level scheduler state
// - recurring: array of { weekday: 0..6 (Mon=0), start: 'HH:MM', end: 'HH:MM' }
// - exceptions: { [YYYY-MM-DD]: array of slots for that date (0..2), scope='exception' }
export default function App() {
  const [anchorWeekStart, setAnchorWeekStart] = useState(() => startOfWeek(new Date()));

  const [recurring, setRecurring] = useState([
    // Example default recurring slot: Monday 9–11
    // { weekday: 0, start: '09:00', end: '11:00' }
  ]);

  const [exceptions, setExceptions] = useState({});

  const [editor, setEditor] = useState({ open: false, date: null, initial: null, editIndex: -1 });

  function slotsForDate(date) {
    const key = dateKey(date);
    if (exceptions[key]) {
      return exceptions[key].map((s) => ({ ...s, scope: 'exception' }));
    }
    const weekday = (date.getDay() + 6) % 7; // Monday=0
    return recurring
      .filter((r) => r.weekday === weekday)
      .map((s) => ({ ...s, scope: 'recurring' }));
  }

  function enforceMaxTwo(slots) {
    return slots.slice(0, 2);
  }

  function openCreateEditor(date) {
    setEditor({ open: true, date, initial: null, editIndex: -1 });
  }

  function openEditEditor(date, slot, index) {
    setEditor({ open: true, date, initial: { start: slot.start, end: slot.end }, editIndex: index });
  }

  function closeEditor() {
    setEditor({ open: false, date: null, initial: null, editIndex: -1 });
  }

  function upsertExceptionForDate(date, updater) {
    const key = dateKey(date);
    setExceptions((prev) => {
      const existing = prev[key] ?? slotsForDate(date).filter((s) => s.scope !== 'recurring');
      // Note: if no exception, default to [] so user can create new slot overriding recurring
      const current = Array.isArray(prev[key]) ? prev[key] : [];
      const next = updater(current.length ? current : []);
      return { ...prev, [key]: enforceMaxTwo(next) };
    });
  }

  function handleSaveThisDate(payload) {
    const { date: d, initial, editIndex } = editor;
    upsertExceptionForDate(d, (current) => {
      const draft = [...current];
      if (initial && editIndex > -1) {
        draft[editIndex] = { start: payload.start, end: payload.end };
      } else {
        draft.push({ start: payload.start, end: payload.end });
      }
      // Sort by time for nicer display
      draft.sort((a, b) => (a.start < b.start ? -1 : 1));
      return draft;
    });
    closeEditor();
  }

  function handleSaveRecurring(payload) {
    const { date: d, initial, editIndex } = editor;
    const weekday = (d.getDay() + 6) % 7;

    setRecurring((prev) => {
      let list = [...prev];
      if (initial && editIndex > -1) {
        // Editing a recurring slot is ambiguous if the visible slot was exception.
        // Here, we create/overwrite a recurring slot for this weekday.
      }
      list.push({ weekday, start: payload.start, end: payload.end });
      // Keep at most 2 recurring for this weekday
      const xs = list.filter((r) => r.weekday === weekday)
        .sort((a, b) => (a.start < b.start ? -1 : 1))
        .slice(0, 2);
      const rest = list.filter((r) => r.weekday !== weekday);
      return [...rest, ...xs];
    });

    // Remove exception for this date if it exactly matches recurring after creating
    setExceptions((prev) => {
      const key = dateKey(d);
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    closeEditor();
  }

  function handleDelete(date, slot, index) {
    const key = dateKey(date);
    const daySlots = slotsForDate(date);

    if (exceptions[key]) {
      // Delete from exception list
      setExceptions((prev) => {
        const next = [...(prev[key] || [])];
        next.splice(index, 1);
        return { ...prev, [key]: next };
      });
      return;
    }

    // If it was recurring, create an exception for this date that excludes this slot
    const filtered = daySlots
      .filter((_, i) => i !== index)
      .map((s) => ({ start: s.start, end: s.end }));
    setExceptions((prev) => ({ ...prev, [key]: filtered }));
  }

  function onPrevWeek() {
    setAnchorWeekStart((w) => addWeeks(w, -1));
  }
  function onNextWeek() {
    setAnchorWeekStart((w) => addWeeks(w, 1));
  }
  function onToday() {
    setAnchorWeekStart(startOfWeek(new Date()));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <Header
        currentWeekStart={anchorWeekStart}
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
        onToday={onToday}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <p className="text-sm text-gray-600">Create recurring weekly slots and make exceptions by editing or deleting a specific date. Each day supports up to two slots.</p>

        <WeekScroller
          slotsForDate={slotsForDate}
          onAddSlot={(d) => openCreateEditor(d)}
          onEditSlot={(d, slot, idx) => openEditEditor(d, slot, idx)}
          onDeleteSlot={(d, slot, idx) => handleDelete(d, slot, idx)}
          anchorWeekStart={anchorWeekStart}
        />
      </main>

      <SlotEditor
        open={editor.open}
        date={editor.date || new Date()}
        initial={editor.initial}
        onClose={closeEditor}
        onSaveThisDate={handleSaveThisDate}
        onSaveRecurring={handleSaveRecurring}
      />
    </div>
  );
}
