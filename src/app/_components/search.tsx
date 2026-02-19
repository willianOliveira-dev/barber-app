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
  search: z.string().trim(),
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
    if (!search) return null

    const params = new URLSearchParams()
    params.set("search", search)
    params.set("page", "1")
    params.set("limit", "12")
    router.push(`/barbershops?${params.toString()}`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex items-center gap-2"
      >
        <FormField
          name="search"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  id="search-input"
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
        <Button
          disabled={!form.watch("search").trim()}
          type="submit"
          size="icon"
        >
          <SearchIcon />
        </Button>
      </form>
    </Form>
  )
}
