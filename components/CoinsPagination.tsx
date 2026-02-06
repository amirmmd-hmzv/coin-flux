"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buildPagination, cn, ELLIPSIS } from "@/lib/utils";
import { useRouter } from "next/navigation";
const CoinsPagination = ({
  hasMorePage,
  totalPages,
  currentPage,
}: PaginationProps) => {
  const router = useRouter();

  const handlePeriodChange = (newPage: number) => {
    // Logic to handle page change
    router.push(`/coins?page=${newPage}`);
    console.log("Change to page:", newPage);
  };

  const pageNumbers = buildPagination(currentPage, totalPages);
  const isLastPage = !hasMorePage || currentPage >= totalPages;

  console.log(pageNumbers);

  return (
    <Pagination id="coins-pagination">
      <PaginationContent className="pagination-content ">
        <PaginationItem className="">
          <PaginationPrevious
            className={`${currentPage <= 1 ? "control-disabled" : "control-button"}`}
            onClick={() => handlePeriodChange(currentPage - 1)}
          />
        </PaginationItem>

        <div className="pagination-pages">
          {pageNumbers.map((page) => {
            if (page === ELLIPSIS) {
              return (
                <PaginationItem key={`ellipsis-${Math.random()}`}>
                  <span className="ellipsis">...</span>
                </PaginationItem>
              );
            }
            return (
              <PaginationItem key={`page-${page}`}>
                <PaginationLink
                  className={cn(
                    "page-link",
                    page == currentPage &&
                      "page-link-active  ",
                  )}
                  isActive={page === currentPage}
                  onClick={() => handlePeriodChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
        </div>

        <PaginationItem className="">
          <PaginationNext
            className={cn(
              " ",
              isLastPage ? "control-disabled" : "control-button",
            )}
            onClick={() => handlePeriodChange(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CoinsPagination;
