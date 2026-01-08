const Address = require("./Address");

class User {
  constructor(id, username, email, password, address, role = "user") {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.address = address;
    this.role = role;
  }
}

module.exports = User;