import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PredictionData {
  symbol: string;
  predictions: {
    lstm: number;
    linear_regression: number;
    random_forest: number;
  };
  confidences: {
    lstm: number;
    linear_regression: number;
    random_forest: number;
  };
  future_predictions: Array<{
    date: string;
    predicted_price: number;
    confidence: number;
  }>;
}

interface PortfolioAnalyticsProps {
  className?: string;
}

const PortfolioAnalytics: React.FC<PortfolioAnalyticsProps> = ({ className }) => {
  const { portfolio } = usePortfolio();
  const [predictions, setPredictions] = useState<{ [key: string]: PredictionData }>({});
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(7); // Default to 7 days

  // Fetch ML predictions for all assets
  const fetchPredictions = async (timeframe?: number) => {
    if (portfolio.assets.length === 0) return;
    
    const predictionTimeframe = timeframe || selectedTimeframe;
    setIsLoadingPredictions(true);
    try {
      const predictionPromises = portfolio.assets.map(async (asset) => {
        try {
          // Map symbol to correct API format
          const symbolMap: { [key: string]: string } = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'ADA': 'cardano',
            'SOL': 'solana',
            'DOT': 'polkadot',
            'LINK': 'chainlink',
            'LTC': 'litecoin',
            'XRP': 'ripple',
            'MATIC': 'matic-network',
            'AVAX': 'avalanche-2'
          };
          
          const apiSymbol = symbolMap[asset.symbol] || asset.symbol.toLowerCase();
          
          const response = await fetch('http://localhost:5000/api/predict', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              symbol: apiSymbol,
              timeframe: predictionTimeframe
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch predictions for ${asset.symbol}`);
          }

          const data = await response.json();
          return { symbol: asset.symbol, data };
        } catch (error) {
          console.error(`Error predicting ${asset.symbol}:`, error);
          return { symbol: asset.symbol, data: null };
        }
      });

      const results = await Promise.all(predictionPromises);
      const newPredictions: { [key: string]: PredictionData } = {};
      
      results.forEach(({ symbol, data }) => {
        if (data) {
          newPredictions[symbol] = data;
        }
      });

      setPredictions(newPredictions);
      generatePortfolioReport(newPredictions);
      toast.success(`Portfolio predictions updated for ${predictionTimeframe} days!`);
    } catch (error) {
      toast.error('Failed to fetch predictions');
      console.error('Prediction error:', error);
    } finally {
      setIsLoadingPredictions(false);
    }
  };

  // Handle timeframe change
  const handleTimeframeChange = async (timeframeDays: number) => {
    setSelectedTimeframe(timeframeDays);
    await fetchPredictions(timeframeDays);
    toast.info(`Switching to ${timeframeDays}-day predictions...`);
  };

  // Generate comprehensive portfolio report
  const generatePortfolioReport = (predictionData: { [key: string]: PredictionData }) => {
    const report = {
      totalAssets: portfolio.assets.length,
      totalValue: portfolio.totalValue,
      totalCost: portfolio.totalCost,
      totalGainLoss: portfolio.totalGainLoss,
      totalGainLossPercentage: portfolio.totalGainLossPercentage,
      riskLevel: calculateRiskLevel(),
      diversificationScore: calculateDiversificationScore(),
      predictedValue: calculatePredictedPortfolioValue(predictionData),
      topPerformer: getTopPerformer(),
      recommendations: generateRecommendations(predictionData),
      assetAnalysis: portfolio.assets.map(asset => ({
        ...asset,
        performance: calculateAssetPerformance(asset),
        risk: calculateAssetRisk(asset),
        prediction: predictionData[asset.symbol] || null
      }))
    };

    setReportData(report);
  };

  const calculateRiskLevel = () => {
    if (portfolio.assets.length === 0) return 'Low';
    
    const volatility = portfolio.assets.reduce((sum, asset) => {
      const priceChange = Math.abs((asset.currentPrice - asset.purchasePrice) / asset.purchasePrice);
      return sum + priceChange;
    }, 0) / portfolio.assets.length;

    if (volatility > 0.5) return 'High';
    if (volatility > 0.2) return 'Medium';
    return 'Low';
  };

  const calculateDiversificationScore = () => {
    if (portfolio.assets.length <= 1) return 25;
    if (portfolio.assets.length <= 3) return 50;
    if (portfolio.assets.length <= 5) return 75;
    return 90;
  };

  const calculatePredictedPortfolioValue = (predictionData: { [key: string]: PredictionData }) => {
    return portfolio.assets.reduce((total, asset) => {
      const prediction = predictionData[asset.symbol];
      if (prediction) {
        const avgPrediction = (
          (prediction.predictions.lstm || asset.currentPrice) +
          (prediction.predictions.random_forest || asset.currentPrice) +
          (prediction.predictions.linear_regression || asset.currentPrice)
        ) / 3;
        return total + (asset.amount * avgPrediction);
      }
      return total + (asset.amount * asset.currentPrice);
    }, 0);
  };

  const getTopPerformer = () => {
    if (portfolio.assets.length === 0) return null;
    
    return portfolio.assets.reduce((best, asset) => {
      const performance = ((asset.currentPrice - asset.purchasePrice) / asset.purchasePrice) * 100;
      const bestPerformance = best ? ((best.currentPrice - best.purchasePrice) / best.purchasePrice) * 100 : -Infinity;
      return performance > bestPerformance ? asset : best;
    });
  };

  const calculateAssetPerformance = (asset: any) => {
    const performance = ((asset.currentPrice - asset.purchasePrice) / asset.purchasePrice) * 100;
    return {
      percentage: performance,
      status: performance > 10 ? 'excellent' : performance > 0 ? 'good' : performance > -10 ? 'fair' : 'poor'
    };
  };

  const calculateAssetRisk = (asset: any) => {
    const priceVolatility = Math.abs((asset.currentPrice - asset.purchasePrice) / asset.purchasePrice);
    if (priceVolatility > 0.5) return 'High';
    if (priceVolatility > 0.2) return 'Medium';
    return 'Low';
  };

  const generateRecommendations = (predictionData: { [key: string]: PredictionData }) => {
    const recommendations = [];
    
    if (portfolio.assets.length < 3) {
      recommendations.push({
        type: 'diversification',
        message: 'Consider diversifying your portfolio with more assets to reduce risk.',
        priority: 'high'
      });
    }

    const totalValue = portfolio.totalValue;
    const dominantAsset = portfolio.assets.find(asset => 
      (asset.amount * asset.currentPrice / totalValue) > 0.6
    );

    if (dominantAsset) {
      recommendations.push({
        type: 'concentration',
        message: `${dominantAsset.symbol} makes up over 60% of your portfolio. Consider rebalancing.`,
        priority: 'medium'
      });
    }

    // ML-based recommendations
    Object.entries(predictionData).forEach(([symbol, prediction]) => {
      const asset = portfolio.assets.find(a => a.symbol === symbol);
      if (asset && prediction.future_predictions.length > 0) {
        const futurePrice = prediction.future_predictions[prediction.future_predictions.length - 1].predicted_price;
        const currentPrice = asset.currentPrice;
        const predictedChange = (futurePrice - currentPrice) / currentPrice * 100;

        if (predictedChange > 20) {
          recommendations.push({
            type: 'opportunity',
            message: `${symbol} is predicted to increase by ${predictedChange.toFixed(1)}% - consider holding.`,
            priority: 'high'
          });
        } else if (predictedChange < -15) {
          recommendations.push({
            type: 'warning',
            message: `${symbol} is predicted to decrease by ${Math.abs(predictedChange).toFixed(1)}% - consider review.`,
            priority: 'high'
          });
        }
      }
    });

    return recommendations;
  };

  const exportReport = async () => {
    if (!reportData) return;

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const margin = 40;
      let y = margin;

      // Title
      doc.setFontSize(18);
      doc.text('CryptoNova - Portfolio Report', margin, y);
      y += 24;

      // Generated timestamp
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
      y += 20;

      // Summary section
      doc.setFontSize(14);
      doc.text('Summary', margin, y);
      y += 16;
      doc.setFontSize(11);
      doc.text([ 
        `Total Assets: ${reportData.totalAssets}`,
        `Total Value: $${reportData.totalValue.toLocaleString()}`,
        `Total Cost: $${reportData.totalCost.toLocaleString()}`,
        `Gain/Loss: $${reportData.totalGainLoss.toFixed(2)} (${reportData.totalGainLossPercentage.toFixed(2)}%)`,
        `Risk Level: ${reportData.riskLevel}`,
        `Diversification Score: ${reportData.diversificationScore}%`,
        `Predicted Value (${selectedTimeframe}d): $${reportData.predictedValue.toLocaleString()}`
      ], margin, y, { lineHeightFactor: 1.4 });
      y += 120;

      // Top Performer
      doc.setFontSize(14);
      doc.text('Top Performer', margin, y);
      y += 16;
      doc.setFontSize(11);
      doc.text(`${reportData.topPerformer?.symbol || 'N/A'}`, margin, y);
      y += 24;

      // Asset Analysis table (basic)
      doc.setFontSize(14);
      doc.text('Holdings', margin, y);
      y += 16;
      doc.setFontSize(10);
      const header = ['Symbol', 'Amount', 'Current Price', 'Value', 'P/L'];
      const colWidths = [60, 60, 100, 100, 100];
      let x = margin;
      header.forEach((h, i) => { doc.text(h, x, y); x += colWidths[i]; });
      y += 14;
      doc.setLineWidth(0.5); doc.line(margin, y, 575, y); y += 10;

      for (const asset of reportData.assetAnalysis.slice(0, 20)) { // cap rows for first page(s)
        x = margin;
        const value = (asset.amount * asset.currentPrice);
        const pl = (asset.currentPrice - asset.purchasePrice) * asset.amount;
        const row = [
          asset.symbol,
          String(asset.amount),
          `$${asset.currentPrice.toFixed(2)}`,
          `$${value.toLocaleString()}`,
          `${pl >= 0 ? '+' : ''}$${pl.toFixed(2)}`
        ];
        row.forEach((cell, i) => { doc.text(String(cell), x, y); x += colWidths[i]; });
        y += 14;
        if (y > 760) { doc.addPage(); y = margin; }
      }

      // Recommendations
      if (reportData.recommendations?.length) {
        if (y > 680) { doc.addPage(); y = margin; }
        doc.setFontSize(14);
        doc.text('Recommendations', margin, y);
        y += 16;
        doc.setFontSize(11);
        reportData.recommendations.slice(0, 10).forEach((rec: any, idx: number) => {
          doc.text(`${idx + 1}. [${rec.type}] ${rec.message}`, margin, y);
          y += 14;
          if (y > 760) { doc.addPage(); y = margin; }
        });
      }

      // Save file
      doc.save(`portfolio-report-${Date.now()}.pdf`);
      toast.success('Portfolio report exported as PDF!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to export PDF');
    }
  };

  useEffect(() => {
    if (portfolio.assets.length > 0) {
      fetchPredictions();
    }
  }, [portfolio.assets.length]);

  if (portfolio.assets.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Portfolio Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Add assets to your portfolio to see analytics and predictions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader className="flex flex-col space-y-4">
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI-Powered Portfolio Analytics
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={() => fetchPredictions()} 
                disabled={isLoadingPredictions}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {isLoadingPredictions ? 'Analyzing...' : 'Update Predictions'}
              </Button>
              <Button onClick={exportReport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground font-medium">ML Prediction Timeframe:</span>
            <div className="flex gap-1">
              {[1, 7, 14, 30, 90].map((days) => (
                <Button
                  key={days}
                  variant={selectedTimeframe === days ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTimeframeChange(days)}
                  disabled={isLoadingPredictions}
                  className={`${selectedTimeframe === days ? 'bg-primary text-primary-foreground' : ''} min-w-[60px]`}
                >
                  {days === 1 ? '1D' : days === 7 ? '1W' : days === 14 ? '2W' : days === 30 ? '1M' : '3M'}
                </Button>
              ))}
            </div>
            <Badge variant="secondary" className="ml-2">
              {selectedTimeframe}-day forecast
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="recommendations">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {reportData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Risk Level</p>
                        <Badge variant={reportData.riskLevel === 'High' ? 'destructive' : reportData.riskLevel === 'Medium' ? 'default' : 'secondary'}>
                          {reportData.riskLevel}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Diversification</p>
                        <p className="text-2xl font-bold">{reportData.diversificationScore}%</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Predicted Value</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${reportData.predictedValue.toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Top Performer</p>
                        <p className="font-bold">
                          {reportData.topPerformer?.symbol || 'N/A'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.entries(predictions).map(([symbol, prediction]) => (
                  <Card key={symbol}>
                    <CardHeader>
                      <CardTitle className="text-lg">{symbol} Predictions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">LSTM Neural Network</span>
                          <span className="font-medium">
                            ${prediction.predictions.lstm?.toFixed(2) || 'N/A'}
                          </span>
                          <Badge variant="outline">
                            {prediction.confidences.lstm?.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Random Forest</span>
                          <span className="font-medium">
                            ${prediction.predictions.random_forest?.toFixed(2) || 'N/A'}
                          </span>
                          <Badge variant="outline">
                            {prediction.confidences.random_forest?.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Linear Regression</span>
                          <span className="font-medium">
                            ${prediction.predictions.linear_regression?.toFixed(2) || 'N/A'}
                          </span>
                          <Badge variant="outline">
                            {prediction.confidences.linear_regression?.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>

                      {prediction.future_predictions && prediction.future_predictions.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">{selectedTimeframe}-Day ML Forecast</p>
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={prediction.future_predictions}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" fontSize={12} />
                              <YAxis fontSize={12} />
                              <Tooltip />
                              <Line 
                                type="monotone" 
                                dataKey="predicted_price" 
                                stroke="#8884d8" 
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              {reportData?.assetAnalysis && (
                <div className="space-y-4">
                  {reportData.assetAnalysis.map((asset: any) => (
                    <Card key={asset.id || asset.symbol}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{asset.symbol} - {asset.name}</span>
                          <Badge variant={asset.performance.status === 'excellent' ? 'default' : 
                                        asset.performance.status === 'good' ? 'secondary' : 
                                        asset.performance.status === 'fair' ? 'outline' : 'destructive'}>
                            {asset.performance.status}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Performance</p>
                            <p className={`font-bold ${asset.performance.percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {asset.performance.percentage > 0 ? '+' : ''}
                              {asset.performance.percentage.toFixed(2)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Risk Level</p>
                            <p className="font-bold">{asset.risk}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Current Value</p>
                            <p className="font-bold">
                              ${(asset.amount * asset.currentPrice).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Profit/Loss</p>
                            <p className={`font-bold ${((asset.currentPrice - asset.purchasePrice) * asset.amount) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${((asset.currentPrice - asset.purchasePrice) * asset.amount).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              {reportData?.recommendations && reportData.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {reportData.recommendations.map((rec: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className={`w-5 h-5 mt-0.5 ${
                            rec.priority === 'high' ? 'text-red-500' : 
                            rec.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                          }`} />
                          <div>
                            <Badge variant="outline" className="mb-2">
                              {rec.type}
                            </Badge>
                            <p className="text-sm">{rec.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No specific recommendations at this time. Your portfolio looks good!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioAnalytics;
