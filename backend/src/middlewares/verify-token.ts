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
    try {
      const decoded = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
      return resolve(parent, args, context, info);
    } catch (error) {
      throw new GraphQLError("Token is Invalid", {
        extensions: {
          code: "UNAUTHORIZED",
          http: { status: 401 },
        },
      });
    }
  } else {
    throw new GraphQLError("You are not Authorized", {
      extensions: {
        code: "UNAUTHORIZED",
        http: { status: 401 },
      },
    });
  }
};
