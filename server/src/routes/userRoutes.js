const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController");

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.post("/login", userController.login);
router.post("/register", userController.register);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;