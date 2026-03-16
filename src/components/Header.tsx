import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-6 flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 hover:text-gray-600 transition-colors pt-1">
          Tesshu Matsuo
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
            About
          </Link>
          <Link href="/#works" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Works
          </Link>
          <Link href="/#contact" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Contact
          </Link>
        </nav>
        {/* Mobile menu button (placeholder) */}
        <button className="md:hidden p-2 text-gray-600 hover:text-black" aria-label="Menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12"/>
            <line x1="4" x2="20" y1="6" y2="6"/>
            <line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
