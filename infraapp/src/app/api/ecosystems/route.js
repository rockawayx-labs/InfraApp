export async function GET(req) {
  const ecosystems = await prisma.Ecosystem.findMany({});
  return new Response(JSON.stringify(ecosystems), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
