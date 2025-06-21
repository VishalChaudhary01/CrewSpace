/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { CardLayout } from "@/components/common/card-layout";
import { PasswordInput } from "@/components/common/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { signinMutationFn } from "@/lib/api";
import type { SigninInput } from "@/types/auth.type";
import { signinSchema } from "@/validators/auth.validator";

export const SignInPage = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: signinMutationFn,
  });

  const form = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(inputs: SigninInput) {
    if (isPending) return;
    mutate(
      { inputs },
      {
        onSuccess: (result) => {
          toast.success(result.message);
          navigate(`/workspace/${result?.data?.user?.currentWorkspace}`);
        },
        onError: (error: any) => {
          toast.error(error.response.data.message || "Failed to login");
        },
      },
    );
  }

  return (
    <div className="mx-auto flex justify-center py-8">
      <CardLayout
        header="SignIn"
        description="Welcome back, please enter your details to login."
        footer={
          <div>
            Don't have an account?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Sign Up
            </a>
          </div>
        }
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PasswordInput
              form={form}
              name="password"
              label="Password"
              placeholder="Enter your password"
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </CardLayout>
    </div>
  );
};
