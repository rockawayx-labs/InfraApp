import prisma from "../../../../lib/prisma";
export async function GET() {
  try {
    const groups = await prisma.AnsibleGroup.findMany();
    return new Response(JSON.stringify(groups), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch environments" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
