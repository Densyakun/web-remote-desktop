import type { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
} from "next";
import type { User } from "../pages/api/user";

export const sessionOptions = (): IronSessionOptions => {
  return {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "web_remote_desktop",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
};

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
  handler: (
    context: GetServerSidePropsContext,
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return withIronSessionSsr(handler, sessionOptions);
}