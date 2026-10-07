import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  children?: ReactNode
  fullWidth?: boolean
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:   'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300',
  ghost:     'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
  outline:   'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 shadow-sm',
  success:   'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm',
}

const SIZES: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1   text-xs  gap-1.5 rounded-md  h-6',
  sm: 'px-3   py-1.5 text-xs  gap-1.5 rounded-lg  h-7',
  md: 'px-4   py-2   text-sm  gap-2   rounded-lg  h-8',
  lg: 'px-5   py-2.5 text-sm  gap-2   rounded-xl  h-10',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  fullWidth = false,
  disabled,
  className,
  ...props
}, ref) => {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 focus-visible:outline-none',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading
        ? <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
        : icon && <span className="flex-shrink-0">{icon}</span>
      }
      {children && <span>{children}</span>}
      {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  )
})

Button.displayName = 'Button'
export default Button
