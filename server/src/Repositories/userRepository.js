const pool = require("../config/db");
const Address = require("../models/Address");
const User = require("../models/User");

exports.findAll = async () => {
    const result = await pool.query("SELECT * FROM users");
    return result.rows.map(row => {
        const address = new Address(row.street, row.city, row.zip);
        return new User(row.id, row.username, row.email, row.password, address);
    });
}

exports.findById = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
  if (!result.rows[0]) return null;

  const row = result.rows[0];
  const address = new Address(row.street, row.city, row.zip);
  return new User(row.id, row.username, row.email, row.password, address);
};

exports.findByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (!result.rows[0]) return null;

  const row = result.rows[0];
  const address = new Address(row.street, row.city, row.zip);

  return new User(
    row.id,
    row.name,
    row.email,
    row.password,
    address
  );
};

exports.updateUser = async (id, username, email, password, street, city, zip) => {
  const result = await pool.query(
    `UPDATE users
     SET username=$1, email=$2, password=$3, street=$4, city=$5, zip=$6
     WHERE id=$7
     RETURNING *`,
    [username, email, password, street, city, zip, id]
  );

  const row = result.rows[0];
  const address = new Address(row.street, row.city, row.zip);
  return new User(row.id, row.username, row.email, row.password, address);
};

exports.createUser = async (username, email, hashedPassword, street, city, zip) => {
  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, password, street, city, zip)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [username, email, hashedPassword, street || null, city || null, zip || null]
    );

    const row = result.rows[0];
    const address = new Address(row.street, row.city, row.zip);
    return new User(row.id, row.username, row.email, undefined, address);
  } catch (err) {
    if (err.code === "23505") {
      throw new Error("Email already exists");
    }
    throw err;
  }
};

exports.deleteUser = async (id) => {
  await pool.query("DELETE FROM users WHERE id=$1", [id]);
};
