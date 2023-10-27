const express = require("express");
const router = express.Router();

const {
	registerUser,
	loginUser,
	getUserProfile,
	updateUserProfile,
    getUsersWithRoomId,
} = require("../controllers/userController");
const { isAuthenticatedUser, veryfyAdmin } = require("../middlewares/auth");
const { logoutUser } = require("../controllers/userController");
const { getAllUsers } = require("../controllers/userController");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile")
	.get(isAuthenticatedUser, getUserProfile)
	.put(isAuthenticatedUser, updateUserProfile);
router.route("/logout").get(logoutUser);
router.route("/user/:id").get(getUsersWithRoomId);

// admin routes
router.route("/admin/users").get(isAuthenticatedUser, veryfyAdmin, getAllUsers);

module.exports = router;