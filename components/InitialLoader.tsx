'use client'

import { useEffect, useState } from 'react'

export default function InitialBrandLoader() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setMounted(true)

    const timer = setTimeout(() => {
      setVisible(false)
    }, 2400) // durasi tampil

    return () => clearTimeout(timer)
  }, [])

  // ⛔ Cegah hydration mismatch
  if (!mounted || !visible) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
      <div className="text-center animate-brand">
        <h1 className="font-playfair text-4xl md:text-5xl font-black text-gray-600 tracking-wide">
          Luthfi Khaeri Ihsan
        </h1>
        <p className="mt-2 text-sm md:text-base tracking-widest uppercase text-gray-500">
          Profile Website
        </p>
      </div>
    </div>
  )
}
