"use client"

import { Control, useFormContext, FieldValues, Path } from "react-hook-form"
import {
  Clock,
  AlertCircle,
  CalendarIcon,
  ChevronDown,
  HelpCircle,
  X,
} from "lucide-react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/app/_components/ui/form"
import { Switch } from "@/src/app/_components/ui/switch"
import { Input } from "@/src/app/_components/ui/input"
import { Calendar } from "@/src/app/_components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/app/_components/ui/popover"
import { Button } from "@/src/app/_components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/src/app/_lib/utils.lib"
import { useState, useEffect } from "react"

interface AdminBarbershopStatusFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
}

export function AdminBarbershopStatusField<TFieldValues extends FieldValues>({
  control,
}: AdminBarbershopStatusFieldProps<TFieldValues>) {
  const { watch } = useFormContext()
  const isOpen = watch("status.isOpen")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const hasSeenHint = localStorage.getItem("barbershop_status_hint_seen")
    if (!hasSeenHint) {
      setShowHint(true)
    }
  }, [])

  const handleCloseHint = () => {
    setShowHint(false)
    localStorage.setItem("barbershop_status_hint_seen", "true")
  }

  if (!isMounted) return null

  return (
    <div className="group border-border bg-card hover:border-primary/30 relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg md:col-span-2">
      <div className="from-primary via-primary/60 absolute top-0 right-0 left-0 h-1 bg-linear-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="border-border border-b px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <Clock className="text-primary h-4 w-4" />
          </div>
          <h2 className="text-sm font-semibold tracking-wide uppercase">
            Sta<span className="text-primary">tus</span>
          </h2>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-4">
          <FormField
            name={"status.isOpen" as Path<TFieldValues>}
            control={control}
            render={({ field }) => (
              <FormItem className="border-border bg-background/50 flex items-center justify-between rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      field.value ? "bg-green-500/10" : "bg-red-500/10",
                    )}
                  >
                    {field.value ? (
                      <Clock className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-semibold">
                      Barbearia aberta agora?
                    </FormLabel>
                    <p className="text-muted-foreground text-xs">
                      {field.value
                        ? "Visível como aberta para clientes"
                        : "Exibirá como fechada temporariamente"}
                    </p>
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-primary"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {!isOpen && (
            <div className="animate-in fade-in slide-in-from-top-2 space-y-3 duration-200">
              {showHint && (
                <div className="border-primary/30 bg-primary/5 animate-in fade-in zoom-in-95 relative flex items-start gap-3 rounded-xl border p-4 duration-200">
                  <HelpCircle className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                  <div className="space-y-2 pr-8">
                    <p className="text-primary text-xs font-semibold">
                      Quando preencher o motivo e a data?
                    </p>
                    <div className="text-muted-foreground text-[11px] leading-relaxed">
                      <p className="mb-1.5">
                        <strong className="text-foreground">
                          Use apenas o botão:
                        </strong>{" "}
                        Para fechamentos rápidos (algumas horas ou 1 dia). Ex:
                        fechamento do contidiano
                      </p>
                      <p>
                        <strong className="text-foreground">
                          Preencha motivo + data:
                        </strong>{" "}
                        Para fechamentos programados e prolongados. Ex: férias,
                        manutenção, feriados, emergência, imprevisto, licença.
                      </p>
                    </div>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCloseHint}
                    className="text-muted-foreground hover:text-foreground absolute top-2 right-2 transition-colors"
                    aria-label="Fechar dica"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <FormField
                name={"status.reason" as Path<TFieldValues>}
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-xs font-semibold">
                      <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                      Motivo do fechamento
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Férias, Manutenção, Feriado..."
                        className="border-border bg-background/50 placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-primary/20 hover:border-primary/20 rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 focus:ring-1 focus:outline-none"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                name={"status.closedUntil" as Path<TFieldValues>}
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-xs font-semibold">
                      <CalendarIcon className="h-3.5 w-3.5 text-red-500" />
                      Fechado até
                    </FormLabel>
                    <FormControl>
                      <Popover
                        open={isCalendarOpen}
                        onOpenChange={setIsCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "border-border bg-background/50 hover:border-primary/30 hover:bg-primary/5 w-full justify-start text-left font-normal",
                              "rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 focus:ring-1 focus:outline-none",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="text-primary mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "dd 'de' MMMM 'de' yyyy", {
                                locale: ptBR,
                              })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          align="start"
                          side="top"
                          sideOffset={8}
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date)
                              setIsCalendarOpen(false)
                            }}
                            disabled={[{ before: new Date() }]}
                            locale={ptBR}
                            className="capitalize"
                            captionLayout="dropdown"
                            initialFocus={true}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/5 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-xs text-red-400">
                  Enquanto estiver fechada, os clientes não poderão fazer novos
                  agendamentos.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
