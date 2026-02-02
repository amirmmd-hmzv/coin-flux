export const CoinOverviewSkeleton = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2.5">
        <div className="header-image skeleton" />
        <div className="info">
          <div className="header-line-sm skeleton" />
          <div className="header-line-lg skeleton mt-2" />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="period-button-skeleton skeleton" />
          ))}
        </div>
      </div>

    
    </div>
  );
};
