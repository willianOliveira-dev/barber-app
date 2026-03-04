"use client"

import { useSession } from "next-auth/react"
import { useEffect, useRef, useState, useCallback } from "react"
import { io, type Socket } from "socket.io-client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Send,
  MessageCircle,
  Loader2,
  X,
  Command,
  Bot,
  AlertCircle,
  ChevronDown,
  Scissors,
  User,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "../_lib/utils.lib"
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { startConversationAction } from "../barbershops/_actions/start-conversation.action"
import { sendMessageAction } from "../barbershops/_actions/send-message.action"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ChatSheetProps {
  barbershopId: string
  barbershopName: string
  barbershopImage?: string | null
}

interface Message {
  id: string
  content: string
  senderType: "user" | "bot" | "barbershop"
  createdAt: Date
}

const QUICK_SUGGESTIONS = [
  { label: "Ver horários",     value: "Quais são os horários de funcionamento?" },
  { label: "Serviços e preços", value: "Quais serviços vocês oferecem e quanto custam?" },
  { label: "Como chegar",      value: "Qual é o endereço e como posso chegar?" },
  { label: "Avaliações",       value: "O que os clientes acham da barbearia?" },
]


export function ChatSheet({ barbershopId, barbershopName, barbershopImage }: ChatSheetProps) {
  const { data: session } = useSession()
  const [isOpen,            setIsOpen]            = useState(false)
  const [conversationId,    setConversationId]    = useState<string | null>(null)
  const [messages,          setMessages]          = useState<Message[]>([])
  const [input,             setInput]             = useState("")
  const [isSending,         setIsSending]         = useState(false)
  const [isStarting,        setIsStarting]        = useState(false)
  const [isHumanMode,       setIsHumanMode]       = useState(false)
  const [isHumanTyping,     setIsHumanTyping]     = useState(false)
  const [showScrollButton,  setShowScrollButton]  = useState(false)

  const socketRef           = useRef<Socket | null>(null)
  const messagesEndRef      = useRef<HTMLDivElement>(null)
  const messagesContainerRef= useRef<HTMLDivElement>(null)
  const textareaRef         = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, isHumanTyping, scrollToBottom])

  const handleScroll = () => {
    const c = messagesContainerRef.current
    if (!c) return
    setShowScrollButton(c.scrollHeight - c.scrollTop - c.clientHeight > 100)
  }

  const connectSocket = useCallback((convId: string) => {
    if (socketRef.current?.connected) return

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    socketRef.current = socket

    socket.on("connect", () => {
      socket.emit("join_conversation", convId)
    })

    socket.on("new_message", (msg: {
      id: string
      content: string
      senderType: string
      createdAt: string
    }) => {
    
      if (msg.senderType === "user") return

      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev
        return [
          ...prev,
          {
            id: msg.id,
            content: msg.content,
            senderType: msg.senderType as Message["senderType"],
            createdAt: new Date(msg.createdAt),
          },
        ]
      })
    })

    socket.on("human_required", () => {
      setIsHumanMode(true)
    })

    socket.on("typing_start", () => setIsHumanTyping(true))
    socket.on("typing_stop",  () => setIsHumanTyping(false))

    socket.on("connect_error", () => {
      toast.error("Problema na conexão. Tentando reconectar...")
    })
  }, [])


  useEffect(() => {
    if (!isOpen) {
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !session?.user?.id) return

    const init = async () => {
      setIsStarting(true)
      try {
        const response = await startConversationAction({
          userId: session.user.id,
          barbershopId,
        })

        if (!response.success) {
          toast.error("Erro ao iniciar conversa")
          return
        }

        const conv = "data" in response ? response.data : null
        if (!conv) return

        setConversationId(conv.id)

        if (conv.messages?.length > 0) {
          setMessages(
            conv.messages.map((m: any) => ({
              id: m.id,
              content: m.content,
              senderType: m.senderType as Message["senderType"],
              createdAt: new Date(m.createdAt),
            }))
          )
        }

        const alreadyHuman =
          conv.status === "human_required" ||
          conv.status === "human_handling" ||
          conv.messages?.some((m: any) => m.senderType === "barbershop")

        if (alreadyHuman) setIsHumanMode(true)

        connectSocket(conv.id)
      } finally {
        setIsStarting(false)
      }
    }

    init()

    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [isOpen, session?.user?.id, barbershopId])

  useEffect(() => {
  if (!isHumanMode) return
  toast.info(`Você foi conectado a um atendente da ${barbershopName}. As respostas chegam durante o horário de funcionamento.`, {
    duration: 5000,
    icon: <AlertCircle className="h-4 w-4 text-blue-500" />,
  })
}, [isHumanMode])

  const handleSend = async () => {
    const content = input.trim()
    if (!content || !conversationId || !session?.user?.id || isSending) return

    setInput("")

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    const tempId = crypto.randomUUID()
    setMessages((prev) => [
      ...prev,
      { id: tempId, content, senderType: "user", createdAt: new Date() },
    ])

    setIsSending(true)

    const response = await sendMessageAction({
      conversationId,
      content,
      senderUserId: session.user.id,
    })

    if (!response.success) {
      toast.error("Erro ao enviar mensagem")
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      setInput(content)
    }

    setIsSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!isSending) handleSend()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 120) + "px"
  }

  if (!session) return null

  const hasMessages = messages.length > 0
  const lastMessage = messages[messages.length - 1]
  const showBotTyping = isSending && !isHumanMode && lastMessage?.senderType === "user"

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
            <div className="relative z-20">
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl">
              <Image
                src={barbershopImage || "/images/default.png"}
                alt={barbershopName}
                fill
                className="object-cover"
                priority
              />
            </div>
              <span className={cn(
                "border-card absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2",
                isHumanMode ? "bg-blue-500" : "bg-green-500",
              )} />
            </div>
            <div className="leading-tight">
              <SheetTitle className="text-sm font-semibold tracking-tight">
                {barbershopName}
              </SheetTitle>
              <SheetDescription className="text-muted-foreground mt-1 flex items-center gap-1.5 text-[11px]">
                {isHumanMode ? (
                  <>
                    <User className="h-3 w-3 text-blue-500" />
                    <span className="font-medium text-blue-500">Atendente</span>
                  </>
                ) : (
                  <>
                    <Bot className="h-3 w-3 text-green-500" />
                    <span>Assistente IA • Online agora</span>
                  </>
                )}
              </SheetDescription>
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

        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="from-background via-background to-muted/20 flex flex-1 flex-col gap-3 overflow-y-auto bg-gradient-to-b p-5"
        >
          {isStarting ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Scissors className="text-primary h-7 w-7 animate-pulse" />
                <p className="text-muted-foreground text-sm">Iniciando conversa...</p>
              </div>
            </div>

          ) : !hasMessages ? (
              
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
              <div className="relative">
                <div className="bg-primary/10 absolute inset-0 rounded-full blur-2xl" />
                <div className="relative h-24 w-24 rounded-3xl bg-primary/10 p-5 overflow-hidden">
                  <Image
                    src={barbershopImage || "/images/default.png"}
                    alt={barbershopName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-base font-semibold tracking-tight">Olá, seja bem-vindo!</p>
                <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                  Sou o assistente da <strong>{barbershopName}</strong>. Posso te ajudar com horários, serviços, preços e muito mais.
                </p>
              </div>
              <div className="grid w-full grid-cols-2 gap-2">
                {QUICK_SUGGESTIONS.map((s) => (
                  <Button
                    key={s.label}
                    variant="outline"
                    size="sm"
                    className="border-border/60 hover:border-primary/40 hover:bg-primary/5 h-auto justify-start rounded-xl px-3 py-2.5 text-left text-xs transition-all"
                    onClick={() => setInput(s.value)}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>

          ) : (
            <>
              {messages.map((msg, index) => {
                const isUser       = msg.senderType === "user"
                const isBarbershop = msg.senderType === "barbershop"
                const isFirstInGroup =
                  index === 0 || messages[index - 1]?.senderType !== msg.senderType

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "animate-in fade-in slide-in-from-bottom-2 flex w-full gap-2.5 duration-200",
                      isUser ? "justify-end" : "justify-start",
                      !isFirstInGroup && !isUser && "pl-11",
                      !isFirstInGroup &&  isUser && "pr-11",
                    )}
                  >
                    {!isUser && isFirstInGroup && (
                      <div className={cn(
                        "mt-auto flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl shadow-sm",
                        isBarbershop
                          ? "bg-blue-500/15 text-blue-500"
                          : "bg-primary/15 text-primary",
                      )}>
                        {isBarbershop
                          ? <Scissors className="h-4 w-4" />
                          : <Bot className="h-4 w-4" />
                        }
                      </div>
                    )}

                    <div className={cn(
                      "flex max-w-[78%] flex-col gap-1",
                      isUser ? "items-end" : "items-start",
                    )}>
                      {!isUser && isFirstInGroup && (
                        <span className="text-muted-foreground px-1 text-[10px] font-medium">
                          {isBarbershop ? barbershopName : "Assistente IA"}
                        </span>
                      )}
                      <div className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                        isUser
                          ? "from-primary to-primary/90 text-primary-foreground shadow-primary/20 rounded-tr-sm bg-gradient-to-br"
                          : "border-border/40 bg-card/90 rounded-tl-sm border backdrop-blur-sm",
                      )}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            ul: ({ children }) => <ul className="mt-1 space-y-1">{children}</ul>,
                            li: ({ children }) => (
                              <li className="flex items-start gap-1.5">
                                <span className="text-primary mt-0.5 flex-shrink-0 font-bold">•</span>
                                <span>{children}</span>
                              </li>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      <span className="text-muted-foreground/60 px-1 text-[10px]">
                        {format(new Date(msg.createdAt), "HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                )
              })}
              {showBotTyping && (
                <div className="animate-in fade-in flex gap-2.5 duration-200">
                  <div className="bg-primary/15 text-primary flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="border-border/40 bg-card/90 rounded-2xl rounded-tl-sm border px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-muted-foreground/60 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0ms]" />
                      <span className="bg-muted-foreground/60 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:150ms]" />
                      <span className="bg-muted-foreground/60 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              {isHumanTyping && (
                <div className="animate-in fade-in flex gap-2.5 duration-200">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-500">
                    <Scissors className="h-4 w-4" />
                  </div>
                  <div className="border-border/40 bg-card/90 rounded-2xl rounded-tl-sm border px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:300ms]" />
                      </div>
                      <span className="text-muted-foreground text-[11px]">digitando...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        {showScrollButton && hasMessages && (
          <button
            onClick={scrollToBottom}
            className="border-border bg-card absolute bottom-24 right-6 z-10 flex h-8 w-8 items-center justify-center rounded-full border shadow-lg transition-all hover:scale-110"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
        <div className="border-border/50 bg-card/90 sticky bottom-0 border-t px-4 py-3 backdrop-blur-xl">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              placeholder={
                isHumanMode
                  ? `Mensagem para ${barbershopName}...`
                  : "Digite sua mensagem..."
              }
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              disabled={isSending || isStarting}
              rows={1}
              className={cn(
                "border-border/50 bg-background/80 focus:border-primary/40 focus:ring-primary/20 overflow-y-hidden",
                "min-h-[44px] max-h-[120px] flex-1 resize-none rounded-2xl px-4 py-3 text-sm shadow-sm focus:ring-1",
              )}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isSending || isStarting}
              className={cn(
                "h-11 w-11 flex-shrink-0 rounded-2xl transition-all duration-300",
                input.trim() && !isSending
                  ? "from-primary to-primary/90 shadow-primary/30 bg-gradient-to-br shadow-lg hover:scale-105"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isSending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Send className="h-4 w-4" />
              }
            </Button>
          </div>
          <div className="text-muted-foreground/60 mt-2 flex items-center justify-center gap-1 text-[10px]">
            <Command className="h-2.5 w-2.5" />
            <span>Enter para enviar • Shift+Enter para nova linha</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}