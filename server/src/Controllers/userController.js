const userService = require("../Services/userService");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
};

exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.getUserByEmail(email, password);

    res.json({ user, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, street, city, zip } = req.body;

    const address = { street, city, zip };

    const newUser = await userService.createUser(
      username,
      email,
      password,
      address
    );

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, street, city, zip } = req.body;
    const updatedUser = await userService.updateUser(
      id,
      username,
      email,
      password,
      street,
      city,
      zip
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};