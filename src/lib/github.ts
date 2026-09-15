export async function getGithubStats(username: string) {
  const headers: any = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "git-roast",
  }
  if (process.env.GITHUB_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_API_TOKEN}`
  }

  const fetchWithTimeout = (url: string) => {
    return fetch(url, { 
      headers,
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 0 } 
    })
  }

  try {
    const userRes = await fetchWithTimeout(`https://api.github.com/users/${username}`)
    
    if (userRes.status === 404) {
      console.log(`GitHub user ${username} not found (404)`)
      return null
    }
    if (!userRes.ok) {
      const text = await userRes.text()
      console.log(`GitHub error ${userRes.status}:`, text)
      throw new Error(`GitHub API ${userRes.status}`)
    }

    const user = await userRes.json()

    const perPage = user.type === 'Organization' ? 20 : 50
    
    const reposRes = await fetchWithTimeout(
      `https://api.github.com/users/${username}/repos?per_page=${perPage}&sort=updated`
    )
    const repos = reposRes.ok ? await reposRes.json() : []

    return {
      username: user.login,
      name: user.name,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      public_repos: user.public_repos,
      account_type: user.type,
      account_age_days: Math.floor((Date.now() - new Date(user.created_at).getTime()) / 86400000),
      total_stars: Array.isArray(repos) ? repos.reduce((acc: number, r: any) => acc + r.stargazers_count, 0) : 0,
      top_languages: [],
      repos_sample: Array.isArray(repos) ? repos.slice(0, 10).map((r: any) => ({ 
        name: r.name, 
        stars: r.stargazers_count, 
        language: r.language,
        desc: r.description 
      })) : [],
    }
  } catch (e: any) {
    console.error("GitHub fetch failed:", e.code || e.message)
    if (e.name === 'TimeoutError' || e.code === 'ETIMEDOUT') {
      throw new Error("GITHUB_TIMEOUT")
    }
    throw e
  }
}
