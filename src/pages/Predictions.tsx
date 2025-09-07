import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Brain,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  Loader2,
  RefreshCw
} from "lucide-react";
import mlService, { MLPrediction, ModelStatus } from "@/services/mlService";
import { useToast } from "@/hooks/use-toast";

const Predictions = () => {
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  const [selectedModel, setSelectedModel] = useState("all");
  const [timeframe, setTimeframe] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [currentPrediction, setCurrentPrediction] = useState<MLPrediction | null>(null);
  // Derived chart data; no local state needed
  const { toast } = useToast();

  // Check backend availability and load model status on component mount
  useEffect(() => {
    checkBackendAvailability();
  }, []);

  // Check if ML backend is available
  const checkBackendAvailability = async () => {
    try {
      const isAvailable = await mlService.isBackendAvailable();
      setIsBackendAvailable(isAvailable);
      
      if (isAvailable) {
        await loadModelStatus();
      }
    } catch (error) {
      console.error('Backend not available:', error);
      setIsBackendAvailable(false);
    }
  };

  // Load model status
  const loadModelStatus = async () => {
    try {
      const status = await mlService.getModelStatus();
      setModelStatus(status);
    } catch (error) {
      console.error('Failed to load model status:', error);
    }
  };

  // Generate prediction data
  const generatePredictionData = () => {
    if (currentPrediction) {
      return mlService.formatPredictionsForChart(currentPrediction, 30);
    }
    
    // Fallback to mock data if no real prediction
    const data = [];
    const startDate = new Date();
    const basePrice = selectedCoin === "BTC" ? 65000 : selectedCoin === "ETH" ? 3400 : 230;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const trend = Math.sin(i * 0.1) * 0.02;
      const noise = (Math.random() - 0.5) * 0.03;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        actual: i < 15 ? basePrice * (1 + trend + noise) : null,
        lstm: basePrice * (1 + trend * 1.2 + noise * 0.5),
        randomForest: basePrice * (1 + trend * 0.9 + noise * 0.7),
        linearReg: basePrice * (1 + trend * 0.8 + noise * 0.8),
        confidence: Math.max(75, 95 - Math.abs(trend) * 100)
      });
    }
    
    return data;
  };

  // Get prediction data
  const chartData = useMemo(() => generatePredictionData(), [currentPrediction, selectedCoin]);

  const modelAccuracy = {
    lstm: { 
      accuracy: modelStatus?.lstm.accuracy || 94.2, 
      trend: "up", 
      change: "+1.2%",
      loaded: modelStatus?.lstm.loaded || false
    },
    randomForest: { 
      accuracy: modelStatus?.random_forest.accuracy || 91.8, 
      trend: "up", 
      change: "+0.8%",
      loaded: modelStatus?.random_forest.loaded || false
    },
    linearReg: { 
      accuracy: modelStatus?.linear_regression.accuracy || 87.5, 
      trend: "down", 
      change: "-0.3%",
      loaded: modelStatus?.linear_regression.loaded || false
    }
  };

  const cryptoOptions = [
    { value: "BTC", label: "Bitcoin (BTC)", icon: "₿" },
    { value: "ETH", label: "Ethereum (ETH)", icon: "Ξ" },
    { value: "SOL", label: "Solana (SOL)", icon: "◎" },
    { value: "ADA", label: "Cardano (ADA)", icon: "₳" },
    { value: "DOT", label: "Polkadot (DOT)", icon: "●" },
    { value: "LINK", label: "Chainlink (LINK)", icon: "🔗" },
    { value: "MATIC", label: "Polygon (MATIC)", icon: "◊" },
    { value: "AVAX", label: "Avalanche (AVAX)", icon: "❄" }
  ];

  const predictions = [
    {
      coin: "BTC",
      model: "LSTM",
      prediction: "Bullish",
      targetPrice: 72500,
      confidence: 94.2,
      timeframe: "7 days",
      reasoning: "Strong momentum indicators and volume analysis suggest upward movement",
      status: "active"
    },
    {
      coin: "ETH",
      model: "Random Forest",
      prediction: "Bearish",
      targetPrice: 3200,
      confidence: 87.8,
      timeframe: "3 days",
      reasoning: "Technical indicators show potential correction due to overbought conditions",
      status: "active"
    },
    {
      coin: "SOL",
      model: "LSTM",
      prediction: "Bullish",
      targetPrice: 260,
      confidence: 91.5,
      timeframe: "5 days",
      reasoning: "Network activity and developer metrics indicate positive sentiment",
      status: "completed"
    }
  ];

  // Get real predictions from ML backend
  const getRealPredictions = async () => {
    if (!isBackendAvailable) {
      toast({
        title: "ML Backend Unavailable",
        description: "Please ensure the ML backend is running on port 5000",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const timeframeDays = parseInt(timeframe.replace('d', ''));
      const prediction = await mlService.getPrediction(selectedCoin, timeframeDays);
      setCurrentPrediction(prediction);
      
      toast({
        title: "Predictions Generated",
        description: `Successfully generated predictions for ${selectedCoin} using AI models`,
      });
    } catch (error) {
      console.error('Failed to get predictions:', error);
      toast({
        title: "Prediction Failed",
        description: "Failed to generate predictions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 border border-card-border">
          <p className="text-foreground font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> ${Number(entry.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Backend Status */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-card-border bg-card/50">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isBackendAvailable ? 'bg-success' : 'bg-destructive'}`}></div>
            <span className="text-sm font-medium">
              ML Backend: {isBackendAvailable ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>LSTM: {modelAccuracy.lstm.loaded ? '✓' : '✗'}</span>
              <span>Random Forest: {modelAccuracy.randomForest.loaded ? '✓' : '✗'}</span>
              <span>Linear Regression: {modelAccuracy.linearReg.loaded ? '✓' : '✗'}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkBackendAvailability}
              className="ml-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              AI Predictions
            </h1>
            <p className="text-muted-foreground">
              Advanced machine learning models for cryptocurrency price forecasting
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger className="w-full sm:w-48 bg-input border-card-border">
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent className="bg-card border-card-border">
                {cryptoOptions.map((crypto) => (
                  <SelectItem key={crypto.value} value={crypto.value}>
                    <div className="flex items-center space-x-2">
                      <span>{crypto.icon}</span>
                      <span>{crypto.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-full sm:w-32 bg-input border-card-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-card-border">
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={getRealPredictions}
              disabled={!isBackendAvailable || isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Generating..." : "Get Predictions"}
            </Button>
          </div>
        </div>

        {/* Model Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card border-card-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">LSTM Neural Network</CardTitle>
              <Brain className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{modelAccuracy.lstm.accuracy}%</div>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`flex items-center space-x-1 ${modelAccuracy.lstm.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                  {modelAccuracy.lstm.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span className="text-sm font-medium">{modelAccuracy.lstm.change}</span>
                </div>
                <span className="text-sm text-muted-foreground">accuracy</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-card-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Random Forest</CardTitle>
              <Activity className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{modelAccuracy.randomForest.accuracy}%</div>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`flex items-center space-x-1 ${modelAccuracy.randomForest.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                  {modelAccuracy.randomForest.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span className="text-sm font-medium">{modelAccuracy.randomForest.change}</span>
                </div>
                <span className="text-sm text-muted-foreground">accuracy</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-card-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Linear Regression</CardTitle>
              <BarChart3 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{modelAccuracy.linearReg.accuracy}%</div>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`flex items-center space-x-1 ${modelAccuracy.linearReg.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                  {modelAccuracy.linearReg.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span className="text-sm font-medium">{modelAccuracy.linearReg.change}</span>
                </div>
                <span className="text-sm text-muted-foreground">accuracy</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart */}
        <div className="glass-card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {cryptoOptions.find(c => c.value === selectedCoin)?.label} Price Predictions
              </h3>
              <p className="text-muted-foreground">AI model predictions vs actual price movement</p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={selectedModel === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedModel("all")}
                className={selectedModel === "all" ? "bg-primary" : ""}
              >
                All Models
              </Button>
              <Button
                variant={selectedModel === "lstm" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedModel("lstm")}
                className={selectedModel === "lstm" ? "bg-primary" : ""}
              >
                LSTM
              </Button>
              <Button
                variant={selectedModel === "rf" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedModel("rf")}
                className={selectedModel === "rf" ? "bg-primary" : ""}
              >
                Random Forest
              </Button>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--card-border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `$${value.toLocaleString('en-US', { notation: 'compact' })}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                {/* Actual price */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--foreground))"
                  strokeWidth={3}
                  dot={false}
                  connectNulls={false}
                  name="Actual Price"
                />

                {/* Model predictions */}
                {(selectedModel === "all" || selectedModel === "lstm") && (
                  <Line
                    type="monotone"
                    dataKey="lstm"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="LSTM Prediction"
                  />
                )}

                {(selectedModel === "all" || selectedModel === "rf") && (
                  <Line
                    type="monotone"
                    dataKey="randomForest"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    strokeDasharray="10 5"
                    dot={false}
                    name="Random Forest"
                  />
                )}

                {selectedModel === "all" && (
                  <Line
                    type="monotone"
                    dataKey="linearReg"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    strokeDasharray="15 5"
                    dot={false}
                    name="Linear Regression"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Predictions */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-foreground mb-6">Active Predictions</h3>
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div key={index} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-lg bg-card-secondary/30 border border-card-border hover:bg-card-secondary/50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center">
                    <span className="text-lg font-bold">
                      {cryptoOptions.find(c => c.value === prediction.coin)?.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold text-foreground">{prediction.coin}</span>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {prediction.model}
                      </Badge>
                      <Badge 
                        variant={prediction.prediction === "Bullish" ? "default" : "destructive"}
                        className={prediction.prediction === "Bullish" ? "bg-success/10 text-success border-success/20" : "bg-danger/10 text-danger border-danger/20"}
                      >
                        {prediction.prediction}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{prediction.reasoning}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Target className="w-3 h-3" />
                        <span>Target: ${prediction.targetPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{prediction.timeframe}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Confidence</div>
                    <div className="text-lg font-bold text-foreground">{prediction.confidence}%</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {prediction.status === "active" ? (
                      <div className="flex items-center space-x-1 text-primary">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm font-medium">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-success">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;