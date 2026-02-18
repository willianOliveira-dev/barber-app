import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface ProfileBarbershopProps {
  image: string | null
  name: string
}

export function ProfileBarbershop({ image, name }: ProfileBarbershopProps) {
  return (
    <Avatar className="ring-primary h-14 w-14 ring-2">
      {image ? (
        <AvatarImage src={image} alt={name} />
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
  )
}
