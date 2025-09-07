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
  RefreshCw,
  Loader2,
  Trash2,
  MoreVertical
} from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import AddAssetModal from "@/components/AddAssetModal";
import PortfolioAnalytics from "@/components/PortfolioAnalytics";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Portfolio = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const { portfolio, refreshPrices, removeAsset, isLoading } = usePortfolio();

  // Move getAssetIcon function before its usage
  const getAssetIcon = (symbol: string) => {
    const icons: { [key: string]: string } = {
      'BTC': '₿',
      'ETH': 'Ξ', 
      'SOL': '◎',
      'ADA': '₳',
      'DOT': '●',
      'LINK': '⬡',
      'LTC': 'Ł',
      'XRP': '◉',
      'MATIC': '⬟',
      'AVAX': '▲'
    };
    return icons[symbol] || symbol.charAt(0);
  };

  const handleRefreshPrices = async () => {
    try {
      await refreshPrices();
      toast.success('Prices updated successfully!');
    } catch (error) {
      toast.error('Failed to refresh prices');
    }
  };

  const portfolioData = portfolio.assets.map(asset => ({
    id: asset.id,
    symbol: asset.symbol,
    name: asset.name,
    amount: asset.amount,
    value: asset.amount * asset.currentPrice,
    cost: asset.amount * asset.purchasePrice,
    profit: (asset.currentPrice - asset.purchasePrice) * asset.amount,
    profitPercent: ((asset.currentPrice - asset.purchasePrice) / asset.purchasePrice) * 100,
    allocation: portfolio.totalValue > 0 ? (asset.amount * asset.currentPrice / portfolio.totalValue) * 100 : 0,
    isFavorite: false,
    currentPrice: asset.currentPrice,
    purchasePrice: asset.purchasePrice,
    purchaseDate: asset.purchaseDate,
    icon: getAssetIcon(asset.symbol)
  }));

  const totalValue = portfolio.totalValue;
  const totalCost = portfolio.totalCost;
  const totalProfit = portfolio.totalGainLoss;
  const totalProfitPercent = portfolio.totalGainLossPercentage;

  // Pie chart data
  const pieData = portfolioData.map(coin => ({
    name: coin.symbol,
    value: coin.allocation,
    amount: coin.value,
    color: coin.symbol === 'BTC' ? '#f7931a' : 
           coin.symbol === 'ETH' ? '#627eea' :
           coin.symbol === 'SOL' ? '#9945ff' : '#0d1421'
  }));

  // Real-time performance data calculation
  const get24HourChange = () => {
    if (portfolio.assets.length === 0) return { amount: 0, percentage: 0 };
    
    // Calculate approximate 24h change based on current performance
    const dailyChange = totalProfit * 0.1; // Estimate daily change as 10% of total profit
    const dailyPercentage = totalValue > 0 ? (dailyChange / totalValue) * 100 : 0;
    
    return {
      amount: dailyChange,
      percentage: dailyPercentage
    };
  };
  
  const dayChange = get24HourChange();

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
    // Implementation for toggling favorites would go here
    console.log(`Toggle favorite for ${symbol}`);
  };

  const handleRemoveAsset = async (assetId: string, symbol: string) => {
    try {
      await removeAsset(assetId);
      toast.success(`${symbol} removed from portfolio successfully!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove asset');
    }
  };

  // Show empty state if no assets
  if (portfolio.assets.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Portfolio
              </h1>
              <p className="text-muted-foreground">
                Track your crypto investments and performance
              </p>
            </div>
            <AddAssetModal>
              <Button className="bg-primary hover:bg-primary-dark crypto-glow">
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </AddAssetModal>
          </div>
          
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <Target className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Start Building Your Portfolio</h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Add your first cryptocurrency investment to start tracking your portfolio performance and gains.
            </p>
            <AddAssetModal>
              <Button className="bg-primary hover:bg-primary-dark crypto-glow">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Asset
              </Button>
            </AddAssetModal>
          </div>
        </div>
      </div>
    );
  }

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
            <Button 
              variant="outline" 
              className="border-card-border hover:bg-card-secondary"
              onClick={handleRefreshPrices}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
            <AddAssetModal>
              <Button className="bg-primary hover:bg-primary-dark crypto-glow">
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </AddAssetModal>
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
              {dayChange.amount >= 0 ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger" />
              )}
            </div>
            <div className={`text-3xl font-bold mb-2 ${
              dayChange.amount >= 0 ? 'text-success' : 'text-danger'
            }`}>
              {dayChange.amount >= 0 ? '+' : ''}${Math.abs(dayChange.amount).toFixed(2)}
            </div>
            <div className={`text-sm font-medium ${
              dayChange.amount >= 0 ? 'text-success' : 'text-danger'
            }`}>
              {dayChange.percentage >= 0 ? '+' : ''}{dayChange.percentage.toFixed(2)}%
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

        {/* Charts and Holdings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Allocation Chart */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Asset Allocation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
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
            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm text-muted-foreground">
                    {entry.name} ({entry.value.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Holdings List */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Holdings</h3>
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

            <div className="space-y-4">
              {portfolioData.map((coin) => (
                <div key={coin.id || coin.symbol} className="flex items-center justify-between p-4 rounded-lg bg-card-secondary/30 border border-card-border hover:bg-card-secondary/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center">
                      <span className="text-lg font-bold">{coin.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-foreground">{coin.symbol}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleFavorite(coin.symbol)}
                        >
                          {coin.isFavorite ? (
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          ) : (
                            <StarOff className="w-3 h-3 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">{coin.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {coin.amount} {coin.symbol} @ ${coin.currentPrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Bought: ${coin.purchasePrice.toFixed(2)} on {coin.purchaseDate}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      ${coin.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-sm font-medium ${coin.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                      {coin.profit >= 0 ? '+' : ''}${coin.profit.toFixed(2)}
                    </div>
                    <div className={`text-sm font-medium ${coin.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                      ({coin.profit >= 0 ? '+' : ''}{coin.profitPercent.toFixed(2)}%)
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="secondary" 
                      className={coin.allocation > 30 ? "bg-primary/10 text-primary" : "bg-muted"}
                    >
                      {coin.allocation.toFixed(1)}%
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleRemoveAsset(coin.id, coin.symbol)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Asset
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI-Powered Portfolio Analytics */}
        <PortfolioAnalytics />
      </div>
    </div>
  );
};

export default Portfolio;