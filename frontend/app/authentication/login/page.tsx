"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { graphqlRequest } from "@/app/lib/graphql/client";

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

type LoginResponse = {
  login: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await graphqlRequest<LoginResponse>(
        LOGIN_MUTATION,
        {
          input: {
            email,
            password,
          },
        }
      );

      localStorage.setItem("token", data.login.token);

      router.push("/");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark">⌁</span>
          Keyflow
        </div>
        <p className="eyebrow">Welcome back</p>
        <h1>Pick up your pace.</h1>
        <p className="auth-copy">Sign in to track your progress and beat your best time.</p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          </div>

          <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="button form-submit" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link href="/authentication/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
