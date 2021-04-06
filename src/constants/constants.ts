import BigNumber from "bignumber.js";

export const constants: Constants = {
  // ROUTES
  SCREEN_HOME_ROUTE: "Home",
  SCREEN_SETTINGS_ROUTE: "Settings",
  SCREEN_HOME_DASHBOARD_ROUTE: "HomeTabDashboard",
  SCREEN_HOME_WALLET_ROUTE: "HomeTabWallet",
  SCREEN_HOME_STAKING_ROUTE: "HomeTabStaking",
  SCREEN_HOME_ABOUT_ROUTE: "HomeTabAbout",

  // API
  TENDERMIN_API_BASE_URL: "https://tradescan-tm.switcheo.org",
  TENDERMINT_API_BLOCK_RESULTS_ENDPOINT: "/block_results",

  SWITCHEO_API_BASE_URL: "https://api.switcheo.network/v2",
  SWITCHEO_API_NATIVE_TOKEN_SUPPLY_ENDPOINT: "/exchange/native_token_supply",

  COINGECKO_API_BASE_URL: "https://api.coingecko.com/api/v3",
  COINGECKO_API_SIMPLE_PRICE_ENDPOINT: "/simple/price?ids={Ids}&vs_currencies=usd",
  COINGECKO_API_COINS_LIST: "/coins/list",

  // UI
  PRICE_PRECISION: 4,
  BLOCK_TIME_PRECISION: 2,

  TOKENS_LOGOS: {
    BTC: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    SWTH: "https://s2.coinmarketcap.com/static/img/coins/64x64/2620.png",
    ETH: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    WBTC: "https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png",
    USDC: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    NNEO: "https://s2.coinmarketcap.com/static/img/coins/64x64/1376.png",
    FLM: "https://s2.coinmarketcap.com/static/img/coins/64x64/7150.png",
    BNB: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    BTCB: "https://s2.coinmarketcap.com/static/img/coins/64x64/4023.png",
    BUSD: "https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png",
    BELT: "https://s2.coinmarketcap.com/static/img/coins/64x64/8730.png",
    CEL: "https://s2.coinmarketcap.com/static/img/coins/64x64/2700.png",
    NEX: "https://s2.coinmarketcap.com/static/img/coins/64x64/3829.png",
  },

  // MISC
  SECONDS_IN_A_YEAR: new BigNumber(31536000),

  // STORAGE
  STORAGE_KEY_ADDRESS: "STG_APP_ADDR",
  STORAGE_KEY_LAUNCH_SCREEN: "STG_APP_LAUNCH_SCREEN",

  // URLS
  SERAPH_WEBSITE_LINK: "https://www.seraph.network",
  SERAPH_TWITTER_LINK: "https://twitter.com/seraph_staking",
  SERAPH_TELEGRAM_LINK: "https://t.me/seraph_staking",
  SERAPH_DISCORD_LINK: "https://discord.com/invite/SPh62Hf",
  SERAPH_KEYBASE_LINK: "https://keybase.io/seraph_staking",
};

export interface Constants {
  SCREEN_HOME_ROUTE: string;
  SCREEN_SETTINGS_ROUTE: string;
  SCREEN_HOME_DASHBOARD_ROUTE: string;
  SCREEN_HOME_WALLET_ROUTE: string;
  SCREEN_HOME_STAKING_ROUTE: string;
  SCREEN_HOME_ABOUT_ROUTE: string;
  TENDERMINT_API_BLOCK_RESULTS_ENDPOINT: string;
  SWITCHEO_API_BASE_URL: string;
  SWITCHEO_API_NATIVE_TOKEN_SUPPLY_ENDPOINT: string;
  COINGECKO_API_BASE_URL: string;
  COINGECKO_API_SIMPLE_PRICE_ENDPOINT: string;
  COINGECKO_API_COINS_LIST: string;
  PRICE_PRECISION: number;
  BLOCK_TIME_PRECISION: number;
  TOKENS_LOGOS: Record<string, string>;
  SECONDS_IN_A_YEAR: BigNumber;
  STORAGE_KEY_ADDRESS: string;
  STORAGE_KEY_LAUNCH_SCREEN: string;
  SERAPH_WEBSITE_LINK: string;
  SERAPH_TWITTER_LINK: string;
  SERAPH_TELEGRAM_LINK: string;
  SERAPH_DISCORD_LINK: string;
  SERAPH_KEYBASE_LINK: string;
  TENDERMIN_API_BASE_URL: string;
}
