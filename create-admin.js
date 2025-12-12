/*
    Create Admin User Script
    Run this to create the admin account
*/

import bcrypt from 'bcrypt';
import { User, sequelize } from './models/index.js';

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'angelica@gmail.com' } });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('pogi123', 10);

    // Create admin user
    const admin = await User.create({
      name: 'Angelica Admin',
      email: 'angelica@gmail.com',
      password: hashedPassword,
      role: 'admin',
      firstName: 'Angelica',
      lastName: 'Admin',
      notifications: true,
      soundEffects: true,
      theme: 'light'
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: angelica@gmail.com');
    console.log('🔐 Password: pogi123');
    console.log('👤 Name:', admin.name);
    console.log('🔑 Role:', admin.role);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdmin();
