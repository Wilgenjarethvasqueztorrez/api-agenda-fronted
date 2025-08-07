import * as React from "react"

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(({ className, children, ...props }, ref) => {
  return (
    <div className="flex -space-x-2 rtl:space-x-reverse" ref={ref} {...props}>
      {children}
    </div>
  )
})
AvatarGroup.displayName = "AvatarGroup"

export { AvatarGroup }
