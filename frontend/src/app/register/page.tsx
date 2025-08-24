"use client";
import React from "react";
import api from "@/utils/axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useSession } from "next-auth/react";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<RegisterForm>();

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

  const onSubmit = async (data: RegisterForm) => {
    try {
      await api.post("/auth/register", data);
      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } catch (err: any) {
      // Handle backend field validation errors
      const apiError = err?.response?.data?.error;
      if (apiError && apiError.errors) {
        Object.entries(apiError.errors).forEach(([field, errorObj]: [string, any]) => {
          setError(field as keyof RegisterForm, { type: "server", message: errorObj.message });
        });
        toast.error(apiError.message || "Registration failed");
      } else {
        toast.error(err?.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Register
        </h2>
        <Input
          label="Name"
          type="text"
          registration={register("username", { required: "Name is required" })}
          error={errors.username}
          placeholder="Name"
        />
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
          Register
        </Button>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          Already have an account? <a href="/login" className="text-blue-600 dark:text-blue-400 underline">Login</a>
        </p>
      </form>
    </div>
  );
}
