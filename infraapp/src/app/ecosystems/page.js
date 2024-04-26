"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./servers.module.css";

async function fetchEcosystems() {
  const response = await fetch("/api/ecosystems");
  if (!response.ok) {
    throw new Error("Failed to fetch ecosystems");
  }
  return response.json();
}

function EcosystemList({ ecosystems }) {
  return (
    <div>
      {ecosystems.map((ecosystem) => (
        <div key={ecosystem.id}>
          <h2>{ecosystem.name}</h2>
          <ul>
            {ecosystem.groups.map(group => (
              <li key={group.id}>{group.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function Ecosystems() {
  const [ecosystems, setEcosystems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEcosystems().then(setEcosystems);
  }, []);

  return (
    <main className={styles.serversPage}>
      <div className={styles.addServerLink}>
        <Link href="/addEcosystem" className={styles.link}>Add Ecosystem</Link>
      </div>
      <div className={styles.serversContainer}>
        <h1>Ecosystems</h1>
        <EcosystemList ecosystems={ecosystems} />
      </div>
      {showModal && (
        <EcosystemModal
          ecosystems={ecosystems}
          onSelect={(selectedEcosystem) => {
            console.log("Ecosystem selected:", selectedEcosystem.name);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
