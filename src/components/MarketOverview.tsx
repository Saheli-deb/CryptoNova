import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

const MarketOverview = () => {
  const marketData = [
    {
      label: "Total Market Cap",
      value: "$2.34T",
      change: "+2.45%",
      isPositive: true,
      icon: DollarSign,
    },
    {
      label: "24h Volume",
      value: "$89.2B",
      change: "-1.23%",
      isPositive: false,
      icon: Activity,
    },
    {
      label: "Bitcoin Dominance",
      value: "52.4%",
      change: "+0.8%",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      label: "Active Cryptocurrencies",
      value: "13,247",
      change: "+124",
      isPositive: true,
      icon: Activity,
    },
  ];

  const topMovers = [
    { symbol: "SOL", name: "Solana", change: 15.2, price: 234.56 },
    { symbol: "ADA", name: "Cardano", change: 12.8, price: 1.23 },
    { symbol: "DOT", name: "Polkadot", change: 9.4, price: 45.67 },
    { symbol: "MATIC", name: "Polygon", change: -8.2, price: 2.34 },
    { symbol: "LINK", name: "Chainlink", change: -5.7, price: 23.45 },
  ];

  return (
    <div className="space-y-6">
      {/* Market Stats */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-foreground mb-6">Market Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-card-secondary/50 rounded-lg p-4 border border-card-border hover-lift">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-card">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className={`text-sm font-medium ${item.isPositive ? 'text-success' : 'text-danger'}`}>
                    {item.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{item.value}</div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Movers */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Top Movers (24h)</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-success/10 text-success rounded-lg border border-success/20">
              Gainers
            </button>
            <button className="px-3 py-1 text-sm text-muted-foreground rounded-lg hover:bg-card-secondary">
              Losers
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {topMovers.map((coin, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card-secondary/30 border border-card-border hover:bg-card-secondary/50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center">
                  <span className="text-sm font-bold">{coin.symbol.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-medium text-foreground">{coin.symbol}</div>
                  <div className="text-sm text-muted-foreground">{coin.name}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-foreground">${coin.price}</div>
                <div className={`text-sm font-medium flex items-center ${coin.change >= 0 ? 'text-success' : 'text-danger'}`}>
                  {coin.change >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;