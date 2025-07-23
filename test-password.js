import bcrypt from 'bcryptjs';

const testPassword = 'password123';
const hashedFromDB = '$2b$12$6sd2CjqKbwUuk49eZQdVDOjD35dqlt6IQ6zbM31sIO8R4R151vyLq';

console.log('Testing password:', testPassword);
console.log('Against hash:', hashedFromDB);
console.log('Password match:', bcrypt.compareSync(testPassword, hashedFromDB));

// Also test some common passwords
const commonPasswords = ['password', 'test123', 'admin', '123456'];
commonPasswords.forEach(pwd => {
  console.log(`Testing '${pwd}':`, bcrypt.compareSync(pwd, hashedFromDB));
});
