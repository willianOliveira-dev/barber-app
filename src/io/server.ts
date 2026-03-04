import Fastify from "fastify"
import fastifySocketIO from "fastify-socket.io"
import { env } from "../config/env"
import type { ServerToClientEvents,  ClientToServerEvents } from "./types/socket-events.type"
import type { Server as SocketIOServer, Socket } from "socket.io"

declare global {
  var io: SocketIOServer | undefined
}

async function bootstrap() {
  const fastify = Fastify({
    logger: {
      transport: env.NODE_ENV === "development" ? {
        target: "pino-pretty",
        options: { localizeTime: true, translateTime: "HH:MM:ss Z", colorize: true } }: undefined
    }
   })

  await fastify.register(fastifySocketIO, {
    cors: {
      origin: env.NEXT_PUBLIC_APP_URL,
      methods: ["GET", "POST"],
    
    },
  })

  fastify.get("/health", async () => ({ status: "ok" }))

  fastify.ready(() => {
    global.io = fastify.io

    fastify.io.on("connection", (socket: Socket) => {
      fastify.log.info(`[Socket] Conectado: ${socket.id}`)

      socket.on<keyof ClientToServerEvents>(
        "join_conversation",
        (conversationId: string) => {
          socket.join(conversationId)
        },
      )

      socket.on<keyof ClientToServerEvents>(
        "join_barbershop",
        (barbershopId: string) => {
          socket.join(`barbershop:${barbershopId}`)
        },
      )

      socket.on<keyof ServerToClientEvents>("typing_start", ({ conversationId }: { conversationId: string }) => {
        socket.to(conversationId).emit("typing_start")
      })

      socket.on<keyof ServerToClientEvents>("typing_stop", ({ conversationId }: { conversationId: string }) => {
        socket.to(conversationId).emit("typing_stop")
      })

      socket.on("disconnect", () => {
        fastify.log.info(`[Socket] Desconectado: ${socket.id}`)
      })

      socket.on<keyof ServerToClientEvents>("server_emit", ({ room, event, data }) => {
          fastify.io.to(room).emit(event, data)
        },
      )
    })
  })

  await fastify.listen({ port: env.SOCKET_PORT, host: env.HOST })
}

bootstrap().catch(console.error)
