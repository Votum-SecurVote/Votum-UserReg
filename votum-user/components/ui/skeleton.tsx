/**
 * Skeleton Component.
 * Use to show a placeholder while content is loading.
 */
import { cn } from '@/lib/utils'

/**
 * Skeleton component.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

export { Skeleton }
