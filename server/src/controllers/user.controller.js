import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

function getUserCredentials(req, res) {
  const { token } = req.params;

  if (!token) return res.send({ ok: false });

  // const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return res.send({ ...decoded, ok: true });
}

function setUserCredentials(req, res) {
  const { name, role, bgColor } = req.body;

  const id = uuid();

  const user = {
    id,
    name,
    role,
    bgColor,
    authorized: true,
  };

  // const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "30d" });

  return res.send({ ...user, ok: true });
}

export { getUserCredentials, setUserCredentials };
