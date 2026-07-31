export type TAuctionListPaginationProps = Readonly<{
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}>;
