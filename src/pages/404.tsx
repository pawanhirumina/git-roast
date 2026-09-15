import Link from 'next/link'

export default function Custom404() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
      
      <div className="relative">
        <h1 className="text-8xl font-black">404</h1>
        <p className="text-2xl font-black mt-2">
          GIT<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">ROAST</span> NOT FOUND
        </p>
        <p className="text-zinc-500 font-mono text-sm mt-4 max-w-md">
          Even your 404 page has more commits than your portfolio repos. <br/>
          This page doesn't exist, just like your documentation.
        </p>

        <Link href="/" className="inline-block mt-8 bg-white text-black font-black px-8 py-3 rounded-xl hover:bg-zinc-200 transition">
          GO HOME & GET ROASTED →
        </Link>

        <p className="mt-6 text-zinc-700 font-mono text-xs">
          Error: Route `/{Math.random().toString(36).slice(2)}` not found in git history
        </p>
      </div>
    </div>
  )
}
