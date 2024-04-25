export async function POST(req, { params }) {
  const groupId = parseInt(params.id);
  if (isNaN(groupId)) {
    return new Response(JSON.stringify("Invalid ID"), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const buffers = [];
  for await (const chunk of req.body) {
    buffers.push(chunk);
  }
  const data = Buffer.concat(buffers).toString();
  const body = JSON.parse(data);

  const { groupName, selectedSoftwares } = body;
  console.log(groupName);
  console.log(selectedSoftwares);

  try {
    // Fetch the current softwares associated with the AnsibleGroup
    const groupWithSoftwares = await prisma.ansibleGroup.findUnique({
      where: { id: groupId },
      include: { softwares: true }, // Ensure softwares are included in the response
    });

    if (!groupWithSoftwares) {
      return new Response(JSON.stringify({ error: "AnsibleGroup not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const currentSoftwares = groupWithSoftwares.softwares.map(
      (software) => software.id
    );

    const softwaresToDisconnect = currentSoftwares.filter(
      (id) => !selectedSoftwares.includes(id)
    );
    const softwaresToConnect = selectedSoftwares.filter(
      (id) => !currentSoftwares.includes(id)
    );

    await prisma.ansibleGroup.update({
      where: { id: groupId },
      data: {
        group_name: groupName,
        // Update softwares relation
        softwares: {
          disconnect: softwaresToDisconnect.map((id) => ({ id })),
          connect: softwaresToConnect.map((id) => ({ id })),
        },
      },
    });

    return new Response(
      JSON.stringify({ message: "AnsibleGroup updated successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating AnsibleGroup:", error);
    return new Response(
      JSON.stringify({ error: "Error updating AnsibleGroup" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
