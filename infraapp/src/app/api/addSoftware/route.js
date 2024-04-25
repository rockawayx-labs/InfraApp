export async function POST(req) {
  try {
    const buffers = [];
    for await (const chunk of req.body) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    const body = JSON.parse(data);

    const { name, github, selectedAnsibleGroups } = body;

    const software = await prisma.Software.create({
      data: {
        name,
        github,
        ansible_groups: {
          connect: selectedAnsibleGroups.map((id) => ({ id: parseInt(id) })),
        },
      },
    });

    return new Response(JSON.stringify(software), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: "Error creating software",
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
