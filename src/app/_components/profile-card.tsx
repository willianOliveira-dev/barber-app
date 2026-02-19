import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface ProfileCardProps {
  name: string
  email: string
  avatarUrl: string | null
}

export function ProfileCard({ name, email, avatarUrl }: ProfileCardProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <Avatar className="ring-primary/30 ring-offset-card h-11 w-11 ring-2 ring-offset-2">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <span className="ring-card absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-green-400 ring-2" />
      </div>

      <div className="flex min-w-0 flex-col">
        <span className="text-foreground truncate text-sm font-semibold">
          {name}
        </span>
        <span className="text-muted-foreground truncate text-xs">{email}</span>
      </div>
    </div>
  )
}
