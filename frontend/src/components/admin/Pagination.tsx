interface PaginationProps {
  isFirstPage: boolean;
  hasNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
  offset: number;
  PAGE_SIZE: number;
}

export const Pagination = ({
  isFirstPage,
  hasNextPage,
  onPrevious,
  onNext,
  offset,
  PAGE_SIZE,
}: PaginationProps) => (
  <div className='mt-4 flex justify-between items-center'>
    <button
      onClick={onPrevious}
      disabled={isFirstPage}
      className={`px-4 py-2 rounded bg-gray-200 text-sm ${
        isFirstPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
      }`}
    >
      Previous
    </button>

    <span className='text-sm text-gray-600'>
      Page {Math.floor(offset / PAGE_SIZE) + 1}
    </span>

    <button
      onClick={onNext}
      disabled={!hasNextPage}
      className={`px-4 py-2 rounded bg-gray-200 text-sm ${
        hasNextPage ? 'hover:bg-gray-300' : 'opacity-50 cursor-not-allowed'
      }`}
    >
      Next
    </button>
  </div>
);
