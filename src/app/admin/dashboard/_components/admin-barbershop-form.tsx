"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  Building2,
  MapPin,
  Phone,
  ImageIcon,
  Paperclip,
  Mail,
  House,
  Upload,
  Loader2,
  Trash2,
} from "lucide-react"
import { Button } from "@/src/app/_components/ui/button"
import { Input } from "@/src/app/_components/ui/input"
import { Switch } from "@/src/app/_components/ui/switch"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/app/_components/ui/form"
import {
  useNewBarbershopForm,
  NewBarbershopFormData,
} from "../barbershops/_hooks/use-new-barbershop-form.hook"
import { AdminBarbershopHoursField } from "./admin-barbershop-hours-field"
import { AdminBarbershopStatusField } from "./admin-barbershop-status-field"
import {
  createBarbershopAction,
  CreateBarbershopData,
} from "../barbershops/_actions/create-barbershop.action"
import { toast } from "sonner"
import { hoursTransformer } from "@/src/app/_utils/hours-transformer.util"
import { BarbershopField } from "./admin-barbershop-field"
import { maskZipCode } from "@/src/app/_utils/mask-zip-code.util"
import { maskPhone } from "@/src/app/_utils/mask-phone.util"
import { Label } from "@/src/app/_components/ui/label"
import Image from "next/image"
import { updateBarbershopAction } from "../barbershops/_actions/update-barbershop.action"

interface AdminBarbershopFormProps {
  defaultValues?: Partial<NewBarbershopFormData>
  barbershopId?: string
  isEditing?: boolean
}

export function AdminBarbershopForm({
  defaultValues,
  barbershopId,
  isEditing = false,
}: AdminBarbershopFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [searchingZipCode, setSearchingZipCode] = useState(false)

  const form = useNewBarbershopForm(defaultValues)
  const imageFormData = new FormData()

  const imageValue = form.watch("image")

  const imagePreview = useMemo(() => {
    if (!imageValue) return undefined
    if (typeof imageValue === "string") return imageValue
    return URL.createObjectURL(imageValue)
  }, [imageValue])

  useEffect(
    () => () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
    },
    [imagePreview],
  )

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [])

  const handleSubmit = async (data: NewBarbershopFormData) => {
    setIsLoading(true)

    if (data.image && data.image instanceof File) {
      imageFormData.append("image", data.image)
    }

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

    const result =
      isEditing && barbershopId
        ? await updateBarbershopAction({
            barbershopId,
            data: payload,
            imageFormData,
          })
        : await createBarbershopAction({ data: payload, imageFormData })

    setIsLoading(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)

    if (!isEditing) form.reset()

    router.refresh()
    router.push("/admin/dashboard/barbershops")
  }

  const handleZipCodeBlur = async (zipCode: string) => {
    const cleanZipCode = zipCode.replace(/\D/g, "")

    if (cleanZipCode.length !== 8) return zipCode

    const updateFormFields = ({
      street,
      neighborhood,
      city,
      state,
      complement,
    }: {
      street: string
      neighborhood: string
      city: string
      state: string
      complement?: string
    }) => {
      form.setValue("address", street)
      form.setValue("neighborhood", neighborhood)
      form.setValue("city", city)
      form.setValue("state", state)
      form.setValue("complement", complement ?? "")
    }
    try {
      setSearchingZipCode(true)
      const response = await fetch(
        `https://brasilapi.com.br/api/cep/v1/${cleanZipCode}`,
      )
      const data = await response.json()

      if (!response.ok) throw new Error("BrasilAPI falhou")

      updateFormFields({
        street: data.street,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      })
    } catch (error) {
      console.warn("[handleZipCodeBlur]", error)
      try {
        const fallbackResponse = await fetch(
          `https://viacep.com.br/ws/${cleanZipCode}/json/`,
        )
        const fallbackData = await fallbackResponse.json()

        if (!fallbackResponse.ok) return zipCode

        updateFormFields({
          street: fallbackData.logradouro,
          neighborhood: fallbackData.bairro,
          city: fallbackData.localidade,
          state: fallbackData.uf,
          complement: fallbackData.complemento,
        })
      } catch (error) {
        console.error("[handleZipCodeBlur] BrasilAPI e ViaCEP falharam", error)
      }
    } finally {
      setSearchingZipCode(false)
    }

    return zipCode
  }

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="group border-border bg-card relative overflow-hidden rounded-2xl border">
            <div className="relative h-52 w-full sm:h-64 lg:h-72">
              {imagePreview ? (
                <>
                  <Image
                    alt="Imagem da Barbearia"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    src={imagePreview}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute top-4 right-4">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="hover:bg-destructive h-9 w-9 rounded-xl border border-white/10 bg-black/50 text-white backdrop-blur-sm"
                      onClick={() => form.setValue("image", undefined)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute bottom-4 left-5">
                    <p className="text-[10px] font-semibold tracking-[0.18em] text-white/50 uppercase">
                      Imagem de capa
                    </p>
                  </div>
                </>
              ) : (
                <Label className="group/upload from-primary/5 via-background to-background hover:from-primary/10 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 bg-linear-to-br transition-colors">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="bg-primary/10 group-hover/upload:bg-primary/20 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300">
                      <Upload className="text-primary h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-foreground text-sm font-semibold">
                        Adicionar imagem de capa
                      </p>
                      <p className="text-muted-foreground text-xs">
                        PNG, JPG ou WebP • Máx. 5MB
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpeg, image/webp"
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const isImage = [
                                "image/jpeg",
                                "image/png",
                                "image/webp",
                              ].includes(file.type)
                              if (!isImage) {
                                toast.warning(
                                  "Formato de imagem não suportado. Escolha um JPG, PNG ou WebP.",
                                )
                                e.target.value = ""
                                return
                              }
                              field.onChange(file)
                            }
                          }}
                        />
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </Label>
              )}
            </div>

            <div className="border-border border-t p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Building2 className="text-primary h-4 w-4" />
                </div>
                <h2 className="text-sm font-semibold tracking-wide uppercase">
                  Informa<span className="text-primary">ções básicas</span>
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                <BarbershopField
                  label="Nome da barbearia"
                  name="name"
                  placeholder="Ex: Razor Carioca"
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
                            : "Não será exibida na plataforma"}
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
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="group border-border bg-card hover:border-primary/30 relative overflow-hidden rounded-2xl border transition-all duration-300">
              <div className="from-primary via-primary/60 absolute top-0 right-0 left-0 h-px bg-linear-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
                  placeholder="Rua Coronel Bernardino de Melo"
                  control={form.control}
                  icon={House}
                />
                <BarbershopField
                  label="Bairro"
                  name="neighborhood"
                  placeholder="Vilar dos Teles"
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
                  <div className="relative">
                    <BarbershopField
                      label="CEP"
                      name="zipCode"
                      placeholder="00000-000"
                      onChange={(val) => maskZipCode(val)}
                      onBlur={handleZipCodeBlur}
                      control={form.control}
                    />
                    {searchingZipCode && (
                      <span className="absolute top-1/2 right-5 translate-y-1/2">
                        <Loader2 size={16} className="animate-spin" />
                      </span>
                    )}
                  </div>
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
                    placeholder="São João de Meriti"
                    control={form.control}
                  />
                  <BarbershopField
                    label="Estado"
                    name="state"
                    placeholder="RJ"
                    inputType="select"
                    control={form.control}
                  />
                </div>
              </div>
            </div>

            <div className="group border-border bg-card hover:border-primary/30 relative overflow-hidden rounded-2xl border transition-all duration-300">
              <div className="from-primary via-primary/60 absolute top-0 right-0 left-0 h-px bg-linear-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
                  Salvando...
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
