import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/app/_components/ui/select"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/app/_components/ui/form"
import { Input } from "@/src/app/_components/ui/input"
import { Textarea } from "@/src/app/_components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/app/_components/ui/tooltip"
import { LucideIcon } from "lucide-react"
import { Control, FieldValues, Path } from "react-hook-form"
import { IconType } from "react-icons/lib"

const BRAZILIAN_STATES = [
  { label: "Acre", value: "AC" },
  { label: "Alagoas", value: "AL" },
  { label: "Amapá", value: "AP" },
  { label: "Amazonas", value: "AM" },
  { label: "Bahia", value: "BA" },
  { label: "Ceará", value: "CE" },
  { label: "Distrito Federal", value: "DF" },
  { label: "Espírito Santo", value: "ES" },
  { label: "Goiás", value: "GO" },
  { label: "Maranhão", value: "MA" },
  { label: "Mato Grosso", value: "MT" },
  { label: "Mato Grosso do Sul", value: "MS" },
  { label: "Minas Gerais", value: "MG" },
  { label: "Pará", value: "PA" },
  { label: "Paraíba", value: "PB" },
  { label: "Paraná", value: "PR" },
  { label: "Pernambuco", value: "PE" },
  { label: "Piauí", value: "PI" },
  { label: "Rio de Janeiro", value: "RJ" },
  { label: "Rio Grande do Norte", value: "RN" },
  { label: "Rio Grande do Sul", value: "RS" },
  { label: "Rondônia", value: "RO" },
  { label: "Roraima", value: "RR" },
  { label: "Santa Catarina", value: "SC" },
  { label: "São Paulo", value: "SP" },
  { label: "Sergipe", value: "SE" },
  { label: "Tocantins", value: "TO" },
]

export interface BarbershopFieldProps<TFieldValues extends FieldValues> {
  label: string
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  inputType?: "input" | "textarea" | "select"
  isRequired?: boolean
  type?: string
  onChange?: (value: string) => string
  onBlur?: (value: string) => Promise<string> | string
  placeholder?: string
  icon?: LucideIcon | IconType
  className?: string
}

export function BarbershopField<TFieldValues extends FieldValues>({
  label,
  name,
  control,
  type = "text",
  inputType = "input",
  isRequired = true,
  onChange,
  onBlur,
  placeholder,
  icon: Icon,
  className = "",
}: BarbershopFieldProps<TFieldValues>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide">
            {Icon && <Icon className="h-4 w-4" />}
            {label}
            {isRequired && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-primary cursor-help">*</span>
                </TooltipTrigger>
                <TooltipContent className="p-2 text-[10px]">
                  Campo obrigatório
                </TooltipContent>
              </Tooltip>
            )}
          </FormLabel>

          <FormControl>
            {(() => {
              const baseStyles =
                "border-border bg-background/50 text-foreground focus:border-primary/50 focus:ring-primary/20 hover:border-primary/20 transition-all duration-200 focus:ring-1 focus:outline-none rounded-xl border text-sm"
              switch (inputType) {
                case "input":
                  return (
                    <Input
                      {...field}
                      type={type}
                      placeholder={placeholder}
                      className={`${baseStyles} h-11 px-4 py-2.5`}
                      onChange={(e) => {
                        const rawValue = e.target.value
                        const valueToSet = onChange
                          ? onChange(rawValue)
                          : rawValue
                        field.onChange(valueToSet)
                      }}
                      onBlur={(e) => {
                        const rawValue = e.target.value
                        if (onBlur) onBlur(rawValue)
                        field.onBlur()
                      }}
                    />
                  )

                case "textarea":
                  return (
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder={placeholder}
                      className={`${baseStyles} resize-none px-4 py-3`}
                    />
                  )

                case "select":
                  return (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className={`${baseStyles} h-11 w-full px-4`}
                      >
                        <SelectValue
                          placeholder={placeholder || "Selecione o estado"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {BRAZILIAN_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label} - {state.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )
                
              }
            })()}
          </FormControl>

          <FormMessage className="mt-1 text-[10px]" />
        </FormItem>
      )}
    />
  )
}
