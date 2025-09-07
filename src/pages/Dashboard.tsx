import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Clock,
  DollarSign,
  Activity,
  AlertTriangle,
  Bell
} from "lucide-react";
import CryptoPriceCard from "@/components/CryptoPriceCard";
import PredictionChart from "@/components/PredictionChart";
import MarketOverview from "@/components/MarketOverview";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");

  // Mock data for favorites and watchlist
  const favoriteCoins = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 67234.56,
      change: 1234.67,
      changePercent: 1.87,
      marketCap: "$1.31T",
      volume: "$28.4B",
      icon: "₿"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 3456.78,
      change: -89.23,
      changePercent: -2.52,
      marketCap: "$415.6B",
      volume: "$15.2B",
      icon: "Ξ"
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: 234.56,
      change: 12.34,
      changePercent: 5.56,
      marketCap: "$107.8B",
      volume: "$3.1B",
      icon: "◎"
    }
  ];

  const allCoins = [
    ...favoriteCoins,
    {
      symbol: "ADA",
      name: "Cardano",
      price: 1.23,
      change: 0.08,
      changePercent: 6.96,
      marketCap: "$43.2B",
      volume: "$1.8B",
      icon: "₳"
    },
    {
      symbol: "DOT",
      name: "Polkadot",
      price: 45.67,
      change: 2.34,
      changePercent: 5.41,
      marketCap: "$56.8B",
      volume: "$2.1B",
      icon: "●"
    },
    {
      symbol: "MATIC",
      name: "Polygon",
      price: 2.34,
      change: -0.12,
      changePercent: -4.87,
      marketCap: "$23.4B",
      volume: "$1.2B",
      icon: "◆"
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "price",
      message: "BTC crossed $67,000 resistance level",
      time: "2 min ago",
      severity: "success"
    },
    {
      id: 2,
      type: "prediction",
      message: "LSTM model shows strong bullish signal for ETH",
      time: "15 min ago",
      severity: "info"
    },
    {
      id: 3,
      type: "warning",
      message: "High volatility detected in SOL",
      time: "1 hour ago",
      severity: "warning"
    }
  ];

  const portfolioStats = {
    totalValue: 125678.90,
    dayChange: 2345.67,
    dayChangePercent: 1.9,
    topPerformer: "SOL (+5.56%)",
    worstPerformer: "ETH (-2.52%)"
  };

  const filteredCoins = allCoins.filter(coin =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Trading Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor your portfolio and market predictions in real-time
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search cryptocurrencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-80 bg-input border-card-border"
              />
            </div>
            <Button className="bg-primary hover:bg-primary-dark crypto-glow">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Portfolio Overview</h2>
            <div className="flex space-x-2">
              {["1D", "1W", "1M", "3M", "1Y"].map((period) => (
                <Button
                  key={period}
                  variant={selectedTimeframe === period ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(period)}
                  className={selectedTimeframe === period ? "bg-primary" : ""}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-card-secondary/50 rounded-lg p-4 border border-card-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Value</span>
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                ${portfolioStats.totalValue.toLocaleString()}
              </div>
              <div className={`text-sm font-medium ${portfolioStats.dayChange >= 0 ? 'text-success' : 'text-danger'}`}>
                {portfolioStats.dayChange >= 0 ? '+' : ''}${portfolioStats.dayChange.toFixed(2)} ({portfolioStats.dayChangePercent}%)
              </div>
            </div>

            <div className="bg-card-secondary/50 rounded-lg p-4 border border-card-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">24h Change</span>
                <Activity className="w-4 h-4 text-success" />
              </div>
              <div className="text-2xl font-bold text-success">
                +{portfolioStats.dayChangePercent}%
              </div>
              <div className="text-sm text-muted-foreground">
                +${portfolioStats.dayChange.toFixed(2)}
              </div>
            </div>

            <div className="bg-card-secondary/50 rounded-lg p-4 border border-card-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Top Performer</span>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div className="text-lg font-bold text-success">
                {portfolioStats.topPerformer}
              </div>
            </div>

            <div className="bg-card-secondary/50 rounded-lg p-4 border border-card-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Worst Performer</span>
                <TrendingDown className="w-4 h-4 text-danger" />
              </div>
              <div className="text-lg font-bold text-danger">
                {portfolioStats.worstPerformer}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-card-secondary/30 border border-card-border">
                <div className={`p-2 rounded-lg ${
                  alert.severity === 'success' ? 'bg-success/10' :
                  alert.severity === 'warning' ? 'bg-danger/10' : 'bg-primary/10'
                }`}>
                  {alert.severity === 'success' ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : alert.severity === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-danger" />
                  ) : (
                    <BarChart3 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-medium">{alert.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card-secondary">
            <TabsTrigger value="favorites" className="data-[state=active]:bg-primary">
              <Star className="w-4 h-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="predictions" className="data-[state=active]:bg-primary">
              <BarChart3 className="w-4 h-4 mr-2" />
              Predictions
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-primary">
              <TrendingUp className="w-4 h-4 mr-2" />
              Market
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="data-[state=active]:bg-primary">
              <Activity className="w-4 h-4 mr-2" />
              Watchlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">Your Favorite Cryptocurrencies</h3>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {favoriteCoins.length} coins
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteCoins.map((crypto, index) => (
                <div key={crypto.symbol} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in">
                  <CryptoPriceCard {...crypto} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <PredictionChart />
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <MarketOverview />
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">All Cryptocurrencies</h3>
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                {filteredCoins.length} results
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoins.map((crypto, index) => (
                <div key={crypto.symbol} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in">
                  <CryptoPriceCard {...crypto} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;