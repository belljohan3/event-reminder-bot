import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

// Function to send messages to the Telegram group
export async function sendMessage(text: string) {
  const chatId = process.env.TELEGRAM_GROUP_ID!;
  try {
    // Send the message with parse_mode set to 'MarkdownV2'
    await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    console.log('Message sent:', text);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}
