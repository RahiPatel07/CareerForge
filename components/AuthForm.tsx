"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="w-full max-w-md animate-fadeIn">
      <div className="card-modern p-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center shadow-lg">
              <Image src="/logo.svg" alt="logo" height={24} width={24} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            {isSignIn ? "Welcome Back" : "Get Started"}
          </h2>
          <p className="text-text-secondary">
            {isSignIn 
              ? "Sign in to continue your interview practice" 
              : "Create an account to start practicing"}
          </p>
        </div>

        {/* Decorative Element */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border-medium to-transparent"></div>
          <span className="text-xs text-text-muted font-semibold">
            {isSignIn ? "SIGN IN" : "CREATE ACCOUNT"}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border-medium to-transparent"></div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Full Name"
                placeholder="John Doe"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="••••••••"
              type="password"
            />

            <Button className="btn mt-6" type="submit">
              {isSignIn ? (
                <span className="flex items-center justify-center gap-2">
                  <span>🚀</span> Sign In
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>✨</span> Create Account
                </span>
              )}
            </Button>
          </form>
        </Form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-6">
          <div className="h-px flex-1 bg-border-light"></div>
          <span className="text-xs text-text-muted">OR</span>
          <div className="h-px flex-1 bg-border-light"></div>
        </div>

        {/* Switch Auth Type */}
        <div className="text-center">
          <p className="text-text-secondary text-sm">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
          </p>
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="inline-block mt-2 font-bold text-primary-200 hover:text-primary-300 transition-colors"
          >
            {!isSignIn ? "Sign in instead →" : "Create account →"}
          </Link>
        </div>

        {/* Features List for Sign Up */}
        {!isSignIn && (
          <div className="mt-8 pt-6 border-t border-border-light">
            <p className="text-xs text-text-muted mb-3 font-semibold">
              WHAT YOU'LL GET:
            </p>
            <ul className="space-y-2">
              {[
                "AI-powered interview practice",
                "Instant feedback and analysis",
                "Track your progress over time",
                "100% free to get started"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="text-success-100">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div className="text-center mt-6">
        <p className="text-xs text-text-muted">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary-200 hover:underline">Terms</a>
          {" "}and{" "}
          <a href="#" className="text-primary-200 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;