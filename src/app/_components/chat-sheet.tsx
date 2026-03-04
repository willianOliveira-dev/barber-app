"use client"

import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Send,
  MessageCircle,
  Loader2,
  X,
  Command,
  Building2,
  Bot,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "../_lib/utils.lib"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { startConversationAction } from "../barbershops/_actions/start-conversation.action"
import { sendMessageAction } from "../barbershops/_actions/send-message.action"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  id?: string
  content: string
  senderType: "user" | "bot" | "barbershop"
  createdAt: Date
}

interface ChatDialogProps {
  barbershopId: string
  barbershopName: string
  barbershopImage?: string | null
}

export function ChatSheet({
  barbershopId,
  barbershopName,
  barbershopImage,
}: ChatDialogProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll suave para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Inicia conversa e conecta socket ao abrir
  useEffect(() => {
    if (!isOpen || !session?.user?.id) return

    const init = async () => {
      setIsStarting(true)

      const response = await startConversationAction({
        userId: session.user.id,
        barbershopId,
      })

      if (!response.success) {
        toast.error("Erro ao iniciar conversa")
        setIsStarting(false)
        return
      }

      const conv = "data" in response ? response.data : null

      if (!conv) return

      setConversationId(conv.id)

      // Carrega mensagens antigas
      if (conv.messages && conv.messages.length > 0) {
        setMessages(
          conv.messages.map((m) => ({
            id: m.id,
            content: m.content,
            senderType: m.senderType as "user" | "bot" | "barbershop",
            createdAt: new Date(m.createdAt),
          })),
        )
      }

      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        transports: ["websocket"],
      })

      socketRef.current = socket
      socket.emit("join_conversation", conv.id)

      socket.on("new_message", (message: Message) => {
        if (message.senderType === "user") return
        setMessages((prev) => [...prev, message])
      })

      setIsStarting(false)
    }

    init()

    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [isOpen, session?.user?.id])

  const handleSend = async () => {
    if (!input.trim() || !conversationId || !session?.user?.id) return

    const content = input.trim()
    setInput("")

    setMessages((prev) => [
      ...prev,
      { content, senderType: "user", createdAt: new Date() },
    ])

    setIsSending(true)

    const response = await sendMessageAction({
      conversationId,
      content,
      senderUserId: session.user.id,
    })

    if (!response.success) {
      toast.error("Erro ao enviar mensagem")
    }

    setIsSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!session) return null

  const initials = barbershopName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="group from-primary to-primary/80 shadow-primary/30 hover:shadow-primary/40 relative gap-2 overflow-hidden rounded-xl bg-gradient-to-r px-5 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="relative z-10">Falar com a barbearia</span>
          <span className="absolute inset-0 bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className={cn(
          "flex w-full flex-col gap-0 border-0 p-0 sm:max-w-md",
          "bg-card/95 backdrop-blur-xl",
          "shadow-[0_20px_80px_-10px_rgba(0,0,0,0.4)]",
        )}
      >
        <div className="border-border/50 bg-card/80 sticky top-0 z-20 flex items-center justify-between border-b px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="from-primary/20 to-primary/10 relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br shadow-inner">
              <Image
                src={barbershopImage || "/images/default.png"}
                alt={barbershopName}
                fill
                className="object-cover"
                priority
              />
              <span className="border-card absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 bg-green-500" />
            </div>

            <div className="leading-tight">
              <SheetTitle className="text-sm font-semibold tracking-tight">
                {barbershopName}
              </SheetTitle>
              <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
                Atendimento instantâneo
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="hover:bg-muted h-9 w-9 rounded-xl transition-all hover:rotate-90"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="from-background via-background to-muted/20 flex flex-1 flex-col gap-4 overflow-y-auto bg-linear-to-b p-5">
          {isStarting ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="text-primary h-6 w-6 animate-spin" />
                <p className="text-muted-foreground text-sm">
                  Conectando ao atendimento...
                </p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
              <div className="relative">
                <div className="bg-primary/10 absolute inset-0 rounded-full blur-2xl" />
                <MessageCircle className="text-primary relative h-14 w-14" />
              </div>

              <div className="space-y-1">
                <p className="text-base font-semibold tracking-tight">
                  Bem-vindo 👋
                </p>
                <p className="text-muted-foreground text-sm">
                  Fale conosco para agendar, tirar dúvidas ou conhecer nossos
                  serviços.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {["Ver horários", "Sobre a barbearia", "Dúvidas"].map(
                  (suggestion) => (
                    <Button
                      key={suggestion}
                      variant="secondary"
                      size="sm"
                      className="rounded-full text-xs transition-all hover:scale-105"
                      onClick={() => setInput(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ),
                )}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => {
                const isUser = msg.senderType === "user"
                const isBot = msg.senderType === "bot"
                const showAvatar =
                  !isUser &&
                  (index === 0 || messages[index - 1]?.senderType === "user")

                return (
                  <div
                    key={msg.id || index}
                    className={cn(
                      "animate-in fade-in slide-in-from-bottom-2 flex w-full gap-3 duration-200",
                      isUser ? "justify-end" : "justify-start",
                    )}
                  >
                    {!isUser && (
                      <div className="flex flex-col items-center gap-1">
                        {showAvatar ? (
                          <div
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-2xl text-xs font-semibold shadow-sm",
                              isBot
                                ? "bg-linear-to-br from-purple-500/20 to-purple-500/10 text-purple-500"
                                : "from-primary/20 to-primary/10 text-primary bg-linear-to-br",
                            )}
                          >
                            {isBot ? <Bot className="h-4 w-4" /> : initials}
                          </div>
                        ) : (
                          <div className="h-9 w-9" />
                        )}
                      </div>
                    )}

                    <div
                      className={cn(
                        "flex max-w-[75%] flex-col gap-1",
                        isUser ? "items-end" : "items-start",
                      )}
                    >
                      {!isUser && showAvatar && (
                        <span className="text-muted-foreground px-1 text-[10px] font-medium">
                          {isBot ? "Assistente" : barbershopName}
                        </span>
                      )}

                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-200",
                          isUser
                            ? "from-primary to-primary/90 text-primary-foreground shadow-primary/20 rounded-tr-md bg-linear-to-br"
                            : "border-border/40 bg-card/80 rounded-tl-md border backdrop-blur-sm",
                        )}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2">{children}</p>
                            ),
                            strong: ({ children }) => (
                              <strong className="text-foreground font-semibold">
                                {children}
                              </strong>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc space-y-1 pl-4">
                                {children}
                              </ul>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      <span className="text-muted-foreground/70 px-1 text-[10px]">
                        {format(new Date(msg.createdAt), "HH:mm", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* INPUT */}
        <div className="border-border/50 bg-card/90 sticky bottom-0 border-t px-5 py-4 backdrop-blur-xl">
          <div className="flex items-end gap-3">
            <Input
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending || isStarting}
              className="border-border/50 bg-background/80 focus:border-primary/40 focus:ring-primary/20 h-11 flex-1 rounded-2xl px-4 text-sm shadow-sm focus:ring-1"
            />

            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isSending || isStarting}
              className={cn(
                "h-11 w-11 rounded-2xl transition-all duration-300",
                input.trim() && !isSending
                  ? "from-primary to-primary/90 shadow-primary/30 bg-gradient-to-br shadow-lg hover:scale-105"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="text-muted-foreground/70 mt-2 flex items-center justify-center gap-1 text-[10px]">
            <Command className="h-3 w-3" />
            Enter para enviar • Shift + Enter para nova linha
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
