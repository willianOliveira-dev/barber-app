"use client"

import { Clock, Copy, Check, X, MinusCircle } from "lucide-react"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/app/_components/ui/form"
import { Input } from "@/src/app/_components/ui/input"
import { Switch } from "@/src/app/_components/ui/switch"
import { Button } from "@/src/app/_components/ui/button"
import {
  FieldValues,
  useFormContext,
  useWatch,
  UseFormSetValue,
  Path,
  PathValue,
  Control,
} from "react-hook-form"
import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/app/_components/ui/popover"

const daysOfWeek = [
  { value: "monday", label: "Segunda-feira" },
  { value: "tuesday", label: "Terça-feira" },
  { value: "wednesday", label: "Quarta-feira" },
  { value: "thursday", label: "Quinta-feira" },
  { value: "friday", label: "Sexta-feira" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
] as const

export type DayOfWeek = (typeof daysOfWeek)[number]["value"]

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  label: string
}

function TimeInput({ value, onChange, label }: TimeInputProps) {
  const parseTime = (time: string | undefined) => {
    if (!time) return ["", ""]
    const parts = time.split(":")
    return [parts[0] || "", parts[1] || ""]
  }
  const [hours, minutes] = parseTime(value)

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 2)

    if (val.length === 2) {
      const num = parseInt(val, 10)
      if (num > 23) val = "23"
    }

    const mm = minutes || "00"

    onChange(val ? `${val}:${mm}` : "")
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 2)

    if (val.length === 2) {
      const num = parseInt(val, 10)
      if (num > 59) val = "59"
    }

    const hh = hours || "00"

    onChange(val ? `${hh}:${val}` : `${hh}:00`)
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1">
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={hours}
            onChange={handleHoursChange}
            placeholder="00"
            maxLength={2}
            className="h-9 w-12 [appearance:textfield] text-center font-mono text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-muted-foreground font-semibold select-none">
            :
          </span>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={minutes}
            onChange={handleMinutesChange}
            placeholder="00"
            maxLength={2}
            className="h-9 w-12 [appearance:textfield] text-center font-mono text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
        <span className="text-muted-foreground text-[9px] select-none">
          {label}
        </span>
      </div>
    </div>
  )
}
interface ApplyToAllPopoverProps<TFieldValues extends FieldValues> {
  setValue: UseFormSetValue<TFieldValues>
  onApply: () => void
}

function ApplyToAllPopover<TFieldValues extends FieldValues>({
  setValue,
  onApply,
}: ApplyToAllPopoverProps<TFieldValues>) {
  const [open, setOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("monday")
  const [applyOpenStatus, setApplyOpenStatus] = useState(true)
  const [excludedDays, setExcludedDays] = useState<DayOfWeek[]>([])

  const { control } = useFormContext<TFieldValues>()
  const hours = useWatch({
    control,
    name: "hours" as Path<TFieldValues>,
  })

  const toggleExcludedDay = (day: DayOfWeek) => {
    setExcludedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    )
  }

  const handleApply = () => {
    const sourceDay = hours?.[selectedDay]
    if (!sourceDay) return

    daysOfWeek.forEach((day) => {
      if (day.value === selectedDay || excludedDays.includes(day.value)) {
        return
      }

      const dayPath = `hours.${day.value}` as Path<TFieldValues>

      if (applyOpenStatus) {
        setValue(
          `${dayPath}.isOpen` as Path<TFieldValues>,
          sourceDay.isOpen as PathValue<TFieldValues, Path<TFieldValues>>,
        )
      } else {
        setValue(
          `${dayPath}.isOpen` as Path<TFieldValues>,
          true as PathValue<TFieldValues, Path<TFieldValues>>,
        )
      }

      setValue(
        `${dayPath}.openingTime` as Path<TFieldValues>,
        (sourceDay.openingTime || "00:00") as PathValue<
          TFieldValues,
          Path<TFieldValues>
        >,
      )
      setValue(
        `${dayPath}.closingTime` as Path<TFieldValues>,
        (sourceDay.closingTime || "00:00") as PathValue<
          TFieldValues,
          Path<TFieldValues>
        >,
      )
    })

    setOpen(false)
    setExcludedDays([])
    onApply()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <Copy className="h-3.5 w-3.5" />
          Aplicar para todos
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Copiar horários de:</h4>
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day.value}
                  variant={selectedDay === day.value ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setSelectedDay(day.value)}
                >
                  {day.label.split("-")[0]}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Aplicar também:</h4>
            <div className="flex items-center gap-2">
              <Switch
                checked={applyOpenStatus}
                onCheckedChange={setApplyOpenStatus}
                className="data-[state=checked]:bg-primary"
              />
              <span className="text-muted-foreground text-xs">
                Status (aberto/fechado)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold">
              <MinusCircle className="h-4 w-4 text-red-500" />
              Excluir dias:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day.value}
                  variant={
                    excludedDays.includes(day.value) ? "destructive" : "outline"
                  }
                  size="sm"
                  className="text-xs"
                  onClick={() => toggleExcludedDay(day.value)}
                  disabled={day.value === selectedDay}
                >
                  {day.label.split("-")[0]}
                  {excludedDays.includes(day.value) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Button>
              ))}
            </div>
            <p className="text-muted-foreground text-[10px] leading-relaxed">
              Os dias excluídos não receberão os horários copiados.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setOpen(false)
                setExcludedDays([])
              }}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Cancelar
            </Button>
            <Button size="sm" className="flex-1" onClick={handleApply}>
              <Check className="mr-1 h-3.5 w-3.5" />
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function AdminBarbershopHoursField<TFieldValues extends FieldValues>({
  control,
}: {
  control: Control<TFieldValues>
}) {
  const { watch, setValue, trigger } = useFormContext<TFieldValues>()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleApplySuccess = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const handleToggleOpen = (
    dayValue: DayOfWeek,
    isOpen: boolean,
    onChange: (value: boolean) => void,
  ) => {
    onChange(isOpen)

    if (!isOpen) {
      setValue(
        `hours.${dayValue}.openingTime` as Path<TFieldValues>,
        "" as PathValue<TFieldValues, Path<TFieldValues>>,
      )
      setValue(
        `hours.${dayValue}.closingTime` as Path<TFieldValues>,
        "" as PathValue<TFieldValues, Path<TFieldValues>>,
      )
      trigger(`hours.${dayValue}` as Path<TFieldValues>)
    }
  }

  return (
    <div className="group border-border bg-card hover:border-primary/30 relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg md:col-span-2">
      <div className="from-primary via-primary/60 absolute top-0 right-0 left-0 h-1 bg-linear-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="border-border border-b px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <Clock className="text-primary h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold tracking-wide uppercase">
              Horá<span className="text-primary">rios</span>
            </h2>
          </div>

          <ApplyToAllPopover setValue={setValue} onApply={handleApplySuccess} />
        </div>
      </div>

      {showSuccess && (
        <div className="animate-in fade-in slide-in-from-top-2 absolute top-16 left-1/2 z-20 -translate-x-1/2 duration-200">
          <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-green-500">
              Horários aplicados com sucesso!
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="space-y-3">
          {daysOfWeek.map((day) => {
            const isOpen = watch(
              `hours.${day.value}.isOpen` as Path<TFieldValues>,
            )

            return (
              <div
                key={day.value}
                className="border-border bg-background/50 flex flex-col gap-3 rounded-xl border p-4 pb-6 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-foreground w-28 text-sm font-medium select-none">
                    {day.label}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                  <FormField
                    name={`hours.${day.value}.isOpen` as Path<TFieldValues>}
                    control={control}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(value) =>
                              handleToggleOpen(day.value, value, field.onChange)
                            }
                            className="data-[state=checked]:bg-primary"
                          />
                        </FormControl>
                        <span className="text-muted-foreground text-xs select-none">
                          {field.value ? "Aberto" : "Fechado"}
                        </span>
                      </FormItem>
                    )}
                  />

                  {isOpen && (
                    <div className="animate-in fade-in slide-in-from-left-2 flex items-center gap-4 duration-200">
                      <FormField
                        name={
                          `hours.${day.value}.openingTime` as Path<TFieldValues>
                        }
                        control={control}
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormControl>
                              <TimeInput
                                value={field.value || ""}
                                onChange={(val) => {
                                  field.onChange(val)
                                  trigger(
                                    `hours.${day.value}` as Path<TFieldValues>,
                                  )
                                }}
                                label="Abertura"
                              />
                            </FormControl>
                            <FormMessage className="absolute -bottom-6 left-0 max-w-30 text-[10px] leading-tight" />
                          </FormItem>
                        )}
                      />

                      <div className="bg-border flex h-8 w-px items-center" />

                      <FormField
                        name={
                          `hours.${day.value}.closingTime` as Path<TFieldValues>
                        }
                        control={control}
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormControl>
                              <TimeInput
                                value={field.value || ""}
                                onChange={(val) => {
                                  field.onChange(val)
                                  trigger(
                                    `hours.${day.value}` as Path<TFieldValues>,
                                  )
                                }}
                                label="Fechamento"
                              />
                            </FormControl>
                            <FormMessage className="absolute -bottom-6 right-0 text-right text-[10px] leading-tight max-w-30" />


                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
