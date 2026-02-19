import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import Link from "next/link"
import Image from "next/image"

export function NoResultsCard({ query }: { query?: string }) {
  return (
    <Card className="text-card-foreground col-span-2 flex flex-col items-center justify-center border-0 bg-transparent p-8 text-center">
      <CardHeader className="flex w-full flex-col items-center gap-4">
        <div className="relative size-40">
          <Image
            src="/no-results.png"
            alt="Nenhum resultado"
            fill
            className="object-contain"
          />
        </div>
        <CardTitle className="text-lg font-bold">
          Nenhuma barbearia encontrada
        </CardTitle>
      </CardHeader>

      <CardContent className="text-muted-foreground max-w-md text-sm md:text-base">
        {query
          ? `Não encontramos resultados para "${query}". Experimente outra busca ou categoria.`
          : "Não há barbearias disponíveis no momento."}
      </CardContent>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild variant="secondary" size="sm">
          <Link href="/barbershops">Ver todas</Link>
        </Button>
      </div>
    </Card>
  )
}
