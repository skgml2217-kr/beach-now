'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'info' | 'warning' | 'error'
  duration?: number
  onClose?: () => void
}

export default function Toast({
  message,
  type = 'info',
  duration = 4000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, duration)
    return () => clearTimeout(t)
  }, [duration, onClose])

  if (!visible) return null

  const styles = {
    info:    'bg-primary/10 border-primary/30 text-primary',
    warning: 'bg-yellow-50  border-yellow-300  text-yellow-700',
    error:   'bg-accent/10  border-accent/30   text-accent',
  }

  const icons = { info: 'ℹ️', warning: '⚠️', error: '❌' }

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50
                     flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-card
                     text-sm font-medium backdrop-blur animate-fadeUp
                     ${styles[type]}`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
      <button
        onClick={() => { setVisible(false); onClose?.() }}
        className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
        aria-label="닫기"
      >
        <X size={14} />
      </button>
    </div>
  )
}