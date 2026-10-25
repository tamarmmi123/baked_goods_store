const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController");

const auth = require("../middlewares/auth");
const requireAdmin = require("../middlewares/requireAdmin");

router.get("/", auth, requireAdmin, userController.getAllUsers);
router.get("/user", auth, userController.getMe);
router.get("/:id", auth, requireAdmin, userController.getUser);
router.post("/login", userController.login);
router.post("/register", userController.register);
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, requireAdmin, userController.deleteUser);

module.exports = router;