"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type State = {
  message?: string;
};

export async function authenticate(
  prevState: State | undefined,
  formData: FormData
): Promise<State | undefined> {
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { message: "Username and password are required." };
  }

  const { username, password } = parsed.data;

  // In a real application, you'd check credentials against a database
  if (username === "admin" && password === "password") {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    cookies().set("session", "authenticated", { expires, httpOnly: true });
    redirect("/admin/dashboard");
  }

  return { message: "Invalid username or password." };
}
