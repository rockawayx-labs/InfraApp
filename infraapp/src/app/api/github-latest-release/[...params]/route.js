import fetch from "node-fetch";

// Function to extract owner and repo name from GitHub URL
function extractRepoDetails(url) {
  const pattern = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(pattern);
  if (match && match.length >= 3) {
    return { owner: match[1], repo: match[2] };
  }
  return null;
}

export async function GET(req, { params }) {
  const requestUrl = new URL(req.url);
  const pathname = requestUrl.pathname;
  const githubUrl = pathname.split("repoUrl=")[1];
  const formatted = githubUrl.replace(/https:\/(?!\/)/, "https://");
  const formattedUrl = formatted.replace("github.com", "api.github.com/repos");
  const apiUrl = `${formattedUrl}/releases/latest`;
  if (!apiUrl) {
    return new Response(
      JSON.stringify({ error: "Invalid GitHub repository URL" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch latest release");
    }
    const latestRelease = data.tag_name;
    return new Response(JSON.stringify({ latestRelease }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
