const OrderSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          <div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Search and Filters Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse mb-4"></div>
        <div className="flex items-center justify-between">
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Orders Skeleton */}
      <div className="grid gap-6">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
            {/* Order Header Skeleton */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b-2 border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div>
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-10 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSkeleton;