const userRepository = require("../Repositories/userRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;

exports.getAllUsers = async () => {
  return userRepository.findAll();
};

exports.getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error("User not found");
  return user;
};

exports.getUserByEmail = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
  );

  user.password = undefined;

  return { user, token };
};

exports.createUser = async (username, email, password, address, role) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await userRepository.createUser(
    username,
    email,
    hashedPassword,
    address?.street || null,
    address?.city || null,
    address?.zip || null,
    role || "user"
  );

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
  );

  user.password = undefined;

  return { user, token };
};

exports.updateUser = async (
  id,
  username,
  email,
  password,
  street,
  city,
  zip,
  role
) => {
  const hashedPassword = password
    ? await bcrypt.hash(password, SALT_ROUNDS)
    : null;

  return userRepository.updateUser(
    id,
    username,
    email,
    hashedPassword,
    street,
    city,
    zip,
    role
  );
};

exports.deleteUser = async (id) => {
  await userRepository.deleteUser(id);
};
