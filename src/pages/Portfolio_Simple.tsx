import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Percent,
  Target,
  Star,
  StarOff,
  Settings,
  Download,
  RefreshCw
} from "lucide-react";

const PortfolioSimple = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");

  // Mock portfolio data (same as original)
  const portfolioData = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      amount: 0.5,
      value: 33617.28,
      cost: 30000,
      profit: 3617.28,
      profitPercent: 12.06,
      allocation: 45.2,
      isFavorite: true,
      icon: "₿"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      amount: 8.2,
      value: 28345.60,
      cost: 25000,
      profit: 3345.60,
      profitPercent: 13.38,
      allocation: 38.1,
      isFavorite: true,
      icon: "Ξ"
    },
    {
      symbol: "SOL",
      name: "Solana",
      amount: 50,
      value: 11728.00,
      cost: 10000,
      profit: 1728.00,
      profitPercent: 17.28,
      allocation: 15.8,
      isFavorite: false,
      icon: "◎"
    },
    {
      symbol: "ADA",
      name: "Cardano",
      amount: 500,
      value: 615.00,
      cost: 700,
      profit: -85.00,
      profitPercent: -12.14,
      allocation: 0.9,
      isFavorite: false,
      icon: "₳"
    }
  ];

  const totalValue = portfolioData.reduce((sum, coin) => sum + coin.value, 0);
  const totalCost = portfolioData.reduce((sum, coin) => sum + coin.cost, 0);
  const totalProfit = totalValue - totalCost;
  const totalProfitPercent = (totalProfit / totalCost) * 100;

  // Pie chart data
  const pieData = portfolioData.map(coin => ({
    name: coin.symbol,
    value: coin.allocation,
    amount: coin.value,
    color: coin.symbol === 'BTC' ? '#f7931a' : 
           coin.symbol === 'ETH' ? '#627eea' :
           coin.symbol === 'SOL' ? '#9945ff' : '#0d1421'
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-4 border border-card-border">
          <p className="text-foreground font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value.toFixed(1)}% (${data.amount.toLocaleString()})
          </p>
        </div>
      );
    }
    return null;
  };

  const toggleFavorite = (symbol: string) => {
    console.log(`Toggle favorite for ${symbol}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Portfolio
            </h1>
            <p className="text-muted-foreground">
              Track your crypto investments and performance
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="border-card-border hover:bg-card-secondary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="border-card-border hover:bg-card-secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-primary hover:bg-primary-dark crypto-glow">
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className={`text-sm font-medium ${totalProfit >= 0 ? 'text-success' : 'text-danger'}`}>
              {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)} ({totalProfitPercent.toFixed(2)}%)
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Total Cost</span>
              <Target className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-muted-foreground">
              Initial investment
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">24h Change</span>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div className="text-3xl font-bold text-success mb-2">
              +$145.67
            </div>
            <div className="text-sm text-success font-medium">
              +0.20%
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Assets</span>
              <Percent className="w-4 h-4 text-accent" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {portfolioData.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Different coins
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Asset Allocation Chart */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">Asset Allocation</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-muted-foreground">
                      {item.name} ({item.value.toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Holdings List */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Holdings</h3>
                <div className="flex items-center space-x-2">
                  <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <TabsList className="bg-card-secondary">
                      <TabsTrigger value="1D" className="data-[state=active]:bg-primary">1D</TabsTrigger>
                      <TabsTrigger value="1W" className="data-[state=active]:bg-primary">1W</TabsTrigger>
                      <TabsTrigger value="1M" className="data-[state=active]:bg-primary">1M</TabsTrigger>
                      <TabsTrigger value="3M" className="data-[state=active]:bg-primary">3M</TabsTrigger>
                      <TabsTrigger value="1Y" className="data-[state=active]:bg-primary">1Y</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="space-y-4">
                {portfolioData.map((coin, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-card-border hover:bg-card-secondary/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg">{coin.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-foreground">{coin.symbol}</span>
                            <Badge variant="outline" className="text-xs">
                              {coin.allocation.toFixed(1)}%
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => toggleFavorite(coin.symbol)}
                            >
                              {coin.isFavorite ? 
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> :
                                <StarOff className="w-4 h-4 text-muted-foreground" />
                              }
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{coin.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium text-foreground">
                        ${coin.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {coin.amount} {coin.symbol}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-medium ${coin.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                        {coin.profit >= 0 ? '+' : ''}${Math.abs(coin.profit).toFixed(2)}
                      </div>
                      <div className={`text-sm ${coin.profitPercent >= 0 ? 'text-success' : 'text-danger'}`}>
                        {coin.profitPercent >= 0 ? '+' : ''}{coin.profitPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSimple;
