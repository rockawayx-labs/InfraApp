"use client";
import Head from "next/head";
import styles from "./Home.module.css"; // Ensure this is the correct path
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className={styles.container}>
        <Head>
          <title>Rockaway INFRA</title>
          <meta
            name="description"
            content="Rockaway INFRA - Server Software Tool"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>Rockaway INFRA</h1>
          <p className={styles.authenticatedText}>
            Welcome {session.user?.name}. Signed In As
          </p>
          <p className={styles.authenticatedText}>{session.user?.email}</p>
          <button className={styles.signOutButton} onClick={() => signOut()}>
            Sign out
          </button>
        </main>

        <footer className={styles.footer}>{/* Footer content */}</footer>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Rockaway INFRA</title>
        <meta name="description" content="NOT SIGNED IN" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Rockaway INFRA</h1>
        <p className={styles.description}>Server Software Tool</p>
        <button className={styles.button} onClick={() => signIn("github")}>
          Sign in with github
        </button>
      </main>
    </div>
  );
}
