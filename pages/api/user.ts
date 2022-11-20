import { withSessionRoute } from "../../lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

export type User = {
  isLoggedIn: boolean;
  loginPasswordIsExist: boolean;
};

export default withSessionRoute(userRoute);

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (!process.env.LOGIN_PASSWORD) {
    res.json({
      isLoggedIn: true,
      loginPasswordIsExist: false,
    });
  } else if (req.session.user) {
    res.json({
      ...req.session.user,
      isLoggedIn: true,
      loginPasswordIsExist: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
      loginPasswordIsExist: true,
    });
  }
}
