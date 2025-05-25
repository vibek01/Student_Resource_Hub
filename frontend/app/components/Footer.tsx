// app/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="text-center py-6 border-t border-gray-200 dark:border-zinc-700 mt-8">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} Student Resource Hub. All rights reserved.
      </p>
    </footer>
  )
}
