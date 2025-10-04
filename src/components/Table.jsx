import { useState } from 'react'
import clsx from 'clsx'

const Table = ({ 
  data = [], 
  columns = [], 
  onRowClick,
  className = '',
  sortable = false,
  onSort
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

  if (!data.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    )
  }

  return (
    <div className={clsx('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={clsx(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  sortable && column.sortable !== false && 'cursor-pointer hover:bg-gray-100'
                )}
                onClick={() => column.sortable !== false && handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {sortable && column.sortable !== false && (
                    <span className="text-xs">{getSortIcon(column.key)}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={clsx(
                'hover:bg-gray-50',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick && onRowClick(row, rowIndex)}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table

