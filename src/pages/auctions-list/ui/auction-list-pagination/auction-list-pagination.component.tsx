import { Button } from '@/shared/ui';
import type { TAuctionListPaginationProps } from './auction-list-pagination.types';

export function AuctionListPagination({
  currentPage,
  lastPage,
  onPageChange,
}: TAuctionListPaginationProps) {
  if (lastPage <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between gap-3" aria-label="Пагинация аукционов">
      <Button
        variant="outline"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Назад
      </Button>
      <span className="text-sm text-muted-foreground">
        Страница {currentPage} из {lastPage}
      </span>
      <Button
        variant="outline"
        disabled={currentPage >= lastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Вперёд
      </Button>
    </nav>
  );
}
