"use server";
// import { LoginFormSchema, SignupFormSchema } from "../lib/definitions";

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
  
    // const parsedData = LoginFormSchema.safeParse({ email, password });
    // if (!parsedData.success) {
    //   return { error: "Invalid input format" };
    // }
  
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok || data.responseSuccessful === false) {
        return { error: data.responseMessage || "Login failed" };
      }
  
      return { success: true, data: data };
    } catch (error) {
      console.error("Login error:", error);
      return { error: "An unexpected error occurred" };
    }
  }
  



export async function registerAction(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;


//   const parsedData = SignupFormSchema.safeParse({ username, email, password });
//   if (!parsedData.success) {
//     return { errors: parsedData.error.flatten().fieldErrors };
//   }

  try {
    const response = await fetch("http://localhost:8080/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Registration failed" };
    }

    const data = await response.json();
    return { success: true, data: data };

  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An unexpected error occurred" };
  }
}
