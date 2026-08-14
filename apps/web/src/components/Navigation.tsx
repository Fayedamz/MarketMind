'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from './ui/button'

export function Navigation() {
  const pathname = usePathname()
  const { isAuthenticated, logout, user } = useAuth()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/academy', label: 'Academy' },
    { href: '/explore', label: 'Explore' },
    ...(isAuthenticated
      ? [
          { href: '/portfolio', label: 'Portfolio' },
          { href: '/tutor', label: 'AI Tutor' },
        ]
      : []),
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              MarketMind
            </Link>

            <div className="hidden md:flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                    pathname === item.href ? 'text-primary-600' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">Hello, {user?.name}</span>
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
