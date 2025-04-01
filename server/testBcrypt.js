import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash('password', 10);

console.log(hashedPassword)
const enteredPassword = "password";  // Replace with the exact password you used during registration
const storedHashedPassword = hashedPassword; // Your hashed password

(async () => {
    const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
    console.log("Password match result:", isMatch ? "Success" : "Failure");
})();
