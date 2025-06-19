/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signupMutationFn } from "@/lib/api";
import type { SignupInput } from "@/types/auth.type";
import { signupSchema } from "@/validators/auth.validator";
import { CardLayout } from "@/components/common/card-layout";
import { PasswordInput } from "@/components/common/password-input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({ mutationFn: signupMutationFn });

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(inputs: SignupInput) {
    if (isPending) return;
    mutate(
      { inputs },
      {
        onSuccess: (result) => {
          navigate(`/workspace/${result.data?.user?.currentWorkspace}`);
          toast.success(result.message);
        },
        onError: (error: any) => {
          toast.error(error.response.data.message || "Failed to register");
        },
      },
    );
  }

  return (
    <div className='flex justify-center py-8 mx-auto'>
      <CardLayout
        header='SignUp'
        description='Welcome, please enter your details to Create an account.'
        footer={
          <div>
            Already have an account?{" "}
            <a href='/' className='text-primary hover:underline'>
              Sign In
            </a>
          </div>
        }
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your full name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your email address' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PasswordInput
              form={form}
              name='password'
              label='Password'
              placeholder='Enter your password'
            />
            <PasswordInput
              form={form}
              name='confirmPassword'
              label='Confirm Password'
              placeholder='Confirm your password'
            />
            <Button type='submit' disabled={isPending} className='w-full'>
              {isPending ? (
                <Loader className='w-4 h-4 animate-spin' />
              ) : (
                "Sign In"
              )}
            </Button>{" "}
          </form>
        </Form>
      </CardLayout>
    </div>
  );
};
