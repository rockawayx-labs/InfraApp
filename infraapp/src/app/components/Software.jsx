function Softwares({
  id,
  name,
  approved_version_test,
  approved_version_main,
  newest_version,
  versions,
  ansible_groups,
  github,
}) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Approved Version Test: {approved_version_test?.name || "N/A"}</p>
      <p>Approved Version Main: {approved_version_main?.name || "N/A"}</p>
      <p>Newest Version: {newest_version?.name || "N/A"}</p>
      <p>
        <a href={github} target="_blank" rel="noopener noreferrer">
          {github}
        </a>
      </p>

      <h3>Versions:</h3>
      <ul style={{ listStyleType: "none" }}>
        {versions.map((version) => (
          <li key={version.id}>{version.name}</li>
        ))}
      </ul>

      <h3>Ansible Groups:</h3>
      <ul style={{ listStyleType: "none" }}>
        {ansible_groups.map((group) => (
          <li key={group.id}>{group.group_name}</li>
        ))}
      </ul>
    </div>
  );
}
export default Softwares;
