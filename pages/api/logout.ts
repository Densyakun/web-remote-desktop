import { withSessionRoute } from "../../lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import type { User } from "./user";

export default withSessionRoute(logoutRoute);

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  req.session.destroy();
  res.json({
    isLoggedIn: false,
    loginPasswordIsExist: !!process.env.LOGIN_PASSWORD,
  });
}
