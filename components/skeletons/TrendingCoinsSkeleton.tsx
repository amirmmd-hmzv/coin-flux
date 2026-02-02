export const TrendingCoinsSkeleton = () => {
  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>

      <div className="trending-coins-table">
        {/* Table Header */}
        <div className="flex border-b border-purple-100/5">
          <div className="flex-1 p-4 pl-5">
            <div className="header-line-sm skeleton" />
          </div>
          <div className="flex-1 p-4">
            <div className="header-line-sm skeleton" />
          </div>
          <div className="flex-1 p-4 pr-5">
            <div className="header-line-sm skeleton" />
          </div>
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5, 6].map((row) => (
          <div
            key={row}
            className="flex border-b border-purple-100/5 hover:bg-dark-400/30 py-4"
          >
            {/* Name Cell */}
            <div className="flex-1 pl-5 flex items-center gap-3">
              <div className="name-image skeleton" />
              <div className="name-line skeleton" />
            </div>

            {/* Change Cell */}
            <div className="flex-1 pr-3 md:pr-5 flex items-center gap-2">
              <div className="change-line skeleton" />
              <div className="change-icon skeleton" />
            </div>

            {/* Price Cell */}
            <div className="flex-1 pr-5 flex items-center">
              <div className="price-line skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
