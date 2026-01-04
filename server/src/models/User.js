const Address = require("./Address");

class User {
  constructor(id, username, email, password, address) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.address = address;
  }
}

module.exports = User;