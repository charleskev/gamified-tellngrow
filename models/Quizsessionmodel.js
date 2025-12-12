import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { User } from "./userModel.js";

export const QuizSession = sequelize.define("QuizSession", {
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  quizType: { 
    type: DataTypes.STRING,
    allowNull: false 
  },
  startTime: { type: DataTypes.DATE },
  endTime: { type: DataTypes.DATE },
  duration: { type: DataTypes.INTEGER },
  difficulty: { 
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'easy'
  },
  questions: { type: DataTypes.JSON },
  score: { type: DataTypes.INTEGER },
  points: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalQuestions: { type: DataTypes.INTEGER },
  correctAnswers: { type: DataTypes.INTEGER },
  performanceLevel: { 
    type: DataTypes.ENUM('beginner', 'intermediate', 'pro'),
    defaultValue: 'beginner'
  }
});

QuizSession.belongsTo(User, { foreignKey: 'userId' });
export { sequelize };
