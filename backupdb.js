const { exec } = require('child_process');
const cron = require('node-cron');
const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'play_actio_new',
  password: process.env.DATABASE_PASS,
  port: 5432,
})


// Backup configuration

const backupDirectory = '/var/www/code/play_actio_api'; // Directory to store backups
const backupFilename = 'play_actio_new.sql'; // Name of the backup file

// Function to run the backup

// ... (other parts of the code)

// Function to run the backup
async function runBackup() {
  try {
    // Set the PGPASSWORD environment variable with your PostgreSQL password
    process.env.PGPASSWORD = 'SC@2018SP';

    // Create the backups directory if it doesn't exist
    exec(`mkdir -p ${backupDirectory}`, async (error, stdout, stderr) => {
      if (error) {
        console.error('Error creating backup directory:', error);
      } else {
        // Backup the PostgreSQL database using pg_dump command with the PGPASSWORD environment variable
        exec(
          `pg_dump -U ${pool.options.user} -h ${pool.options.host} -d ${pool.options.database} -f ${backupDirectory}/${backupFilename}`,
          async (error, stdout, stderr) => {
            if (error) {
              console.error('Error creating backup:', error);
            } else {
              console.log('Backup created successfully:', `${backupDirectory}/${backupFilename}`);
            }
          }
        );
      }
    });
  } catch (err) {
    console.error('Error running backup:', err);  
  }
}

// ... (other parts of the code)




// Schedule the backup to run every Sunday at 1:00 AM (adjust the schedule as needed)
cron.schedule('0 1 * * 0', () => {
  runBackup();
});
