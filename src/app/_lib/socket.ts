import { io as SocketClient } from "socket.io-client"

let client: ReturnType<typeof SocketClient> | null = null

function getSocketClient() {
  if (!client) {
    client = SocketClient(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
    })
  }
  return client
}

export function emitToRoom(room: string, event: string, data: unknown) {
  getSocketClient().emit("server_emit", { room, event, data })
}
