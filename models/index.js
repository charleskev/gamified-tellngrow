/*
    MIT License
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
*/

import { sequelize } from "./db.js";
import { User } from "./userModel.js";
import { UserProgress } from "./Userprogressmodel.js";
import { GameSession } from "./Gamesessionmodel.js";
import { QuizSession } from "./Quizsessionmodel.js";
import { JournalEntry } from "./Journalentrymodel.js";
import { Activity } from "./Activitymodel.js";

// Setup relationships
User.hasOne(UserProgress, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserProgress.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(GameSession, { foreignKey: 'userId', onDelete: 'CASCADE' });
GameSession.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(QuizSession, { foreignKey: 'userId', onDelete: 'CASCADE' });
QuizSession.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(JournalEntry, { foreignKey: 'userId', onDelete: 'CASCADE' });
JournalEntry.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Activity, { foreignKey: 'userId', onDelete: 'CASCADE' });
Activity.belongsTo(User, { foreignKey: 'userId' });

// Sync models
export const syncModels = async () => {
  try {
    await sequelize.sync();
    console.log("✅ Database synced successfully");
  } catch (error) {
    console.error("❌ Error syncing database:", error);
  }
};

export { sequelize, User, UserProgress, GameSession, QuizSession, JournalEntry, Activity };
