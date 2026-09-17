const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient();
p.user.findUnique({where: {email: 'admin@sih.gov.in'}}).then(u => { 
  console.log('User:', u); 
  return bcrypt.compare('password123', u.passwordHash); 
}).then(valid => console.log('Password valid:', valid)).catch(console.error).finally(() => p.$disconnect())