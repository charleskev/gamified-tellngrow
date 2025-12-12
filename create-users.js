import bcrypt from "bcrypt";
import { User, UserProgress, sequelize } from "./models/index.js";

await sequelize.sync();

try {
  // Create student user (charles)
  const hashedPassword1 = await bcrypt.hash("pogi123", 10);
  const charles = await User.create({
    name: "charles",
    email: "charles@gmail.com",
    password: hashedPassword1,
    role: "user",
    firstName: "Charles",
    lastName: "User"
  });

  // Create UserProgress for charles
  await UserProgress.create({
    userId: charles.id,
    totalGamesPlayed: 0,
    totalQuizzesTaken: 0,
    totalJournalEntries: 0,
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    level: "beginner",
    breathingBubbleStats: {},
    colorTapStats: {},
    gridMemoryStats: {},
    stressBallStats: {},
    calmTriviaStats: {},
    paperCardsStats: {},
    achievements: []
  });

  console.log("✅ Student account created:");
  console.log(`   Email: charles@gmail.com`);
  console.log(`   Password: pogi123`);
  console.log(`   Role: user`);

  // Create admin user (angelica)
  const hashedPassword2 = await bcrypt.hash("pogi123", 10);
  const angelica = await User.create({
    name: "angelica",
    email: "angelica@gmail.com",
    password: hashedPassword2,
    role: "admin",
    firstName: "Angelica",
    lastName: "Admin"
  });

  // Create UserProgress for angelica
  await UserProgress.create({
    userId: angelica.id,
    totalGamesPlayed: 0,
    totalQuizzesTaken: 0,
    totalJournalEntries: 0,
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    level: "beginner",
    breathingBubbleStats: {},
    colorTapStats: {},
    gridMemoryStats: {},
    stressBallStats: {},
    calmTriviaStats: {},
    paperCardsStats: {},
    achievements: []
  });

  console.log("\n✅ Admin account created:");
  console.log(`   Email: angelica@gmail.com`);
  console.log(`   Password: pogi123`);
  console.log(`   Role: admin`);

  console.log("\n✅ Both accounts created successfully!");
  process.exit(0);
} catch (error) {
  console.error("❌ Error creating accounts:", error.message);
  process.exit(1);
}
