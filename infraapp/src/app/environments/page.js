import prisma from "../../../lib/prisma";
import EnvironmentItem from "../components/environments";
import styles from "./servers.module.css";
import Link from "next/link";

async function getEnvironments() {
  const environments = await prisma.Environment.findMany({
    include: {
      servers: true,
    },
  });
  return environments;
}

export default async function Environments() {
  const environments = await getEnvironments();
  console.log({ environments });
  return (
    <main className={styles.serversPage}>
      <div className={styles.addServerLink}>
        <Link href={"../addEnvironment"}>Add environment</Link>
      </div>
      <div className={styles.serversContainer}>
        <h1>Environments</h1>
        {environments.map((environment) => (
          <div className={styles.serverBox} key={environment.id}>
            <EnvironmentItem
              id={environment.id}
              name={environment.name}
              servers={environment.servers}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
