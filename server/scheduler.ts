import cron from 'node-cron';
import { exportAllDataToSheets } from './google-sheets';

// Schedule data export to Google Sheets
export function setupDataExportScheduler() {
  // Export data every day at 2 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('🕒 Running scheduled data export...');
    await exportAllDataToSheets();
  });

  // Export data every Monday at 9 AM (weekly summary)
  cron.schedule('0 9 * * 1', async () => {
    console.log('🕒 Running weekly data export...');
    await exportAllDataToSheets();
  });

  console.log('📅 Data export scheduler initialized');
  console.log('  - Daily export: 2:00 AM');
  console.log('  - Weekly export: Monday 9:00 AM');
}

// Export data immediately (for testing)
export async function triggerImmediateExport() {
  console.log('🚀 Triggering immediate data export...');
  await exportAllDataToSheets();
}