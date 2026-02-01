import DataTable from "@/components/DataTable";
import Image from "next/image";

const Home = () => {
  return (
    <main className="main-container">
      <section className="home-grid">
        <div id="coin-overview">
          <div className="header pt-2.5">
            <Image
              width={56}
              height={56}
              alt="bitcoin logo"
              src={
                "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
              }
            />
            <div className="info">
              <p>Bitcoin / BTC</p>
              <h1>$900,000.00</h1>
            </div>
          </div>
        </div>

        <p>Trending Coins</p>
        <DataTable />
      </section>

      <section className="w-full mt-7 space-y-4">
        <p>Categories</p>
      </section>
    </main>
  );
};

export default Home;
