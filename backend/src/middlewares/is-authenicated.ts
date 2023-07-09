export const is_Authenticated = async (
  resolve: any,
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  if (!context.req.session?.jwt) {
    throw new Error("First authenticate!!!");
  }
  return resolve(parent, args, context, info);
};
