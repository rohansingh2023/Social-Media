import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({
      required_error: "Should be a String",
    })
    .email({
      message: "Invalid Email",
    }),

  password: z
    .string({
      required_error: "Should be a String",
    })
    .min(6, {
      message: "Password should be atleast 6 characters",
    }),
});
