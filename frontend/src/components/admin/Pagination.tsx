interface PaginationProps {
  offset: number;
  PAGE_SIZE: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  onPageClick: (pageNumber: number) => void;
}

export const Pagination = ({
  offset,
  PAGE_SIZE,
  totalItems,
  onPrevious,
  onNext,
  onPageClick,
}: PaginationProps) => {
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  return (
    <div className='mt-4 flex justify-between items-center flex-wrap gap-2'>
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded bg-gray-200 text-sm ${
          currentPage === 1
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-300'
        }`}
      >
        Previous
      </button>

      <div className='flex gap-2 flex-wrap'>
        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageClick(page)}
              className={`px-3 py-1 rounded text-sm border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded bg-gray-200 text-sm ${
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-300'
        }`}
      >
        Next
      </button>
    </div>
  );
};
