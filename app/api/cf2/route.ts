import puppeteer from "puppeteer"
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")
  
    const profileUrl = `https://www.codechef.com/users/${username}`

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })
    const page = await browser.newPage()
    await page.goto(profileUrl, { waitUntil: "networkidle2", timeout: 0 })

    // Get the "Total Problems Solved" number from <h3>
    const totalSolved = await page.evaluate(() => {
      const h3Tags = Array.from(document.querySelectorAll("h3"))
      for (const h3 of h3Tags) {
        if (h3.textContent?.includes("Total Problems Solved")) {
          const match = h3.textContent.match(/\d+/)
          return match ? parseInt(match[0]) : 0
        }
      }
      return 0
    })

    await browser.close()

    return new Response(JSON.stringify({solved: totalSolved }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    })
   
}
