# Functional Specification: US Stock Portfolio Tracker

## Overview

This document outlines the functional requirements for a custom-built, dark-themed US Stock Portfolio Tracker. The application is designed to go beyond basic tracking by providing advanced analytics, currency impact evaluation, performance benchmarking, multi-portfolio management, and personalized news aggregation.

## 1. Core Architecture & Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** MongoDB (via Mongoose for schema validation)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Market Data API:** `yahoo-finance2` (Server-side fetching for prices and news)

---

## 2. Core Modules

### 2.1 Dashboard & Portfolio Summary

The dashboard acts as the central command center, prioritizing portfolio health and actionable insights immediately upon loading.

- **Hero Chart (Cost Basis vs. Market Value):** A dual-layer stacked area chart. The solid area represents cumulative invested capital (Cost Basis), while the overlaying line represents the fluctuating Market Value. The visual gap highlights the compounding growth over time.
- **Total Portfolio Value & P/L:** Calculates the real-time value of all holdings. Displays aggregate gains/losses in both absolute amounts (USD) and percentages (%).
- **Live USD/THB Ticker & FX Impact Summary:** Displays a real-time USD/THB exchange rate ticker. Includes a sub-metric under the Total P/L indicating the exact currency impact (e.g., "FX Impact: -1.2%").
- **Monthly DCA Goal Tracker:** A progress bar tracking the user's monthly investment target to maintain discipline (e.g., "Monthly Goal: $1,000 / Invested: $750 (75%)").
- **Smart Alerts ("Action Required"):** A dedicated insights feed alerting the user to manual actions to consider. Examples include:
  - _"Technology sector exceeds 40% of the portfolio — review for rebalancing."_
  - _"AAPL goes Ex-Dividend in 3 days."_
  - _"Tax-Loss Harvesting Opportunity: TSLA is down > 15%."_
- **Top Movers (Daily Gainers & Losers):** Quick-glance mini cards showing the top 3 best and worst-performing assets of the day, including their daily percentage change.
- **Visual Semantics:** Automatically applies Trading Up (Green) and Trading Down (Red) colors to all performance metrics.

### 2.2 Holdings Table (Asset List)

- **Aggregation:** Groups individual transactions into consolidated asset rows.
- **Standard Columns:** - Ticker Symbol
  - Total Shares
  - Average Cost
  - Current Price
  - Total Value
  - Unrealized P/L (USD & %)
- **Interactivity:** Supports column sorting (e.g., highest value, top gainers, alphabetical).

### 2.3 Transaction Management (Manual Entry)

- **Add Transaction:** A modal form accepting `Symbol`, `Shares`, `Buy Price`, and `Trade Date`.
- **Edit/Delete:** Full CRUD capabilities for historical trades to correct data entry errors.
- **History View:** A dedicated chronological log of all past transactions.

### 2.4 Multi-Portfolio Management (Sub-Portfolios)

- **Function:** Allows the user to categorize investments into distinct buckets or strategies (e.g., "Long-term DCA", "Dividend Focus", "Trading/Speculative").
- **Mechanism:** Introduces a Portfolio entity. Every transaction is tagged to a specific sub-portfolio.
- **Display:** A top-level dropdown or tab navigation system on the Dashboard. Users can view the aggregate **"Global Portfolio"** (all accounts combined) or drill down into specific sub-portfolios. All dashboard metrics, tables, and advanced analytics dynamically filter based on the actively selected portfolio.

### 2.5 Personalized Portfolio News Feed

- **Function:** Aggregates and displays the latest financial news tailored specifically to the assets currently held in the user's portfolio, filtering out irrelevant market noise.
- **Mechanism:** Dynamically extracts a list of unique ticker symbols from the user's active holdings. Fetches recent news articles tagged with these specific symbols via the `yahoo-finance2` API (or supplementary news APIs).
- **Display:** A dedicated "News" tab or page featuring a chronologically sorted feed of article cards. Each card displays the headline, source/publisher, publication timestamp, and a highlighted ticker tag (e.g., `[AAPL]`) with a direct external link to read the full article.

---

## 3. "Pro" Analytics Engine

### 3.1 Currency Impact & FX P/L (USD/THB)

- **Function:** Separates stock performance from currency fluctuation.
- **Mechanism:** Records the USD/THB exchange rate on the `Trade Date` and compares it against the live exchange rate.
- **UI Toggle:** Allows the user to switch the Holdings Table and Dashboard between "USD View" (pure stock performance) and "THB View" (realized purchasing power).

### 3.2 Performance Benchmarking

- **Function:** Measures portfolio efficiency against the broader market.
- **Mechanism:** Simulates buying a benchmark index (e.g., S&P 500 ETFs like IVV) on the exact same dates and amounts as the user's actual transactions.
- **Display:** Shows a side-by-side metric on the dashboard: `Your Portfolio: +12.5% | Benchmark (IVV): +10.2%`.

### 3.3 Dividend Tracking & Yield on Cost

- **Function:** Accounts for dividend payouts to calculate the true Total Return.
- **Mechanism:** Fetches Ex-Dividend dates and historical payouts via the Yahoo Finance API.
- **Metrics:** - **Total Dividends Collected:** Aggregate cash generated.
  - **Yield on Cost (YOC):** Calculates the current annual dividend divided by the user's _Average Cost_ (rather than current price) to highlight the value of long-term holding.

### 3.4 Sector Allocation Heatmap

- **Function:** Visualizes portfolio concentration and risk.
- **Mechanism:** Maps each ticker to its GICS Sector (Technology, Healthcare, Financials, etc.).
- **Display:** An interactive Treemap (block chart). Block size represents the `Total Value` of the allocation, and the block color intensity (bright green to deep red) represents the `P/L` performance of that sector.

---

## 4. API & Database Flow

### 4.1 Server-Side Data Fetching

- To bypass strict client-side rate limits and CORS issues, all requests to `yahoo-finance2` must be executed within Next.js Server Components or Server Actions.
- Fetched data includes: Live Price, Previous Close, Sector, Dividend Yield, and Asset News.

### 4.2 MongoDB Schema Constraints

- **Portfolios Collection:** Stores metadata for user-created buckets (e.g., `_id`, `Name`, `Description`, `TargetStrategy`).
- **Transactions Collection:** Must strictly enforce data types (e.g., `Shares` and `BuyPrice` as Numbers, `Symbol` as uppercase Strings). Must include a `portfolioId` referencing the Portfolios collection to link each trade to its specific bucket.
- Average costs and portfolio aggregation are computed dynamically via MongoDB Aggregation Pipelines or server-side array reductions before reaching the client.

---

## 5. UI/UX & State Management

### 5.1 Asynchronous States

- **Loading:** Utilizes Skeleton Loaders (`animate-pulse`) mirroring the table structure during data hydration.
- **Empty State:** A dedicated prompt encouraging the user to "+ Add First Transaction" if the database returns 0 documents.
- **Error Handling:** Graceful fallbacks and toast notifications for invalid tickers or API timeouts.

### 5.2 Responsive Behavior

- **Desktop (1024px+):** Full 12-column grid, exposing all advanced columns in the Holdings Table.
- **Tablet/Mobile (< 1024px):** - Holdings table transitions to a horizontal scroll `overflow-x-auto`.
  - Sector Heatmap adjusts block proportions for vertical screens.
  - The "Add Transaction" modal expands to a full-screen mobile view for easier numerical input.

## 6. Advanced Analytics & Forecasting (Pro Features)

### 6.1 DCA (Dollar Cost Averaging) Efficiency Analyzer

- **Function:** Evaluates the effectiveness of the user's DCA strategy over time.
- **Mechanism:** Compares the user's actual `Average Cost` against a simulated "Strict Monthly DCA" and a "Lump Sum" scenario started on the date of their first transaction.
- **Display:** A comparative chart showing which strategy would have yielded the best cost basis for each specific holding (e.g., IVV or individual stocks).

### 6.2 Logarithmic Trend Forecasting

- **Function:** Projects potential future portfolio value based on historical growth data.
- **Mechanism:** Applies logarithmic regression models to past performance data to draw a realistic, non-linear growth curve for the next 1-5 years.
- **Display:** A line chart overlaying actual historical portfolio value with a dashed logarithmic projection line, providing a realistic expectation of long-term wealth accumulation.

### 6.3 Manual Rebalancing Target Review

- **Function:** Assists in portfolio rebalancing without automating the trades, leaving the final review and decision to the user.
- **Mechanism:** The user sets a target allocation percentage for each asset or sector (e.g., 40% IVV, 20% AAPL). The system calculates the exact cash amount or number of shares required to buy/sell to reach that target based on live prices.
- **Display:** A "Rebalance Dashboard" highlighting the gaps (underweight/overweight) with actionable numerical data for manual execution.

### 6.4 Max Drawdown & Risk Assessment

- **Function:** Measures the historical risk and worst-case scenario of the current portfolio.
- **Mechanism:** Calculates the "Max Drawdown" (the largest peak-to-trough drop in value) of the user's exact asset mix over the past 1-3 years using historical Yahoo Finance data.
- **Display:** A risk metric card showing "Max Drawdown: -22.5%" to help the user manually assess if their current allocation aligns with their risk tolerance.

### 6.5 Portfolio Beta (Volatility Index)

- **Function:** Determines how volatile the portfolio is compared to the broader market.
- **Mechanism:** Fetches the Beta value of each individual stock and calculates the weighted average Portfolio Beta against the S&P 500 (Beta = 1.0).
- **Display:** An indicator gauge (e.g., Portfolio Beta = 1.15 means the portfolio is 15% more volatile than the market).

### 6.6 Cost Basis vs. Market Value Divergence (Area Chart)

- **Function:** Visualizes the accumulation of wealth and compounding growth over time.
- **Mechanism:** Tracks the total cumulative invested capital (Cost Basis) layer against the fluctuating total Market Value layer.
- **Display:** A stacked area chart. The widening gap between the two lines visually represents unrealized gains compounding over the months and years.

### 6.7 Win/Loss Ratio & Trade Accuracy (Realized P/L)

- **Function:** Analyzes the user's past decision-making success on closed positions.
- **Mechanism:** Filters transactions where shares were completely sold off and calculates the percentage of trades that ended in profit versus loss.
- **Display:** A historical performance summary (e.g., "Win Rate: 68% | Avg Gain: +15% | Avg Loss: -5%").

### 6.8 Asset Correlation Matrix

- **Function:** Identifies overlapping risks by checking if holdings move in the exact same direction.
- **Mechanism:** Analyzes the daily price movements of the top 5-10 holdings against each other.
- **Display:** A visual matrix grid (Red to Green). If two stocks have a 0.95 correlation, it alerts the user that a drop in one will likely drag down the other, prompting a manual review of diversification.

### 6.9 Fundamental Health Snapshot

- **Function:** Provides a quick valuation check of the overall portfolio without leaving the app.
- **Mechanism:** Pulls basic fundamental data (P/E Ratio, EPS, Market Cap) for individual stocks via the API and calculates a weighted average P/E for the portfolio.
- **Display:** A metric block showing if the portfolio leans toward "Value" (Low P/E) or "Growth" (High P/E) based on current market data.

### 6.10 Tax-Loss Harvesting Opportunities

- **Function:** Highlights strategic opportunities to offset capital gains.
- **Mechanism:** Scans the portfolio for individual tax lots (specific manual entries) that are significantly underwater (e.g., > 15% loss).
- **Display:** A dedicated "Opportunities" list presenting the losing positions and the exact amount of potential capital loss that could be realized, giving the user the data needed to make a manual tax-planning decision.
