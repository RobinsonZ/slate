import React, { useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { SlateDataContext } from '../context/context';

//TODOL: sepaate Boardview and Calendar View into two different components

// Use context to get columns data
const { columns } = useContext(SlateDataContext);

// Define events by mapping over columns and cards
const events = columns.flatMap(column =>
  column.cards
    .filter(card => card.type === "day" && card.startDate)
    .map(card => ({ start: new Date(card.startDate), id: card.id }))
);

export function Calendar() {
  // State to toggle calendar view
  const [calendarView, setCalendarView] = useState(false);

  // Function to toggle calendar view
  const toggleCalendarView = () => {
    setCalendarView(!calendarView);
  };

  return (
    <div>
      <h1>Slate</h1>
      {/* Button to toggle calendar view */}
      <button onClick={toggleCalendarView}>
        Toggle Calendar View
      </button>
      
      {/* Conditional rendering of calendar or board view */}
      {calendarView ? (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView='dayGridMonth'
          weekends={true}
          events={events}
        />
      ) : (
      )}
    </div>
  );
}