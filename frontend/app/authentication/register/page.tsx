"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { graphqlRequest } from "@/app/lib/graphql/client";

const REGISTER_MUTATION = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

type RegisterResponse = {
  register: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await graphqlRequest<RegisterResponse>(
        REGISTER_MUTATION,
        {
          input: {
            name,
            email,
            password,
          },
        }
      );

      localStorage.setItem("token", data.register.token);

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
        <p className="eyebrow">Start your streak</p>
        <h1>Type. Improve. Repeat.</h1>
        <p className="auth-copy">Create your account to save every great run and climb the board.</p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="form-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          </div>

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
          {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/authentication/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
