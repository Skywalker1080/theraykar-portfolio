import type { SubProject, Story } from "@/components/sub-projects";

export type Work = {
  slug?: string; // set when the work has its own detail page at /work/[slug]
  title: string;
  description: string;
  image: string;
  href: string;
  story?: Story; // What / Why / How of the whole product, shown on its detail page
  projects?: SubProject[];
};

export const RECENT_WORK: Work[] = [
  {
    slug: "crypto-prism",
    title: "Crypto Prism",
    description:
      "Ask about any coin in plain English and get an instant, quant-grade read on it.",
    image: "/cp-website.png",
    href: "https://cryptoprism-io.firebaseapp.com/",
    story: {
      what: "One place where crypto investors and quant teams get quant-grade data on any coin: market, on-chain and off-chain, side by side. It isn't a trading platform. It's the research desk you check before you trade.",
      why: "Serious crypto research meant juggling platforms: one for on-chain data, another for trading data, a third for news and off-chain signals. Each came with its own subscription, priced for US budgets, which put quant-grade analysis out of reach for most Indian investors.",
      how: "We brought every source into a single pipeline and a single database, so every number on the platform speaks the same language, then put a plain-English layer on top. Pricing is built for India, at a fraction of what global platforms charge. The trade-off was deliberate: we chose breadth of data and an accessible price over split-second speed, because research doesn't need a trading terminal.",
    },
    projects: [
      {
        area: "Product",
        name: "Frontend app",
        what: "The window into Crypto Prism: discover coins, screen them, read signals and news, and ask questions in plain English, all in one dashboard.",
        why: "Quant-grade data is useless if only quants can read it. The product had to feel fast and obvious, even on an average connection in India.",
        how: "I kept the app itself as light as possible and pushed the heavy lifting to the backend, so pages load instantly and hosting stays cheap. Live prices come straight from the exchange, with a fallback if that ever fails. The trade-off: some search-engine visibility on individual coin pages, given up for speed and a much lower running cost.",
        image: "/cp-website.png",
        stack: ["Next.js", "React", "TypeScript", "FastAPI", "Redis"],
        nerds: {
          stages: [
            { kind: "ui", title: "Static app", detail: "Next.js exported to static files on Firebase Hosting" },
            { kind: "check", title: "Auth", detail: "Cognito tokens; guests get 25 free queries a day" },
            { kind: "api", title: "Data hooks", detail: "~21 SWR hooks, all fetching client-side" },
            { kind: "process", title: "FastAPI", detail: "JWT check, Redis cache, async Postgres" },
            { kind: "store", title: "Postgres", detail: "The production analytics DB on AWS RDS" },
          ],
          notes: [
            "Static export means there's no frontend server to run: Firebase serves files with year-long caching on JS and CSS. The cost is no SSR, so caching moves to SWR in the browser and Redis on the API.",
            "Candles and tickers come straight from Binance's public API to cut backend load. If that's blocked or rate-limited, the app falls back to the backend's price endpoint, with a short shared cache so a burst of failures becomes one request.",
            "Slow natural-language queries go to a separate agent service with a long timeout, so they never block the main API.",
            "The free tier is enforced on both sides: the client stops at 25 guest queries a day, and the server checks the same limit.",
          ],
        },
      },
      {
        area: "Agent",
        name: "NL to Screener",
        what: "A screener you talk to. Ask something like \u201Ccoins with RSI under 30 and a high Prism score\u201D and get the matching list, with a short summary of what it found.",
        why: "Screeners usually mean stacking filters or writing queries. Most investors know the question they want to ask, not how to phrase it for a database, and fixed filters can't express ideas like \u201Cbreaking out on rising volume\u201D.",
        how: "An AI model on AWS turns the question into a small, purpose-built program, which runs in a locked-down sandbox against our data for the top coins. If the question is vague, it asks before guessing. If the program fails, it repairs itself, and if nothing matches, it suggests related screens. The trade-off: writing a program is slower than a simple lookup, but it can answer far richer questions, and the sandbox means flexibility never comes at the cost of safety.",
        stack: ["AWS Bedrock", "LangGraph", "FastAPI", "TA-Lib", "AWS App Runner"],
        nerds: {
          stages: [
            { kind: "agent", title: "Parse intent", detail: "Is it a screener? Scored for confidence" },
            { kind: "ui", title: "Clarify", detail: "Below 0.75 confidence, the graph pauses to ask the user" },
            { kind: "agent", title: "Plan + generate", detail: "Bedrock LLM plans, then writes the Python contract" },
            { kind: "check", title: "Validate", detail: "AST guardrail: import allowlist, banned builtins and dunders" },
            { kind: "process", title: "Sandbox run", detail: "Env-stripped subprocesses; 5-coin smoke test, then the universe" },
            { kind: "api", title: "Stream result", detail: "Rows, summary or alternatives over SSE" },
          ],
          notes: [
            "The LLM writes a contract, not free-form code: a per-coin function returning one row (it can use TA-Lib on OHLCV) and a main() returning raw data, filtered data, exceptions and a summary. A header declares which datasets it needs (fundamentals, technicals, indicators, ML signals), and only those are prefetched.",
            "The code started as NL-to-SQL with an AST validator, then moved to Python, because per-coin technical analysis and logic spanning several datasets are awkward in SQL. It costs latency (p50 about 22s) and a sandbox, in exchange for far more expressive screens.",
            "Defence in depth: the AST validator blocks dangerous imports, builtins and escape chains like pd.io.common.os, but process isolation is the real boundary. Workers run with a stripped environment, a watchdog timeout, a 512MB memory cap, and return results as JSON so the server never unpickles untrusted output.",
            "Failures loop back into generation with the error attached, up to 2 repairs. Zero results go to an alternatives step rather than an empty table, and a failed dataset fetch is reported as unavailable, not silently shown as zero rows.",
            "Capacity is bounded on purpose: 2 concurrent sandbox runs and a 30s wait, then an honest \u201Cbusy\u201D instead of an unbounded queue, with the whole request kept under App Runner's 120s limit. Clarification state lives in a LangGraph checkpointer, and every step is traced in Langfuse.",
          ],
        },
      },
      {
        area: "ML",
        name: "Price forecasting pipeline",
        what: "A model that scores every coin worth over $50M each day and flags which look likely to outperform or underperform over the next few days, as buy, hold or sell signals.",
        why: "Raw indicators tell you what already happened. Investors want a disciplined, data-backed read on what's likely next, without the guesswork.",
        how: "The model learns from years of price history, technical indicators and the tone of crypto news, and is only ever tested on data from after its training period, so results aren't flattered. Signals fire only when a coin looks unusually strong or weak for itself, and a market-mood check holds them back in bad conditions. The trade-off: fewer signals, but ones you can trust more.",
        stack: ["LightGBM", "PyTorch", "FinBERT", "PostgreSQL", "GitHub Actions"],
        repo: "https://github.com/CryptoPrism-io/CryptoPrism-News-Fetcher",
        nerds: {
          stages: [
            { kind: "source", title: "News + prices", detail: "CoinDesk news scored by FinBERT; OHLCV and indicator tables" },
            { kind: "process", title: "Features", detail: "Technicals, BTC residuals, cross-coin and news features in materialized views" },
            { kind: "model", title: "Embeddings", detail: "TCN over 168h of hourly data; LSTM over 30 days" },
            { kind: "model", title: "LightGBM", detail: "Multiclass on 3-day forward returns, plus a meta-learner" },
            { kind: "check", title: "Regime gate", detail: "BTC momentum, volatility, Fear & Greed, breadth" },
            { kind: "store", title: "Signals", detail: "Rolling z-score into BUY / HOLD / SELL, written to Postgres" },
          ],
          notes: [
            "Walk-forward splits only, never random ones, so the model is never scored on the past it trained on. On held-out test data the 3-day rank correlation (Spearman IC) is about 0.11.",
            "Two training modes: price-only uses the full 13-year price history, news-augmented adds sentiment but has only about 128 days of overlap. Depth of history versus richer features.",
            "Model output becomes a per-coin rolling z-score over 30 days (BUY above +1.5, SELL below \u22121.5), so thresholds adapt to each coin's own behaviour instead of one global cut-off.",
            "Everything runs on GitHub Actions: news NLP and daily signals each morning, an hourly ensemble, and a weekly retrain on Sundays. Models are versioned in a registry table.",
          ],
        },
      },
      {
        area: "Data",
        name: "Data pipeline",
        what: "The engine underneath everything: every day it pulls data for the top 1,000 coins and computes 100+ indicators that the rest of the platform reads from.",
        why: "Every answer, screen and signal on the platform is only as good as the data behind it.",
        how: "It runs on its own every day in a fixed order, with the heavy calculations split up and run side by side to finish fast. Separate checks watch for stale or missing data and raise the alarm, and big historical rebuilds happen in a safe copy before they touch production. The trade-off: correctness over freshness. A number that arrives a little late beats one that's wrong.",
        stack: ["Python", "R", "PostgreSQL", "AWS RDS", "GitHub Actions"],
        repo: "https://github.com/CryptoPrism-io/CryptoPrism-DB-D",
        nerds: {
          stages: [
            { kind: "source", title: "Listings", detail: "CoinMarketCap top 1,000, daily at 00:30 UTC" },
            { kind: "source", title: "OHLCV", detail: "R crypto2 pulls daily candles into Postgres" },
            { kind: "process", title: "Indicators", detail: "10 producers in parallel: momentum, oscillators, risk, ratios" },
            { kind: "model", title: "DMV scores", detail: "Rolled up into Durability, Momentum and Valuation" },
            { kind: "check", title: "QA + health", detail: "Hourly checks for reachability and stale tables" },
            { kind: "store", title: "AWS RDS", detail: "Production Postgres the whole platform reads" },
          ],
          notes: [
            "Stages are chained with GitHub Actions workflow_run triggers rather than fixed cron times, so ordering is guaranteed. The flip side: one upstream failure stalls the chain, which is why the health check exists.",
            "The 10 indicator producers run as a parallel matrix, cutting the run from ~40 minutes to ~11. Concurrency is capped at 6 so database connections don't run out.",
            "The health check was added after the old one exited 0 even when the database was unreachable. It now verifies connectivity, auth and that no table is more than two days stale.",
            "Backfills write to a shadow schema with idempotent, resumable upserts, and need explicit approval to promote. One run rebuilt 2.59M rows across 3,587 coins on ECS Fargate.",
            "A sibling pipeline runs the same idea hourly on the top 250 coins and opens a GitHub issue automatically on failure.",
          ],
        },
      },
    ],
  },
];

export function getWork(slug: string) {
  return RECENT_WORK.find((w) => w.slug === slug);
}
