"use client"

import { SearchIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const searchForm = z.object({
  search: z.string().trim().min(1, { message: "Digite algo para buscar" }),
})

type SearchData = z.infer<typeof searchForm>

const useSearhForm = () => {
  return useForm<SearchData>({
    resolver: zodResolver(searchForm),
    defaultValues: {
      search: "",
    },
  })
}

export function Search() {
  const router = useRouter()
  const form = useSearhForm()

  const handleSubmit = ({ search }: SearchData) => {
    router.push(`${process.env.NEXT_PUBLIC_URL}/barbershops?search=${search}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2">
        <FormField
          name="search"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  name="search"
                  placeholder="Faça sua busca..."
                  className="bg-input focus:ring-primary mt-1 w-full rounded-xl px-4 py-3 outline-none focus:ring-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="icon">
          <SearchIcon />
        </Button>
      </form>
    </Form>
  )
}
