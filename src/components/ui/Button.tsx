import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const variantClass = `btn-${variant}`
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''
  const widthClass = fullWidth ? 'w-full justify-center' : ''

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
