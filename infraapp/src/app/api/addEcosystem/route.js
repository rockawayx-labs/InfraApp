import prisma from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const buffers = [];
    for await (const chunk of req.body) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    const body = JSON.parse(data);
    const { name } = body;
    console.log(name);
    

    const ecosystem = await prisma.ecosystem.create({
      data: {
        name,
      },
    });

    return new Response(JSON.stringify(ecosystem), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Error creating Ecosystem",
      details: error.message,
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
