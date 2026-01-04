const userRepository = require("../Repositories/userRepository");

exports.getAllUsers = async () => {
    return userRepository.findAll();
}

exports.getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error("User not found");
  return user;
};

exports.getUserByEmail = async (email, password) => {
    const user = await userRepository.findByEmail(email, password);
    if (!user) throw new Error("Incorrect email or password");
    return user;
}

exports.createUser = async (username, email, password, street, city, zip) => {
  return userRepository.createUser(username, email, password, street, city, zip);
};

exports.updateUser = async (id, username, email, password, street, city, zip) => {
  return userRepository.updateUser(id, username, email, password, street, city, zip);
};

exports.deleteUser = async (id) => {
  await userRepository.deleteUser(id);
}