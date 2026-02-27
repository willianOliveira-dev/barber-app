"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/app/_components/ui/form"
import { Input } from "@/src/app/_components/ui/input"
import { Textarea } from "@/src/app/_components/ui/textarea"
import { Button } from "@/src/app/_components/ui/button"
import { Switch } from "@/src/app/_components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/app/_components/ui/select"
import {
  Scissors,
  FileText,
  DollarSign,
  Tag,
  Save,
  Loader2,
  Image as ImageIcon,
  Trash2,
} from "lucide-react"
import { NewBarbershopServiceFormData } from "../barbershops/_hooks/use-new-barbershop-service-form.hook"
import { Label } from "@/src/app/_components/ui/label"
import { maskPrice } from "@/src/app/_utils/mask-price.util"
import { maskHours, maskMinutes } from "@/src/app/_utils/mask-time.uti"
import Image from "next/image"
import { useEffect, useMemo } from "react"
import { toast } from "sonner"

interface AdminBarbershopServiceFormProps {
  categories: Array<{ id: string; name: string }>
  onSubmit: (data: NewBarbershopServiceFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function AdminBarbershopServiceForm({
  categories,
  onSubmit,
  onCancel,
  isLoading,
}: AdminBarbershopServiceFormProps) {
  const form = useFormContext<NewBarbershopServiceFormData>()
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

  const handleSubmit = async (values: NewBarbershopServiceFormData) => {
    await onSubmit({ ...values })
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center justify-center p-2">
        {imagePreview ? (
          <div className="group border-border relative h-40 w-full max-w-xs overflow-hidden rounded-xl border">
            <Image
              alt={"Imagem do Serviço"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              src={imagePreview}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button
                variant="destructive"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => {
                  form.setValue("image", undefined)
                }}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <Label className="border-border bg-background hover:border-primary/40 hover:bg-primary/5 group/upload flex h-40 w-full max-w-xs cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-300">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="bg-primary/10 group-hover/upload:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300">
                <ImageIcon className="text-primary h-5 w-5 transition-transform duration-300 group-hover/upload:-translate-y-0.5 group-hover/upload:scale-110" />
              </div>
              <div className="space-y-1">
                <p className="text-foreground text-sm font-semibold">
                  Clique para fazer upload
                </p>
                <p className="text-muted-foreground text-[10px]">
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
            ></FormField>
          </Label>
        )}
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do serviço</FormLabel>
            <div className="relative">
              <Scissors className="text-primary/60 absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
              <FormControl>
                <Input
                  placeholder="Ex: Corte Social"
                  className="pl-9"
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <div className="relative">
              <FileText className="text-primary/60 absolute top-3 left-3 h-3.5 w-3.5" />
              <FormControl>
                <Textarea
                  placeholder="Descreva o serviço..."
                  className="resize-none pl-9"
                  rows={2}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </div>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )}
      />

      <div className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <div className="relative">
                <DollarSign className="text-primary/60 absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
                <FormControl>
                  <Input
                    placeholder="R$ 45,00"
                    className="pl-9"
                    {...field}
                    onChange={(e) => field.onChange(maskPrice(e.target.value))}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="duration.hour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora</FormLabel>
                <FormControl>
                  <Input
                    maxLength={2}
                    inputMode="numeric"
                    placeholder="1h"
                    {...field}
                    onChange={(e) => field.onChange(maskHours(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration.minute"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min</FormLabel>
                <FormControl>
                  <Input
                    maxLength={2}
                    inputMode="numeric"
                    placeholder="30 min"
                    {...field}
                    onChange={(e) =>
                      field.onChange(maskMinutes(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Tag className="text-primary/60 h-3.5 w-3.5" />
                    <SelectValue placeholder="Selecione" />
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="border-border bg-background/50 flex items-center justify-between rounded-xl border px-4 py-2">
            <div className="space-y-0.5">
              <FormLabel className="text-sm font-medium">
                Serviço {field.value ? "ativo" : "inativo"}
              </FormLabel>
              <p className="text-muted-foreground text-[10px]">
                {field.value
                  ? "Exibido na página pública"
                  : "Oculto na página pública"}
              </p>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="border-border flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" className="gap-2" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Salvar
        </Button>
      </div>
    </form>
  )
}
