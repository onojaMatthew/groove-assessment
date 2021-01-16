const path = require('path')
require('dotenv').config({ path: require('find-config')('.env') })
import User from '../entities/user';
import logger from '../utils/logger';
import { mailer } from "../utils/mailer";
import jwt from "jsonwebtoken";


/**
 * Given a json request 
 * {"username": "<...>", "password": "<...>"}
 * Verify the user is valid and return some authentication token
 * which can be used to verify protected resources
 * {"user": <{...}>, "token": "<...>""}
 */


export const login = async (req, res) => {
	const SECRET_KEY = "jsdkdjskdjfk"
	if (!req.body.username || !req.body.password) return res.status(400).json({ error: "Username and password are required" });
	try {
		const user = await User.findOne({ username: { $regex: req.body.username, $options: "i" } });
		if (!user) return res.status(404).json({ error: "User does not exist" });

		// Create an authentication token that expires in 2 day
		const token = jwt.sign({ _id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "2days"});

		const { email, name, username } = user;
		// save the token in the cookie
		res.cookie("token", token );
		// set the token as the value of x-auth-token in the header and send the token and 
		return res.header("x-auth-token", token).json({ token, user: { email, name, username }});
		
	} catch (error) {
		console.log(error)
		return res.status(400).json({ error: error.message });
	}
};

/**
 * Given a json request 
 * {"username": "<...>", "password": "<...>"}
 * Create a new user and return some authentication token 
 * which can be used to verify protected resources
 * {"user": <{...}>, "token": "<...>""}
 */
export const signup = async (req, res) => {
	
	const { name, email, password, username } = req.body;

	if (!name || !email || !password || !username) return res.status(400).json({ error: "All fields are required" });
	try {
		const isUserExists = await User.findOne({ email });
    if (isUserExists) return res.status(400).json({ error: `A user with the ${req.body.email} already exists` });
    let user = new User({
			name,
			email,
			username,
      password,
    });

    user = await user.save();
    if (!user) return res.status(400).json({ error: "Failed to register user. Please try again" });
    return res.json(user);
	} catch (error) {
		return logger.error(error.message);
	}
	// res.status(404).json({ err: "not implemented" })
};


/**
 * Implement a way to recover user accounts
 */
export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	const SECRET_KEY = "gibrishkey43uielsskjsdslkdaghhghgfggghjfg";

	if (!email) return res.status(400).json({ error: "Account email is required" });
	try {
		let user = await User.findOne({ email });
		if (!user) return res.status(400).json({ error: "User not found" });
		const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: "15m" });
		user.resetPasswordToken = token;
		const updatedUser = await user.save();
		if (!updatedUser) return res.status(400).json({ error: "Operation failed. Please try again" });
		const link = `http://${req.headers.host}/resetPassword/${token}`;
		const receiver = user.email;
		const text = "Groove Platform";
		const sender = "matthew.onoja@ojirehprime.com";
		const subject = "Password Reset Request";
		const message = `Hi ${user.name}\n 
		You sent a password reset request. Please click on the following link ${link} to reset your password. \n\n 
		If you did not request this, please ignore this email and your password will remain unchanged.\n`;

		const data = {
			to: receiver,
			from: sender,
			subject,
			text,
			html: message
		}

		return mailer(data, res);
		
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
	// res.status(404).json({ err: "not implemented" })
};

// export const resetPassword = async (req, res) => {

// }

export default {
	login,
	signup,
	forgotPassword,
}