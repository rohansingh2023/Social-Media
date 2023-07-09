import jwt from "jsonwebtoken";
import { UserPayload } from "../types";

export const getCurrentUserData = async (
  resolve: any,
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  if (!context.req.session?.jwt) {
    throw new Error("First authenticate!!!");
  }
  const payload = jwt.verify(
    context.req.session.jwt,
    `${process.env.JWT_SECRET_KEY}`
  ) as UserPayload;
  const contextwWithDefaults = { payload, ...context };
  return resolve(parent, args, contextwWithDefaults, info);
};
