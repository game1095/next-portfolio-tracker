import FundamentalsSnapshot from './FundamentalsSnapshot';
import CorrelationMatrix from './CorrelationMatrix';
import WealthGrowthChart from './WealthGrowthChart';
import TaxLossOpportunities from './TaxLossOpportunities';
import RebalanceReview from './RebalanceReview';
import DCAAnalyzer from './DCAAnalyzer';

export default function AnalyticsDashboard({ data, currency, deepData }) {
  if (!deepData) {
    return <div className="p-8 text-center text-sm text-text-muted animate-pulse">Loading Deep Analytics Engine...</div>;
  }

  return (
    <div className="space-y-6">
      <FundamentalsSnapshot summary={data?.summary} deepData={deepData} holdings={data?.holdings} />
      <WealthGrowthChart deepData={deepData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DCAAnalyzer holdings={data?.holdings} />
        <RebalanceReview holdings={data?.holdings} totalValue={data?.summary?.totalValue} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CorrelationMatrix matrix={deepData?.correlationMatrix} topSymbols={deepData?.topSymbols} />
        <TaxLossOpportunities data={data} currency={currency} />
      </div>
    </div>
  );
}
