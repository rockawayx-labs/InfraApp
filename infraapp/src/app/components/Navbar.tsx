"use client";

import Link from "next/link";
import styles from "./Navbar.module.css"; // Importing CSS module
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();
  if (!session) {
    return null; // Don't render the Navbar if there's no session
  }
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinksContainer}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/servers" legacyBehavior>
              <a className={styles.navLink}>Servers</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/environments" legacyBehavior>
              <a className={styles.navLink}>Environments</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/softwares" legacyBehavior>
              <a className={styles.navLink}>Softwares</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/ansibleGroups" legacyBehavior>
              <a className={styles.navLink}>Ansible Groups</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/softwareVersions" legacyBehavior>
              <a className={styles.navLink}>Software Versions</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/ecosystems" legacyBehavior>
              <a className={styles.navLink}>Ecosystems</a>
            </Link>
          </li>
        </ul>
      </div>
      <button onClick={() => signOut()} className={styles.signOutButton}>
        Sign Out
      </button>
    </nav>
  );
}
