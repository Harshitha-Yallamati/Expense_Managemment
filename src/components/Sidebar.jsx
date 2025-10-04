import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import clsx from 'clsx'

const Sidebar = () => {
  const { user } = useAuthStore()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'New Expense', href: '/expenses/new', icon: '➕' },
    { name: 'Expenses', href: '/expenses', icon: '📋' },
  ]

  const adminNavigation = [
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Rules', href: '/admin/rules', icon: '⚙️' },
  ]

  const managerNavigation = [
    { name: 'Manager Dashboard', href: '/manager', icon: '📈' },
  ]

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="space-y-1">
          {/* Regular Navigation */}
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}

          {/* Manager Navigation */}
          {user?.role === 'manager' && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              {managerNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </>
          )}

          {/* Admin Navigation */}
          {user?.role === 'admin' && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Admin
              </div>
              {adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar

