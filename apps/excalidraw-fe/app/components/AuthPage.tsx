"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api";

type AuthPageProps = {
  isSignin: boolean;
};

export default function AuthPage({ isSignin }: AuthPageProps) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const endpoint = isSignin ? "/auth/signin" : "/auth/signup";

      const payload = isSignin
        ? { email, password }
        : { email, password, username };

      const res = await api.post(endpoint, payload);

      // ✅ Token store
      const token = res.data.token;
      localStorage.setItem("token", token);

      router.push("/create-room");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-2 text-center text-2xl font-semibold text-black">
          {isSignin ? "Sign In" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isSignin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-lg border px-3 py-2 text-gray-600"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border px-3 py-2 text-gray-600"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border px-3 py-2 text-gray-600"
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 py-2 text-white"
          >
            {loading ? "Please wait..." : isSignin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          {isSignin ? "Don't have an account? " : "Already have an account? "}

          <Link
            href={isSignin ? "/signup" : "/signin"}
            className="text-blue-600"
          >
            {isSignin ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
