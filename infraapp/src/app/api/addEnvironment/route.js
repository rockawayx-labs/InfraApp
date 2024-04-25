export async function POST(req) {
  try {
    const buffers = [];
    for await (const chunk of req.body) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    const body = JSON.parse(data);

    const { name } = body;

    const environment = await prisma.Environment.create({
      data: {
        name,
      },
    });

    // Return a response with the created environment data
    return new Response(JSON.stringify(environment), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Handle any errors that occur during the creation process
    return new Response(
      JSON.stringify({
        error: "Error creating environment",
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
