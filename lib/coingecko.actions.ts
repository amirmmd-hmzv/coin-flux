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



export async function searchCoins(
  query: string
): Promise<SearchCoin[]> {
  if (!query || query.trim().length < 2) return [];

  const searchResult = await fetcher<SearchResponse>(
    "search",
    { query },
    30
  );

  const ids = searchResult.coins
    .slice(0, 10)
    .map((coin) => coin.id)
    .join(",");

  if (!ids) return [];

  const markets = await fetcher<MarketCoin[]>(
    "coins/markets",
    {
      vs_currency: "usd",
      ids,
      order: "market_cap_desc",
    },
    30
  );

  const finalResult = markets.map((coin) => {
    const searchCoin = searchResult.coins.find(
      (c) => c.id === coin.id
    );

    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      thumb: searchCoin?.thumb || coin.image?.thumb || "",
      large: coin.image?.large || coin.image?.thumb || "",
      market_cap_rank: coin.market_cap_rank,
      data: {
        price: coin.current_price ?? undefined,
        price_change_percentage_24h:
          coin.price_change_percentage_24h ?? 0,
      },
    };
  });

  return finalResult;
}
