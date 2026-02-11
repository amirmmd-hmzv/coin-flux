"use server";
import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error("Could not get base url");

if (!API_KEY) throw new Error("Could not get api key");

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );

  const response = await fetch(url, {
    headers: {
      "x-cg-demo-api-key": API_KEY,
      "Content-type": "application/json",
    } as Record<string, string>,
    next: {
      revalidate,
    },
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response.json().catch(() => {});

    throw new Error(
      `Api error ${response.status} : ${errorBody.error || response.statusText}`,
    );
  }
  return response.json();
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null,
): Promise<PoolData> {
  const fallback: PoolData = {
    id: "",
    address: "",
    name: "",
    network: "",
  };

  if (network && contractAddress) {
    try {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`,
      );

      return poolData.data?.[0] ?? fallback;
    } catch (error) {
      console.log(error);
      return fallback;
    }
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>(
      "/onchain/search/pools",
      { query: id },
    );

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  if (!query || query.trim().length < 2) return [];

  // 1) search endpoint (ids only)
  const searchResult = await fetcher<{
    coins: {
      id: string;
      name: string;
      symbol: string;
      thumb: string;
    }[];
  }>("search", { query }, 30);

  const ids = searchResult.coins
    .slice(0, 10)
    .map((coin) => coin.id)
    .join(",");


  if (!ids) return [];

  // 2) markets endpoint (price + change)
  const markets = await fetcher<
    {
      id: string;
      name: string;
      symbol: string;
      current_price: number;
      price_change_percentage_24h: number;
      image: {
        thumb?: string;
        large?: string;
      };
      market_cap_rank: number | null;
    }[]
  >(
    "coins/markets",
    {
      vs_currency: "usd",
      ids,
      order: "market_cap_desc",
    },
    30,
  );

  // 3) merge final result with search coins metadata
  const finalResult = markets.map((coin) => {
    const searchCoin = searchResult.coins.find((c) => c.id === coin.id);
    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      thumb: searchCoin?.thumb || coin.image?.thumb || "",
      large: coin.image?.large || coin.image?.thumb || "",
      market_cap_rank: coin.market_cap_rank,
      data: {
        price: coin.current_price ?? undefined,
        price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
      },
    };
  });
  console.log(finalResult);
  return finalResult;
}
