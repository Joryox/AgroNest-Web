import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-8xl font-bold text-gray-200" aria-hidden="true">
        404
      </p>
      <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="max-w-md text-sm text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="rounded-md bg-primary-600 px-4 py-2 text-sm text-white transition-colors hover:bg-primary-700"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
