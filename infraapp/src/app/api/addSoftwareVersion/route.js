// Assuming you have an API route at /api/addSoftwareVersion
export async function POST(req) {
  try {
    const buffers = [];
    for await (const chunk of req.body) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    const body = JSON.parse(data);

    const {
      name,
      github,
      creator,
      last_editor,
      date_created,
      last_change,
      software_id,
      selectedEnvironments,
    } = body;

    const currentDate = new Date();

    const softwareVersion = await prisma.SoftwareVersion.create({
      data: {
        name,
        github,
        creator,
        last_editor,
        date_created: new Date(date_created),
        last_change: new Date(last_change),
        software_id: software_id ? parseInt(software_id) : null,
      },
    });

    console.log(softwareVersion);

    if (selectedEnvironments.length) {
      const approvals = selectedEnvironments.map((environment_id) => ({
        approver: last_editor,
        date: currentDate,
        environment_id,
        software_version_id: softwareVersion.id,
      }));

      await prisma.Approval.createMany({
        data: approvals,
      });
    }

    return new Response(JSON.stringify(softwareVersion), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Error creating software version",
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
