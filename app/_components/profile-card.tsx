import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface ProfileCardProps {
  name: string
  email: string
  avatarUrl: string | null
}

export function ProfileCard({ name, email, avatarUrl }: ProfileCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl p-4">
      <Avatar className="ring-primary h-14 w-14 ring-2">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={name} />
        ) : (
          <AvatarFallback className="bg-primary font-semibold text-white">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex flex-col leading-tight">
        <span className="text-base font-medium">{name}</span>
        <span className="text-sm text-gray-400">{email}</span>
      </div>
    </div>
  )
}
