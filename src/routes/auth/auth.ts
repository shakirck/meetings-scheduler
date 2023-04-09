import { Router } from "express";
import Auth from "../../oauth/google";
const router = Router();

import User from "../../models/user";

router.get("/login", async (req, res) => {
  const auth = new Auth();
  

  const scopes = ["https://www.googleapis.com/auth/calendar"];
  const url = await auth.getAuthUrl();

  res.redirect(url);
});

router.get("/gmail/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    res.send("error");
  }

  const auth = new Auth();
  console.log("code", code);
  const data = await auth.getAccessToken(code as string);
  console.log(data);
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
