import { useState, useMemo } from 'react'
import clsx from 'clsx'

const Table = ({ 
  data = [], 
  columns = [], 
  onRowClick,
  className = '',
  sortable = false,
  onSort,
  pagination = false,
  pageSize = 10,
  onPageChange,
  currentPage = 1,
  totalItems,
  loading = false,
  emptyMessage = 'No data available',
  striped = false,
  hover = true
}) => {
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')

  const handleSort = (field) => {
    if (!sortable) return
    
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortDirection(newDirection)
    
    if (onSort) {
      onSort(field, newDirection)
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  // Calculate pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return data
    
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return data.slice(startIndex, endIndex)
  }, [data, currentPage, pageSize, pagination])

  const totalPages = Math.ceil((totalItems || data.length) / pageSize)

  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page)
    }
  }

  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    
    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        Previous
      </button>
    )

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={clsx(
            'px-3 py-2 text-sm font-medium border-t border-b',
            i === currentPage
              ? 'bg-primary-50 border-primary-500 text-primary-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          )}
          aria-label={`Page ${i}`}
          aria-current={i === currentPage ? 'page' : undefined}
        >
          {i}
        </button>
      )
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        Next
      </button>
    )

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing{' '}
            <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
            {' '}to{' '}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, totalItems || data.length)}
            </span>
            {' '}of{' '}
            <span className="font-medium">{totalItems || data.length}</span>
            {' '}results
          </span>
        </div>
        <div className="flex">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {pages}
          </nav>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-sm text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="mt-2 text-sm text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={clsx('bg-white shadow overflow-hidden sm:rounded-md', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="table">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={clsx(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    sortable && column.sortable !== false && 'cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500'
                  )}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      column.sortable !== false && handleSort(column.key)
                    }
                  }}
                  tabIndex={sortable && column.sortable !== false ? 0 : -1}
                  aria-sort={
                    sortable && column.sortable !== false
                      ? sortField === column.key
                        ? sortDirection === 'asc' ? 'ascending' : 'descending'
                        : 'none'
                      : undefined
                  }
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {sortable && column.sortable !== false && (
                      <span className="text-xs" aria-hidden="true">{getSortIcon(column.key)}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={clsx('bg-white divide-y divide-gray-200', striped && 'divide-y-0')}>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={clsx(
                  hover && 'hover:bg-gray-50',
                  striped && rowIndex % 2 === 1 && 'bg-gray-50',
                  onRowClick && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500'
                )}
                onClick={() => onRowClick && onRowClick(row, rowIndex)}
                onKeyDown={(e) => {
                  if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    onRowClick(row, rowIndex)
                  }
                }}
                tabIndex={onRowClick ? 0 : -1}
                role="row"
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={clsx(
                      'px-6 py-4 text-sm text-gray-900',
                      column.className
                    )}
                    role="cell"
                  >
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  )
}

export default Table

