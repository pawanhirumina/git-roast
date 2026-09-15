import type { NextApiRequest, NextApiResponse } from 'next'
import { redis, ratelimit } from '../../../lib/upstash'
import { getGithubStats } from '../../../lib/github'
import Groq from 'groq-sdk'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method!== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' })
  }

  const username = req.query.username as string
  if (!username) return res.status(400).json({ error: 'Username required' })


  if (process.env.NODE_ENV === 'production') {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'anonymous'
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return res.status(429).json({ error: 'Too many roasts. Try again in 1 hour.' })
    }
  } else {
    console.log("DEV MODE: Rate limit bypassed")
  }

  try {
    const cacheKey = `roast:cache:${username.toLowerCase()}`
    const cached = await redis.get(cacheKey)
    if (cached) {
      return res.status(200).json({...cached as any, cached: true })
    }

    const githubData = await getGithubStats(username)
    if (!githubData) {
      return res.status(404).json({ error: 'GitHub user not found' })
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const completion = await groq.chat.completions.create({
      model: 'groq/compound',
      temperature: 0.9,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a savage but hilarious senior staff engineer roasting a GitHub profile.
          Be witty, clever, not hateful. No swearing.
          Return ONLY valid JSON with keys:
          roast (string, 2-3 savage lines),
          strengths (string[] 3 items),
          weaknesses (string[] 3 items),
          verdict (string 1 line),
          score (number 0-100),
          tags (string[] like "3am-coder", "README-hater", "fork-lord")`
        },
        {
          role: 'user',
          content: JSON.stringify(githubData)
        }
      ]
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')

    await redis.set(cacheKey, result, { ex: 86400 })

    return res.status(200).json(result)

  } catch (err: any) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to roast', details: err.message })
  }
}
