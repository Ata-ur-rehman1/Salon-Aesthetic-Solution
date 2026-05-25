import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  if (!process.env.JWT_SECRET) {
    const msg = 'JWT_SECRET is not set in environment. Cannot generate token.';
    console.error(msg);
    throw new Error(msg);
  }

  let token;
  try {
    token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
  } catch (err) {
    console.error('Error signing JWT:', err && err.stack ? err.stack : err);
    throw new Error('Failed to generate JWT. Check JWT_SECRET and signing options.');
  }

  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined; // e.g., .vercel.app or .yourdomain.com
  try {
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Use secure in production
      sameSite: process.env.NODE_ENV !== "development" ? "none" : "strict", // None for cross-site
      path: "/",
      ...(cookieDomain ? { domain: cookieDomain } : {}),
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  } catch (err) {
    console.error('Error setting jwt cookie:', err && err.stack ? err.stack : err);
    // Cookie failures shouldn't leak secrets; rethrow a generic message
    throw new Error('Failed to set authentication cookie.');
  }

  return token;
};

export default generateToken;
