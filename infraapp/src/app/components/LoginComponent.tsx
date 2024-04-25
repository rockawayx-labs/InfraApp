"use client";
import Head from "next/head";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import styles from "./Login.module.css"; // Ensure the path is correct

export default function LoginComponent() {
  const { data: session, status } = useSession();

  // Check if the current route is /login to prevent redirection loop
  const isLoginRoute =
    typeof window !== "undefined" && window.location.pathname === "/login";

  useEffect(() => {
    // Redirect to the home page if the user is already signed in and not on the login page
    if (status !== "loading" && session && !isLoginRoute) {
      window.location.href = "/";
    }
  }, [session, status, isLoginRoute]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Login - Rockaway INFRA</title>
        <meta name="description" content="Login to Rockaway INFRA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Rockaway INFRA</h1>
        <p className={styles.description}>Server Software Tool</p>
        <button className={styles.loginButton} onClick={() => signIn("github")}>
          Sign in with GitHub
        </button>
      </main>
    </div>
  );
}
