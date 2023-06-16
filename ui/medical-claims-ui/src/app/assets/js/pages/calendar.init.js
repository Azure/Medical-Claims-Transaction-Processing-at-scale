/**
* Theme: T-Wind - Tailwind Admin Dashboard Template
* Author: Mannatthemes
* Component: Full-Calendar
*/


document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    defaultDate: '2022-06-12',
    timeZone: 'UTC',
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    events: [
      {
        title: 'Business Lunch',
        start: '2022-06-03T13:00:00',
        constraint: 'businessHours',
        className: 'bg-soft-warning',
      },
      {
        title: 'Meeting',
        start: '2022-06-13T11:00:00',
        constraint: 'availableForMeeting', // defined below
        className: 'bg-soft-purple',
        textColor: 'white'
      },
      {
        title: 'Conference',
        start: '2022-06-27',
        end: '2022-06-29',
        className: 'bg-soft-primary',
      },

      {
        title: 'Conference',
        start: '2022-03-27',
        end: '2022-02-29',
        className: 'bg-blue-100 text-blue-500',
      },
      
      // areas where "Meeting" must be dropped
      {
        groupId: 'availableForMeeting',
        start: '2022-06-11T10:00:00',
        end: '2022-06-11T16:00:00',
        title: 'Repeating Event',
        className: 'bg-soft-purple',
      },
      {
        groupId: 'availableForMeeting',
        start: '2022-06-15T10:00:00',
        end: '2022-06-15T16:00:00',
        title: 'holiday',
        className: 'bg-soft-success',
      },

      {
        groupId: 'availableForMeeting',
        start: '2022-02-15T10:00:00',
        end: '2022-02-15T16:00:00',
        title: 'holiday',
        className: 'bg-soft-success',
      },

      // red areas where no events can be dropped
      
      {
        start: '2022-06-06',
        end: '2022-06-08',
        overlap: false,
        title: 'New Event',
        className: 'bg-soft-pink',
      }
    ],
  });

  calendar.render();
});

