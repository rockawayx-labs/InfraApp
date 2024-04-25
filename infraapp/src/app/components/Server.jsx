export default function Servers({
  id,
  hostname,
  ansible_group,
  environment,
  softwares,
}) {
  const softwareVersions = softwares?.map((softwareVersion) => (
    <li key={softwareVersion.id} style={{ listStyleType: "none" }}>
      {softwareVersion.name}
    </li>
  ));
  return (
    <div>
      <h2>{hostname}</h2>
      <p>Ansible Group: {ansible_group?.group_name || "N/A"}</p>
      <p>Environment: {environment?.name || "N/A"}</p>
      <h3>Software Versions:</h3>
      <ul>{softwareVersions}</ul>
    </div>
  );
}
