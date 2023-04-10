import { Router } from "express";
import Auth from "../../oauth/google";
const authrouter = Router();

import User from "../../models/user";
import mongoose from "mongoose";

/**
 * @openapi
 * /auth/login:
 *  get:
 *     tags:
 *     - AUTH
 *     description: Login with google oauth
 *     responses:
 *       200:
 *         description: Google login success
 */
authrouter.get("/login", async (req, res) => {
  const auth = new Auth();
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  const url = await auth.getAuthUrl();

  res.redirect(url);
});
authrouter.get("/test", async (req, res) => {
  res.json({
    message: "success",
  })
});

/**
 * @openapi
 * /auth/gmail/callback:
 *  get:
 *    tags:
 *    - AUTH
 *    description: callback url for google oauth , it also fetches tokens and user info from google
 *    responses:
 *      200:
 *        description:  oauth success
 */
authrouter.get("/gmail/callback", async (req, res) => {
  try {
    console.log(req.query)
    const code = req.query.code;
    console.log(code);
    if (!code) {
      return  res.json({
        status: false,
        message: "No code",
        error:true
      })
    }

    const auth = new Auth();
    const data = await auth.getAccessToken(code as string);

    try {
      await mongoose.connect(process.env.MONGODB_URI|| "")

  } catch (error) {   
      console.log("Error connecting to mongo",error);
      console.log(process.env.MONGODB_URI)
      
  }
    const user = await User.findOne({ email: data.email });
    if (user) {
      user.token = data.tokens;
      await user.save();
    } else {
      await User.create({
        email: data.email,
        name: data.name,
        token: data.tokens,
      });
    }

   return  res.json({
      message: "success",
      data: data,
    });
  } catch (error) {
    return res.json({
      message: "error",
      error: error,
    });
  }
});

export default authrouter;
