'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { usePathname } from 'next/navigation';

const navVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 14 },
  },
};

export default function Navbar() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const pathname = usePathname();        // watch path changes
  const [userName, setUserName] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Re-fetch user status on initial load *and* whenever the path changes
    setLoadingUser(true);
    fetch(`${API}/api/user/me`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setUserName(data.name))
      .catch(() => setUserName(null))
      .finally(() => setLoadingUser(false));
  }, [API, pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navClasses = twMerge(
    clsx(
      'fixed w-full max-w-6xl mx-auto left-0 right-0 z-50 px-6 py-3 rounded-xl transition-all duration-300 mt-4',
      {
        'bg-opacity-90 backdrop-blur-md shadow-lg': isScrolled,
        'bg-opacity-80': !isScrolled,
      }
    ),
    'bg-gradient-to-r from-gray-900/80 via-purple-900/80 to-violet-900/80'
  );

  return (
    <nav className={navClasses}>
      <div className="flex justify-between items-center">
        {/* Logo */}
        <motion.div initial="hidden" animate="visible" variants={navVariants} custom={0}>
          <Link href="/" className="flex items-center gap-2">
            <motion.span
              whileHover={{ scale: 1.03 }}
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200"
            >
              Student Resource Hub
            </motion.span>
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/resources" text="Resources" />
          <NavLink href="/upload" text="Upload" />

          {loadingUser ? (
            <Loader />
          ) : userName ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              >
                <span className="font-medium text-white">Hi, {userName}</span>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </Link>
            </motion.div>
          ) : (
            <>
              <AuthButton href="/auth/login" text="Login" />
              <AuthButton href="/auth/signup" text="Signup" isPrimary />
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded-md hover:bg-white/10 transition"
          >
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-6 h-0.5 bg-white" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMenuOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 z-10" />
            <motion.div
              className="ml-auto w-3/4 max-w-xs h-full bg-gradient-to-br from-gray-800 to-black text-white p-6 z-20"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Menu</h2>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-md hover:bg-white/10 transition"
                >
                  <div className="w-6 h-6 relative">
                    <span className="absolute inset-0 rotate-45 bg-white h-0.5" />
                    <span className="absolute inset-0 -rotate-45 bg-white h-0.5" />
                  </div>
                </button>
              </div>
              <ul className="space-y-4">
                <li>
                  <Link href="/resources" className="block text-xl py-2" onClick={() => setMenuOpen(false)}>
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/upload" className="block text-xl py-2" onClick={() => setMenuOpen(false)}>
                    Upload
                  </Link>
                </li>
                {loadingUser ? (
                  <li><Loader /></li>
                ) : userName ? (
                  <li>
                    <Link href="/dashboard" className="block text-xl py-2" onClick={() => setMenuOpen(false)}>
                      Hi, {userName}
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link href="/auth/login" className="block text-xl py-2" onClick={() => setMenuOpen(false)}>
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth/signup" className="block text-xl py-2" onClick={() => setMenuOpen(false)}>
                        Signup
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Loader() {
  return <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />;
}

interface NavLinkProps {
  href: string;
  text: string;
}
function NavLink({ href, text }: NavLinkProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="relative group">
      <Link href={href} className="px-3 py-2 font-medium text-white">
        {text}
      </Link>
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
    </motion.div>
  );
}

interface AuthButtonProps {
  href: string;
  text: string;
  isPrimary?: boolean;
}
function AuthButton({ href, text, isPrimary = false }: AuthButtonProps) {
  const base = 'px-4 py-2 rounded-lg font-medium transition-all';
  const style = isPrimary
    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg hover:shadow-purple-500/30'
    : 'text-white hover:bg-white/10';

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
      <Link href={href} className={twMerge(base, style)}>
        {text}
      </Link>
    </motion.div>
  );
}