import axios from "axios";
import * as ical from "node-ical";

interface CalendarEvent {
  summary: string;
  start: Date;
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  const url = process.env.ICAL_FEED_URL;
  if (!url) throw new Error("Missing iCal feed URL");

  const response = await axios.get(url);
  const events: Record<string, any> = ical.parseICS(response.data); // Using `any` to handle missing types

  const eventList: CalendarEvent[] = [];

  for (const key in events) {
    const event = events[key];
    if (event.type === "VEVENT" && event.start) {
      eventList.push({ summary: event.summary, start: new Date(event.start) });
    }
  }

  return eventList;
}
