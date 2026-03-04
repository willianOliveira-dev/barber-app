export type ClientToServerEvents = {
  join_conversation: (conversationId: string) => void
  join_barbershop: (barbershopId: string) => void
}
type Event = {
  room: string
  event: string
  data: unknown
}
export type ServerToClientEvents = {
  server_emit: ({ room, event, data }: Event) => void
  typing_start:         () => void
  typing_stop:          () => void
}
