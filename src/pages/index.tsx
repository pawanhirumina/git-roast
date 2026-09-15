'use client'

import { useState } from 'react'

type RoastData = {
  username?: string
  score?: number
  roast?: string
  verdict?: string
  tags?: string[]
  strengths?: string[]
  weaknesses?: string[]
}

export default function Home() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<RoastData | null>(null)
  const [error, setError] = useState('')

  const roast = async () => {
    const trimmedUsername = username.trim().toLowerCase()

    if (!trimmedUsername) {
      setError('Enter a GitHub username first.')
      return
    }

    setLoading(true)
    setError('')
    setData(null)

    try {
      const res = await fetch(
        `/api/roast/${encodeURIComponent(trimmedUsername)}`
      )

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to roast this GitHub profile.')
      }

      setData(json)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const score = data?.score ?? 42

  const shareRoast = async () => {
    if (!data) return

    const text = `I got roasted by GitRoast! Score: ${score}/100 - "${data.roast || 'GitHub roasted me 💀'}" Try: ${window.location.origin}`

    try {
      await navigator.clipboard.writeText(text)
      alert('Copied! Share the roast 💀')
    } catch {
      alert('Could not copy the roast.')
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center p-4">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      <div className="relative w-full max-w-2xl mt-10 md:mt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            GIT
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              ROAST
            </span>
          </h1>

          <p className="text-zinc-500 mt-3 font-mono text-sm">
            ENTER YOUR GITHUB. GET DESTROYED. LEVEL UP.
          </p>
        </div>

        {/* Input */}
        <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-2 flex gap-2 shadow-2xl">
          <div className="flex-1 flex items-center px-4 bg-black rounded-xl border border-zinc-800 focus-within:border-purple-500 transition">
            <span className="text-zinc-600 font-mono mr-2">@</span>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  roast()
                }
              }}
              placeholder="github username"
              className="w-full bg-transparent py-4 outline-none placeholder:text-zinc-700 font-mono"
              disabled={loading}
            />
          </div>

          <button
            onClick={roast}
            disabled={loading || !username.trim()}
            className="bg-white text-black font-black px-8 rounded-xl hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95"
          >
            {loading ? 'ROASTING...' : 'ROAST'}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-12 text-center font-mono text-sm animate-pulse">
            <div className="inline-block border-2 border-zinc-800 border-t-purple-500 rounded-full w-8 h-8 animate-spin mb-4" />

            <p className="text-zinc-400">
              Scanning {username}&apos;s commits at 3am...
            </p>

            <p className="text-zinc-600 text-xs mt-1">
              Counting empty READMEs...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-8 bg-red-950/50 border border-red-900 text-red-300 p-4 rounded-xl font-mono text-sm text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {data && (
          <div className="mt-8">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />

              <div className="relative">
                {/* Player + Score */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-zinc-500 font-mono text-xs tracking-widest">
                      PLAYER
                    </p>

                    <h2 className="text-3xl font-black mt-1 break-all">
                      @{data.username || username}
                    </h2>

                    <div className="flex gap-2 mt-3 flex-wrap">
                      {(data.tags || [
                        '3am-coder',
                        'readme-hater',
                        'commit-spammer',
                      ]).map((tag) => (
                        <span
                          key={tag}
                          className="bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-full text-xs font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="relative w-24 h-24 shrink-0">
                    <svg
                      className="-rotate-90 w-24 h-24"
                      viewBox="0 0 100 100"
                    >
                      <defs>
                        <linearGradient
                          id="score-gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>

                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#27272a"
                        strokeWidth="8"
                        fill="none"
                      />

                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="url(#score-gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${Math.min(score, 100) * 2.513} 251.3`}
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black">
                        {score}
                      </span>

                      <span className="text-[9px] font-mono text-zinc-500 tracking-wider">
                        SCORE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Roast */}
                <div className="mt-8 bg-black/60 border border-zinc-800/80 rounded-2xl p-5">
                  <p className="text-zinc-500 font-mono text-xs mb-2">
                    🔥 ROAST.EXE
                  </p>

                  <p className="text-lg md:text-xl leading-relaxed font-medium">
                    &quot;{data.roast || 'No roast generated.'}&quot;
                  </p>
                </div>

                {/* Verdict */}
                <p className="mt-4 text-center text-zinc-400 font-mono text-sm italic">
                  Verdict: {data.verdict || 'Needs more commits.'}
                </p>

                {/* Strengths / Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Strengths */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <p className="text-green-400 font-mono text-xs mb-2">
                      ✓ STRENGTHS
                    </p>

                    <ul className="space-y-2">
                      {(data.strengths || [
                        'Tries hard',
                        'Writes code',
                      ]).map((strength, index) => (
                        <li
                          key={index}
                          className="text-sm text-zinc-300 flex gap-2"
                        >
                          <span className="text-zinc-600">
                            {String(index + 1).padStart(2, '0')}
                          </span>

                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <p className="text-red-400 font-mono text-xs mb-2">
                      ✗ WEAKNESSES
                    </p>

                    <ul className="space-y-2">
                      {(data.weaknesses || [
                        'No README',
                        '0 stars',
                      ]).map((weakness, index) => (
                        <li
                          key={index}
                          className="text-sm text-zinc-300 flex gap-2"
                        >
                          <span className="text-zinc-600">
                            {String(index + 1).padStart(2, '0')}
                          </span>

                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Share */}
                <button
                  onClick={shareRoast}
                  className="w-full mt-6 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 py-3 rounded-xl font-mono text-sm transition active:scale-[0.99]"
                >
                  SHARE ROAST →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="relative mt-20 mb-4 text-zinc-700 font-mono text-xs text-center">
        Built for devs who can take a joke • Not affiliated with GitHub
      </p>
    </main>
  )
}

