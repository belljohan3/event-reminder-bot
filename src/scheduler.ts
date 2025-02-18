import cron from 'node-cron';
import { fetchCalendarEvents } from './icalService';
import { sendMessage } from './telegramService';

// Function to check if an event is tomorrow
function isEventTomorrow(eventDate: Date): boolean {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1); // set to tomorrow

  return (
    eventDate.getFullYear() === tomorrow.getFullYear() &&
    eventDate.getMonth() === tomorrow.getMonth() &&
    eventDate.getDate() === tomorrow.getDate()
  );
}

// Function to format the event date and time with capitalized day name
function formatEventDate(eventDate: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short', // Show abbreviated month name
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24-hour time format
  };
  const formattedDate = eventDate.toLocaleDateString('fr-FR', options);
  return formattedDate; // Shortened date format: "dd MMM, HH:mm"
}

// Function to format event reminder message
function formatEventReminder(event: any) {
  const eventSummary = event.summary;
  const eventStart = new Date(event.start);
  const eventStartDate = formatEventDate(eventStart); // This includes start date and time
  const eventLocation = 'Maképé Maturité, Ange Raphaël'; // Use location from event, or default

  // Event format: name on one line, start date and time on the next line, end date/time below it, location below that
  return `**${eventSummary}**\n${eventStartDate}\n${eventLocation}\n\n`;
}

// This function checks for upcoming events and sends a combined reminder message
async function sendWeeklyProgramReminder() {
  try {
    const events = await fetchCalendarEvents();
    const upcomingWeekEvents = events.filter((event) => {
      const eventStart = new Date(event.start);
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + 1); // This Monday

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // This Sunday

      return eventStart >= weekStart && eventStart <= weekEnd; // Check if event is within the current week
    });

    if (upcomingWeekEvents.length > 0) {
      let weeklyMessage =
        '**Salut à tous.**\n\n 📅 **Les évenements de la semaine:**\n\n';
      upcomingWeekEvents.forEach((event) => {
        weeklyMessage += formatEventReminder(event);
      });

      // Send the weekly message
      await sendMessage(weeklyMessage);
    } else {
      console.log('No events for the upcoming week.');
    }
  } catch (error) {
    console.error('Error fetching or sending weekly program reminder:', error);
  }
}

// This function sends reminders for events happening tomorrow
async function sendTomorrowEventReminders() {
  try {
    const events = await fetchCalendarEvents();
    const tomorrowEvents = events.filter((event) =>
      isEventTomorrow(new Date(event.start)),
    );

    if (tomorrowEvents.length > 0) {
      let reminderMessage = '**📅Rappel !!**\n\n';

      tomorrowEvents.forEach((event) => {
        reminderMessage += formatEventReminder(event);
      });

      // Send the formatted message for tomorrow's events
      await sendMessage(reminderMessage);
    } else {
      console.log('No events happening tomorrow.');
    }
  } catch (error) {
    console.error('Error fetching or sending event reminders:', error);
  }
}

// Schedule to send weekly program every Monday at 8 AM
cron.schedule('0 8 * * 1', sendWeeklyProgramReminder);

// Schedule to send event reminders one day before the event at 8 AM
cron.schedule('0 8 * * *', sendTomorrowEventReminders);

export { sendWeeklyProgramReminder, sendTomorrowEventReminders };
