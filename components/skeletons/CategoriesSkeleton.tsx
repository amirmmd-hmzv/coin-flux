export const CategoriesSkeleton = () => {
  return (
    <div id="categories-fallback" className="custom-scrollbar">
      <h4>Categories</h4>
      
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-dark-400">
        <div className="col-span-5">
          <div className="category-skeleton skeleton rounded" />
        </div>
        <div className="col-span-3">
          <div className="value-skeleton-md skeleton rounded" />
        </div>
        <div className="col-span-4">
          <div className="value-skeleton-md skeleton rounded" />
        </div>
      </div>

      {/* Skeleton Rows */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-dark-400/50 last:border-b-0 hover:bg-dark-400/20 transition-colors"
        >
          {/* Category Name with Images */}
          <div className="col-span-5 flex items-center gap-2">
            <div className="category-cell">
              <div className="category-skeleton skeleton rounded" />
            </div>
            <div className="top-gainers-cell flex gap-1">
              {Array.from({ length: 3 }).map((_, imgIndex) => (
                <div
                  key={imgIndex}
                  className="coin-skeleton skeleton rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Change Percentage */}
          <div className="col-span-3 flex items-center">
            <div className="change-cell flex gap-1 items-center">
              <div className="value-skeleton-sm skeleton rounded" />
              <div className="change-icon skeleton" />
            </div>
          </div>

          {/* Market Cap */}
          <div className="col-span-4 flex items-center">
            <div className="market-cap-cell">
              <div className="value-skeleton-lg skeleton rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};