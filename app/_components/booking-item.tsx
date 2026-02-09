import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarImage } from "./ui/avatar"

// TODO: RECEBER AGENDAMENTO COMOM PROP
export function BookingItem() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xs font-bold text-gray-400 uppercase">
        Agendemantos
      </h2>
      <div>
        <Card className="p-0">
          <CardContent className="flex justify-between p-0">
            <div className="flex flex-col gap-2 p-6">
              <Badge className="w-fit">Confirmado</Badge>
              <div className="space-y-1.5">
                <h3 className="font-semibold">Corte de Cabelo</h3>
                <div className="flex items-center gap-2">
                  <Avatar className="size-10">
                    <AvatarImage src="https://t3.ftcdn.net/jpg/02/94/29/86/360_F_294298678_i3y46pvuAsGQsfSQw047Yqmvdr74kyfJ.jpg" />
                  </Avatar>
                  <p className="text-sm">Barbershop</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border-l-2 border-gray-400/10 p-6">
              <p className="text-sm">Fevereiro</p>
              <p className="text-2xl">09</p>
              <p className="text-sm">09:45</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
