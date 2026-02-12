import { BarbershopServiceItem } from "@/app/_components/barbershop-service-item"
import { Copy } from "@/app/_components/copy"
import { Footer } from "@/app/_components/footer"
import { Menu } from "@/app/_components/menu"
import { Button } from "@/app/_components/ui/button"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { categoryRepo } from "@/src/repositories/category.repository"
import {
  ArrowLeft,
  StarIcon,
  MapPinHouse,
  Smartphone,
  MailIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BarbershopPageProps {
  params: Promise<{ slug: string }>
}

export default async function BarbershopPage({ params }: BarbershopPageProps) {
  const { slug } = await params
  const barbershop = await barbershopRepo.findBySlug(slug)
  const categories = await categoryRepo.findAll()

  return (
    <>
      <main className="space-y-4">
        <section className="border-b-secondary flex flex-col items-center border">
          <div className="container">
            <div className="relative h-62.5 w-full overflow-hidden rounded-b-2xl p-5">
              {barbershop?.image ? (
                <Image
                  src={barbershop?.image}
                  alt={barbershop?.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/default.png"
                  alt="Sem imagem"
                  fill
                  className="object-cover"
                />
              )}
              <Button
                asChild
                size={"icon"}
                className="absolute top-5 left-5 z-20"
                variant="secondary"
              >
                <Link href="/">
                  <ArrowLeft />
                </Link>
              </Button>

              <div className="absolute top-5 right-5 z-20">
                <Menu categories={categories} />
              </div>
            </div>
            <div className="flex flex-col gap-2 p-5">
              <h1 className="text-lg font-bold">{barbershop?.name}</h1>
              <div className="space-y-1.5">
                <p className="flex items-center gap-1 text-xs">
                  <MapPinHouse className="text-primary" size={16} />
                  {barbershop?.address}
                </p>
                <p className="flex items-center gap-1 text-xs">
                  <span>
                    <StarIcon className="fill-primary text-primary" size={16} />
                  </span>
                  5,0 (889 avaliação)
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center p-5">
          <div className="container flex flex-col gap-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase">
              Sobre nós
            </h2>
            <p className="text-xs">
              {barbershop?.description ?? "Sem descrição"}
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center p-5">
          <div className="container flex flex-col gap-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase">
              Serviços
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {barbershop?.services.map((service) => (
                <BarbershopServiceItem key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-5">
          <div className="container flex flex-col gap-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase">
              Contato
            </h2>
            <div className="flex flex-col gap-2">
              {barbershop?.phone ? (
                <div className="flex items-center justify-between gap-4">
                  <p className="flex items-center gap-1 text-xs">
                    <span>
                      <Smartphone size={16} />
                    </span>
                    {barbershop.phone}
                  </p>
                  <Copy message={barbershop.phone} />
                </div>
              ) : (
                <p className="text-xs">Sem telefone</p>
              )}
              {barbershop?.email ? (
                <div className="flex items-center justify-between gap-4">
                  <p className="flex items-center gap-1 text-xs">
                    <span>
                      <MailIcon size={16} />
                    </span>
                    {barbershop.email}
                  </p>
                  <Copy message={barbershop.email} />
                </div>
              ) : (
                <p className="text-xs">Sem email</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
