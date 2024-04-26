"use client"
import Link from "next/link";
import React from "react";
import styles from "./ecosystems.module.css"; // Assuming you have similar styling as servers.module.css

async function getEcosystems() {
  const res = await fetch('/api/ecosystems');
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return await res.json();
}

export default function Ecosystems() {
  const [ecosystems, setEcosystems] = React.useState([]);

  React.useEffect(() => {
    getEcosystems().then(setEcosystems).catch(console.error);
  }, []);

  return (
    <main className={styles.serversPage}>
      <div className={styles.serversContainer}>
        <h1>Ecosystems</h1>
        {ecosystems.map((ecosystem) => (
          <div className={styles.serverBox} key={ecosystem.id}>
            <h2 className={styles.environmentName}>
              <Link href={`/ecosystems/${ecosystem.id}`} className={styles.link}>
                {ecosystem.name}
              </Link>
            </h2>
            <h3 className={styles.serversHeading}>Ansible Groups:</h3>
            <ul style={{ listStyleType: "none" }}>
              {ecosystem.groups.map((group) => (
                <li key={group.id}>
                  <Link href={`/ansibleGroups/${group.id}`} className={styles.link}>
                    {group.group_name || 'Unnamed Group'}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}