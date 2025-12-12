import { User } from "../models/User.js";

export const activityLogger = async (req, res, next) => {
  if (req.session.userId) {
    try {
      await User.update(
        { lastActive: new Date() },
        { where: { id: req.session.userId } }
      );
    } catch (error) {
      console.error("Error updating last active:", error);
    }
  }
  next();
};