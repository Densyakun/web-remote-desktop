module.exports.ironOptions = () => {
  return {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: "web_remote_desktop",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  };
};