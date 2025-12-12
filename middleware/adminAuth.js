import { User } from "../models/User.js";

export const adminAuth = async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  
  const user = await User.findByPk(req.session.userId);
  
  if (!user || user.role !== 'admin') {
    return res.status(403).send("Access denied. Admin only.");
  }
  
  req.user = user;
  next();
};

