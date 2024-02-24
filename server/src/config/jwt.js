import jwt from "jsonwebtoken";

export const generateToken = (id, duration, secret) => {
  return jwt.sign({ id }, secret, {
    expiresIn: duration,
  });
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.message === "jwt expired") {
      return error.message;
    }

    return null;
  }
};
