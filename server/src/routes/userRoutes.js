const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController");

const auth = require("../middlewares/auth");

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.post("/login", userController.login);
router.post("/register", userController.register);
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);
router.get("/user", auth, userController.getMe);

module.exports = router;