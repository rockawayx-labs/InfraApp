import Link from "next/link";
import styles from "../environments/servers.module.css";

function EnvironmentItem({ id, name, servers }) {
  return (
    <div>
      <h2 className={styles.environmentName}>
        <Link href={`/environments/${id}`} legacyBehavior>
          <a className={styles.link}>{name}</a>
        </Link>
      </h2>

      {/* Servers heading with space underneath */}
      <h3 className={styles.serversHeading}>Servers:</h3>

      <ul style={{ listStyleType: "none" }}>
        {servers.map((server) => (
          <li key={server.id}>
            <label>Hostname:&nbsp;&nbsp;&nbsp;</label>
            <Link href={`/servers/${server.id}`} legacyBehavior>
              <a className={styles.link}>{server.hostname}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EnvironmentItem;
