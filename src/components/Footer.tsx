import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50/50 mt-16 mt-auto">
      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Tesshu Matsuo. All rights reserved.
        </p>
        <nav className="flex gap-6">
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
      </div>
    </footer>
  )
}
