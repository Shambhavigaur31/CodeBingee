// /app/api/gfg/route.ts
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")
  
    if (!username) {
      return new Response(JSON.stringify({ error: "Username required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
  
    try {
      const response = await fetch(`https://geeks-for-geeks-api.vercel.app/${username}`)
      const data = await response.json()
  
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch GFG data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
  }
  