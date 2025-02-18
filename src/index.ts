import dotenv from 'dotenv';
dotenv.config();
import './scheduler';
import { sendWeeklyProgramReminder } from './scheduler';

// Call the function once to test
sendWeeklyProgramReminder()
  .then(() => console.log('Reminder sent successfully!'))
  .catch((error) => console.error('Error sending reminder:', error));

console.log('Event Reminder Bot is running...');
