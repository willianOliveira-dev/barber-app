"use client"

import { useMemo } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"
import { Button } from "./ui/button"

interface AppPaginationProps {
  meta: {
    limit: number
    total: number
    page: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

const PAGES_PER_BLOCK = 3

export function AppPagination({ meta }: AppPaginationProps) {
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams()
    params.set("page", pageNumber.toString())
    params.set("limit", meta.limit.toString())
    return `?${params.toString()}`
  }

  const currentBlock = Math.floor((meta.page - 1) / PAGES_PER_BLOCK)
  const totalBlocks = Math.ceil(meta.totalPages / PAGES_PER_BLOCK)

  const pages = useMemo(() => {
    const start = currentBlock * PAGES_PER_BLOCK + 1
    const end = Math.min(start + PAGES_PER_BLOCK - 1, meta.totalPages)

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [currentBlock, meta.totalPages])

  if (meta.totalPages <= 1) return null

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <Button disabled={!meta.hasPreviousPage} variant="ghost">
            <PaginationPrevious href={createPageUrl(meta.page - 1)} />
          </Button>
        </PaginationItem>

        {/* Ellipse anterior */}
        {currentBlock > 0 && (
          <PaginationItem>
            <PaginationLink
              href={createPageUrl(currentBlock * PAGES_PER_BLOCK)}
            >
              ...
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Páginas do bloco */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={createPageUrl(page)}
              isActive={meta.page === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Ellipse próxima */}
        {currentBlock < totalBlocks - 1 && (
          <PaginationItem>
            <PaginationLink
              href={createPageUrl((currentBlock + 1) * PAGES_PER_BLOCK + 1)}
            >
              ...
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next */}
        <PaginationItem>
          <Button disabled={!meta.hasNextPage} variant="ghost">
            <PaginationNext href={createPageUrl(meta.page + 1)} />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
