"use client";
import React from "react";
import api from "@/utils/axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useSession, signIn } from "next-auth/react";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg font-semibold">Checking authentication...</span>
      </div>
    );
  }

  const onSubmit = async (data: LoginForm) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (res?.error) {
      toast.error(res.error || "Login failed");
    } else {
      toast.success("Login successful!");
      // Wait for session to update
      setTimeout(() => {
        const role = (session?.user as any)?.role;
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "user") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }, 200);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Login
        </h2>
        <Input
          label="Email"
          type="email"
          registration={register("email", { required: "Email is required" })}
          error={errors.email}
          placeholder="Email"
        />
        <Input
          label="Password"
          type="password"
          registration={register("password", { required: "Password is required" })}
          error={errors.password}
          placeholder="Password"
        />
        <Button type="submit" loading={isSubmitting}>
          Login
        </Button>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          Don't have an account? <a href="/register" className="text-blue-600 dark:text-blue-400 underline">Register</a>
        </p>
      </form>
    </div>
  );
}

