# Cryptofolio

Live demo: [haungo.github.io/cryptofolio](https://haungo.github.io/cryptofolio/)

A simple project for lessons in React with Recoil for state, Axios for CoinGecko API calls, currency conversions, TypeScript, and Tailwind.

The public build uses sample wallets in `src/data/wallets.sample.json`. Real holdings stay in gitignored `src/private/`. Local `npm start` proxies CoinGecko; the GitHub Pages build calls the API directly. 

```bash
npm install
npm start
```
