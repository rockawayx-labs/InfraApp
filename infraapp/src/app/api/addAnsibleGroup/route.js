import prisma from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const buffers = [];
    for await (const chunk of req.body) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    const body = JSON.parse(data);

    const { groupName, selectedEcosystem, selectedSoftwares } = body;

    console.log(body);
    const ansibleGroup = await prisma.AnsibleGroup.create({
      data: {
        group_name: groupName,
        ecosystem: selectedEcosystem
          ? { connect: { id: parseInt(selectedEcosystem) } }
          : undefined,
        softwares: {
          connect: selectedSoftwares.map((id) => ({ id: parseInt(id) })),
        },
      },
    });

    console.log("succ");

    return new Response(JSON.stringify(ansibleGroup), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Error creating Ansible group",
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
