import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

export const verifyToken = async (
  resolve: any,
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(
      token,
      `${process.env.JWT_SECRET_KEY}`,
      (err: any, user: any) => {
        if (err) {
          throw new GraphQLError("Token is invalid");
        }
        return resolve(parent, args, context, info);
      }
    );
  } else {
    throw new GraphQLError("You are not Authorized", {
      extensions: {
        code: "UNAUTHORIZED",
        http: { status: 401 },
      },
    });
  }
};
