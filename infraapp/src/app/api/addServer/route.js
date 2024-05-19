export async function POST(req) {
  try {

    const buffers = [];
    for await (const chunk of req.body) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    const body = JSON.parse(data);

    const currentTime = new Date();

    const {
      hostname,
      selectedEnvironment,
      selectedAnsibleGroup,
      selectedSoftwareVersions,
    } = body;

    const server = await prisma.Server.create({
      data: {
        hostname,
        environment_id: selectedEnvironment
          ? parseInt(selectedEnvironment)
          : null,
        ansible_group_id: selectedAnsibleGroup
          ? parseInt(selectedAnsibleGroup)
          : null,
        date_created: currentTime,
        date_changed: currentTime,
        softwares: {
          connect: selectedSoftwareVersions.map((id) => ({ id: parseInt(id) })),
        },
      },
    });

    return new Response(JSON.stringify(server), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Error creating server",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
