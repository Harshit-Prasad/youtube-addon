import asyncHandler from "express-async-handler";
import { generateToken, verifyToken } from "../config/jwt.js";
import User from "../models/user.model.js";

const signup = asyncHandler(async (req, res) => {
  const { name, picture, email } = req.body;

  if ((!name, !picture, !email)) {
    res.status(400);
    throw new Error("Invalid user information");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(401);
    throw new Error("User already exists");
  }

  const newUser = await User.create({
    name,
    picture,
    email,
  });

  const id = newUser._id;

  const token = generateToken(
    id,
    3600 * 24 * 365,
    process.env.JWT_SECRET
  );

  res.send({
    user: newUser,
    auth_tokens: { token, id },
  });
});

const login = asyncHandler(async (req, res) => {
  const { name, picture, email } = req.body;

  if ((!name, !picture, !email)) {
    res.status(400);
    throw new Error("Invalid user information");
  }

  const userExists = await User.findOne({ email });

  if (!userExists) {
    res.status(401);
    throw new Error("Sign up first");
  }

  const id = userExists._id;

  const token = generateToken(
    id,
    3600 * 24 * 365,
    process.env.JWT_SECRET
  );

  res.send({
    user: userExists,
    auth_tokens: { token, id },
  });
});

const verifyTokens = asyncHandler(async (req, res) => {
  const authTokens = req.body?.auth_tokens;

  if (!authTokens) {
    res.status(400);
    throw new Error("No Tokens");
  }

  const { access_token, refresh_token, id } = authTokens;

  const verifiedAccessToken = verifyToken(
    access_token,
    process.env.ACCESS_TOKEN_SECRET
  );
  const verifiedRefreshToken = verifyToken(
    refresh_token,
    process.env.REFRESH_TOKEN_SECRET
  );

  if (!verifiedAccessToken || !verifiedRefreshToken) {
    res.status(401);
    throw new Error("Invalid Token");
  }

  if (verifiedRefreshToken === "jwt expired") {
    res.status(403);
    throw new Error("Refresh Token Expired");
  }

  const userInfo = await User.findById(id);

  const user = {
    id: userInfo._id,
    name: userInfo.name,
    picture: userInfo.picture,
    role: userInfo.role,
    email: userInfo.email,
  };

  if (verifiedAccessToken === "jwt expired") {
    const newToken = generateToken(
      id,
      3600 * 6,
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      auth_tokens: {
        access_token: newToken,
        refresh_token: refresh_token,
        id,
      },
      user,
    });

    return;
  }

  res.json({
    auth_tokens: authTokens,
    user,
  });
});

const verifyTokenV2 = asyncHandler(async (req, res) => {
  const reqUser = req.body.user_info;
  const verifiedToken = verifyToken(req.body.auth_token.token, process.env.JWT_SECRET)

  if (verifiedToken === 'jwt expired') { }

  const user = await User.findById(verifiedToken.id);

  if (user.email !== reqUser.email || user.name !== reqUser.name) {
    res.status(403).send({ ok: false });
    return;
  }

  res.status(200).json({ ok: true, user })
})

const refreshToken = asyncHandler(async (req, res) => {
  const userInfo = req.body;

  if (!userInfo?.refresh_token) {
    res.status(400);
    throw new Error("No Token");
  }

  const id = userInfo?.id;

  const newRefreshToken = generateToken(
    id,
    "1d",
    process.env.REFRESH_TOKEN_SECRET
  );
  const newAccessToken = generateToken(
    id,
    3600 * 6,
    process.env.ACCESS_TOKEN_SECRET
  );

  const userData = await User.findOne({ _id: id });

  res.json({
    auth_tokens: {
      refresh_token: newRefreshToken,
      access_token: newAccessToken,
      id,
    },
    user: {
      id: userData._id,
      name: userData.name,
      picture: userData.picture,
      role: userData.role,
      email: userData.email,
    },
  });
});

const changeRole = asyncHandler(async (req, res) => {
  const updateRole = req.body.updateRole;
  const id = req.body.id;

  if (!id || !updateRole) {
    res.status(400);
    throw new Error("Update value or id missing");
  }

  const updated = await User.updateOne({ _id: id }, { $set: updateRole });

  res.send(updated);
});

export { signup, refreshToken, login, verifyTokens, verifyTokenV2, changeRole };
