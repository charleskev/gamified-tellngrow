import { sequelize } from "./models/db.js";

try {
  // Alter the type column to include 'registration' in ENUM
  await sequelize.query(`
    ALTER TABLE \`Activities\` 
    MODIFY COLUMN \`type\` ENUM('game', 'quiz', 'journal', 'login', 'registration', 'achievement')
  `);
  
  console.log('✅ Activities table updated: type column now includes "registration"');
  process.exit(0);
} catch (error) {
  console.error('❌ Error updating table:', error.message);
  process.exit(1);
}
