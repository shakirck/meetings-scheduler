import { Router } from "express";
import Auth from "../../oauth/google";
const router = Router();

import User from "../../models/user";

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
router.get("/login", async (req, res) => {
  const auth = new Auth();
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  const url = await auth.getAuthUrl();

  res.redirect(url);
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
router.get("/gmail/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    res.send("error");
  }

  const auth = new Auth();
   const data = await auth.getAccessToken(code as string);
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

  res.send("success");
});

export default router;
