import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function PerfilLoading() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-gradient-to-b from-green-600 to-green-700 text-white">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 bg-green-500" />
            <Skeleton className="h-6 w-32 bg-green-500" />
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center px-6 py-3">
              <Skeleton className="h-5 w-5 mr-3 bg-green-500" />
              <Skeleton className="h-4 w-24 bg-green-500" />
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Tabs Skeleton */}
          <div className="space-y-6">
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-32" />
              ))}
            </div>

            {/* Content Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar and Name */}
                <div className="flex items-center space-x-6">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="grid grid-cols-2 gap-4">
                      <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Textarea */}
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
