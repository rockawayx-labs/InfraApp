import prisma from "../../../../lib/prisma";

export async function GET(req) {
  const ecosystems = await prisma.Ecosystem.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      groups: true,
    },
  });
  return new Response(JSON.stringify(ecosystems), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
