import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Zap, Shield, BarChart3 } from "lucide-react";
import CryptoPriceCard from "@/components/CryptoPriceCard";
import PredictionChart from "@/components/PredictionChart";
import MarketOverview from "@/components/MarketOverview";
import heroImage from "@/assets/crypto-hero.jpg";

const Index = () => {
  // Mock cryptocurrency data
  const cryptoData = [
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
    },
    {
      symbol: "ADA",
      name: "Cardano",
      price: 1.23,
      change: 0.08,
      changePercent: 6.96,
      marketCap: "$43.2B",
      volume: "$1.8B",
      icon: "₳"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">CryptoNova</span>
              <br />
              <span className="text-foreground">AI-Powered Predictions</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Harness the power of advanced machine learning models to predict cryptocurrency prices with unprecedented accuracy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="bg-primary hover:bg-primary-dark crypto-glow px-8 py-4 text-lg">
                Start Predicting
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-card-border hover:bg-card-secondary px-8 py-4 text-lg">
                View Demo
                <BarChart3 className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI Predictions</h3>
                <p className="text-sm text-muted-foreground">Advanced LSTM, Random Forest, and Linear Regression models</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Real-time Data</h3>
                <p className="text-sm text-muted-foreground">Live market data and instant price updates</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Secure & Reliable</h3>
                <p className="text-sm text-muted-foreground">Enterprise-grade security and 99.9% uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-16 bg-background-secondary/50">
        <div className="container mx-auto px-4">
          <MarketOverview />
        </div>
      </section>

      {/* Live Prices */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Live Cryptocurrency Prices
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track real-time prices and AI-powered predictions for top cryptocurrencies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {cryptoData.map((crypto, index) => (
              <div key={crypto.symbol} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in">
                <CryptoPriceCard {...crypto} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prediction Chart */}
      <section className="py-16 bg-background-secondary/30">
        <div className="container mx-auto px-4 animate-slide-up">
          <PredictionChart />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to Start Predicting?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of traders using AI to make smarter investment decisions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary-dark crypto-glow px-8 py-4 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-card-border hover:bg-card-secondary px-8 py-4 text-lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
