"use client"

import {
  Save,
  Upload,
  Building2,
  MapPin,
  Phone,
  Image as ImageIcon,
  Mail,
  Paperclip,
} from "lucide-react"
import { Button } from "../../../_components/ui/button"
import { useRouter } from "next/navigation"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/app/_components/ui/form"
import { Input } from "@/src/app/_components/ui/input"
import {
  NewBarbershopFormData,
  useNewBarbershopForm,
} from "../barbershops/_hooks/use-new-barbershop-form.hook"
import { BsFillHouseHeartFill } from "react-icons/bs"
import { maskPhone } from "@/src/app/_utils/mask-phone.util"
import { maskZipCode } from "@/src/app/_utils/mask-zip-code.util"
import {
  createBarbershopAction,
  type CreateBarbershopData,
} from "../barbershops/_actions/create-barbershop.action"
import { toast } from "sonner"
import { useState } from "react"
import { Label } from "@/src/app/_components/ui/label"
import { Switch } from "@/src/app/_components/ui/switch"
import { BarbershopField } from "./admin-barbershop-field"
import { AdminBarbershopHoursField } from "./admin-barbershop-hours-field"
import { AdminBarbershopStatusField } from "./admin-barbershop-status-field"
import { hoursTransformer } from "@/src/app/_utils/hours-transformer.util"

interface AdminBarbershopFormProps {
  defaultValues?: any
}

export function AdminBarbershopForm({
  defaultValues,
}: AdminBarbershopFormProps) {
  const form = useNewBarbershopForm()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (data: NewBarbershopFormData) => {
    setIsLoading(true)

    const payload: CreateBarbershopData = {
      ...data,
      slug: data.name,
      hours: hoursTransformer.transformHoursForSubmit(data.hours),
      status: {
        isOpen: data.status?.isOpen ?? true,
        reason: data.status?.reason,
        closedUntil: data.status?.closedUntil,
      },
    }

    const res = await createBarbershopAction(payload)

    setIsLoading(false)

    if (!res.success) {
      toast.error(res.message)
      return
    }
    toast.success("Barbearia criada com sucesso!")
    form.reset()
  }

  const router = useRouter()
  const isEditing = !!defaultValues

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="group border-border bg-card hover:border-primary/30 relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg">
              <div className="from-primary via-primary/60 absolute top-0 right-0 left-0 h-1 bg-linear-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="border-border border-b px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <Building2 className="text-primary h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-semibold tracking-wide uppercase">
                    Informa<span className="text-primary">ções básicas</span>
                  </h2>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-5">
                <BarbershopField
                  label="Nome da barbearia"
                  name="name"
                  placeholder="Ex: Razor Centro"
                  control={form.control}
                  icon={Building2}
                />
                <BarbershopField
                  label="Descrição"
                  name="description"
                  placeholder="Descreva a barbearia, especialidades, ambiente..."
                  control={form.control}
                  isRequired={false}
                  inputType="textarea"
                  className="min-h-30 flex-1"
                />
                <BarbershopField
                  label="Website"
                  name="website"
                  isRequired={false}
                  placeholder="https://sua-barbearia.com"
                  control={form.control}
                  icon={Paperclip}
                />

                <FormField
                  name="isActive"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="border-border bg-background/50 flex items-center justify-between rounded-xl border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-xs font-semibold tracking-wide">
                          Status da barbearia
                        </FormLabel>
                        <p className="text-muted-foreground text-[10px]">
                          {field.value
                            ? "Visível na plataforma"
                            : "Não será exibida na plaforma"}
                        </p>
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
              </div>
            </div>

            <div className="group border-border bg-card hover:border-primary/30 relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg">
              <div className="from-primary via-primary/60 absolute top-0 right-0 left-0 h-1 bg-linear-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="border-border border-b px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <MapPin className="text-primary h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-semibold tracking-wide uppercase">
                    Endere<span className="text-primary">ço</span>
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-5">
                <BarbershopField
                  label="Logradouro"
                  name="address"
                  placeholder="Rua das Flores"
                  control={form.control}
                  icon={BsFillHouseHeartFill}
                />
                <BarbershopField
                  label="Bairro"
                  name="neighborhood"
                  placeholder="Jardim das Flores"
                  control={form.control}
                  isRequired={false}
                />
                <div className="grid grid-cols-2 gap-4">
                  <BarbershopField
                    label="Número"
                    name="streetNumber"
                    placeholder="562"
                    control={form.control}
                  />
                  <BarbershopField
                    label="CEP"
                    name="zipCode"
                    placeholder="00000-000"
                    onChange={(val) => maskZipCode(val)}
                    control={form.control}
                  />
                </div>
                <BarbershopField
                  label="Complemento"
                  name="complement"
                  placeholder="Loja 5, Sala 2..."
                  control={form.control}
                  isRequired={false}
                />
                <div className="grid grid-cols-2 gap-4">
                  <BarbershopField
                    label="Cidade"
                    name="city"
                    placeholder="São Paulo"
                    control={form.control}
                  />
                  <BarbershopField
                    label="Estado"
                    name="state"
                    placeholder="SP"
                    inputType="select"
                    control={form.control}
                  />
                </div>
              </div>
            </div>

            <div className="group border-border bg-card hover:border-primary/30 relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg">
              <div className="from-primary via-primary/60 absolute top-0 right-0 left-0 h-1 bg-linear-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="border-border border-b px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <Phone className="text-primary h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-semibold tracking-wide uppercase">
                    Conta<span className="text-primary">to</span>
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-5">
                <BarbershopField
                  label="Telefone"
                  name="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  onChange={(val) => maskPhone(val)}
                  control={form.control}
                  isRequired={false}
                  icon={Phone}
                />
                <BarbershopField
                  label="E-mail"
                  name="email"
                  type="email"
                  placeholder="contato@barbearia.com"
                  control={form.control}
                  isRequired={false}
                  icon={Mail}
                />
              </div>
            </div>

            <div className="group border-border bg-card hover:border-primary/30 relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg">
              <div className="from-primary via-primary/60 absolute top-0 right-0 left-0 h-1 bg-linear-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="border-border border-b px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <ImageIcon className="text-primary h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-semibold tracking-wide uppercase">
                    Ima<span className="text-primary">gem</span>
                  </h2>
                </div>
              </div>

              <div className="flex min-h-80 items-center justify-center p-5">
                <Label className="border-border bg-background hover:border-primary/40 hover:bg-primary/5 group/upload flex w-full max-w-sm cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-300">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="bg-primary/10 group-hover/upload:bg-primary/20 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300">
                      <Upload className="text-primary h-7 w-7 transition-transform duration-300 group-hover/upload:-translate-y-0.5 group-hover/upload:scale-110" />
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-foreground text-sm font-semibold">
                        Clique para fazer upload
                      </p>
                      <p className="text-muted-foreground text-xs">
                        PNG, JPG ou WebP • Máx. 5MB
                      </p>
                    </div>

                    <div className="border-border bg-background/50 text-muted-foreground flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px]">
                      <span>Recomendado:</span>
                      <span className="text-foreground font-medium">
                        1200x800px
                      </span>
                    </div>
                  </div>
                  <Input type="file" className="hidden" accept="image/*" />
                </Label>
              </div>
            </div>

            <AdminBarbershopHoursField control={form.control} />
            <AdminBarbershopStatusField control={form.control} />
          </div>

          <div className="border-border bg-card/50 flex items-center justify-end gap-3 rounded-2xl border p-4 backdrop-blur-sm">
            <Button
              variant="secondary"
              className="hover:bg-muted/80 rounded-xl px-8 transition-colors"
              onClick={() => router.back()}
              type="button"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              className="group/btn shadow-primary/20 hover:shadow-primary/30 gap-2 rounded-xl px-8 shadow-lg transition-all hover:shadow-xl disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
              {isLoading ? (
                <>
                  <span className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  Enviando...
                </>
              ) : isEditing ? (
                "Salvar alterações"
              ) : (
                "Criar barbearia"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
