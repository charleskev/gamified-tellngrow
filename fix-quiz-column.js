import { sequelize } from "./models/db.js";

try {
  // Alter the quizType column to accept longer strings
  await sequelize.query(`
    ALTER TABLE \`QuizSessions\` 
    MODIFY COLUMN \`quizType\` VARCHAR(255)
  `);
  
  console.log('✅ QuizSessions table updated: quizType column expanded to VARCHAR(255)');
  process.exit(0);
} catch (error) {
  console.error('❌ Error updating table:', error.message);
  process.exit(1);
}
