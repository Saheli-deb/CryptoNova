import { TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";

interface CryptoPriceCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  volume: string;
  icon: string;
}

const CryptoPriceCard = ({ 
  symbol, 
  name, 
  price, 
  change, 
  changePercent, 
  marketCap, 
  volume, 
  icon 
}: CryptoPriceCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const isPositive = change >= 0;

  useEffect(() => {
    // Simulate price updates
    const interval = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => setIsUpdating(false), 600);
    }, Math.random() * 10000 + 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`glass-card hover-lift cursor-pointer group ${isUpdating ? 'animate-price-update' : ''}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-card-secondary flex items-center justify-center">
              <span className="text-lg font-bold">{icon}</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{symbol}</h3>
              <p className="text-sm text-muted-foreground">{name}</p>
            </div>
          </div>
          <div className={`p-2 rounded-lg ${isPositive ? 'bg-success/10' : 'bg-danger/10'}`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-danger" />
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-foreground mb-1">
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)}
            </span>
            <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
              ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Market Cap:</span>
            <span className="text-foreground font-medium">{marketCap}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">24h Volume:</span>
            <span className="text-foreground font-medium">{volume}</span>
          </div>
        </div>

        {/* Prediction Indicator */}
        <div className="mt-4 pt-4 border-t border-card-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">AI Prediction</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-success animate-pulse-glow' : 'bg-danger animate-pulse-glow'}`}></div>
              <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
                {isPositive ? 'Bullish' : 'Bearish'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPriceCard;