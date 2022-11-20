import type { User } from "./user";

import { withSessionRoute } from "../../lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(loginRoute);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { password } = await req.body;

  try {
    if (process.env.LOGIN_PASSWORD && password !== process.env.LOGIN_PASSWORD) throw new Error("Password is incorrect.");

    const user: User = {
      isLoggedIn: true,
      loginPasswordIsExist: !!process.env.LOGIN_PASSWORD,
    };
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
