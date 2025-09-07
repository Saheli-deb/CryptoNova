import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for demonstration
const generateChartData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  let actualPrice = 65000;
  let predictedPrice = 65000;
  
  for (let i = 0; i < 60; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Generate realistic price movement
    const volatility = 0.03;
    const trend = i < 30 ? 0.001 : -0.0005;
    
    actualPrice *= (1 + trend + (Math.random() - 0.5) * volatility);
    predictedPrice *= (1 + trend * 0.8 + (Math.random() - 0.5) * volatility * 0.6);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      actual: i < 30 ? actualPrice : null,
      predicted: predictedPrice,
      lstm: predictedPrice * (1 + (Math.random() - 0.5) * 0.02),
      randomForest: predictedPrice * (1 + (Math.random() - 0.5) * 0.025),
      linearReg: predictedPrice * (1 + (Math.random() - 0.5) * 0.015),
    });
  }
  
  return data;
};

const PredictionChart = () => {
  const data = generateChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 border border-card-border">
          <p className="text-foreground font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> ${entry.value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">Bitcoin Price Prediction</h3>
        <p className="text-muted-foreground">Multi-model comparison with historical data</p>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            
            {/* Actual price line */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--foreground))"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              name="Actual Price"
            />
            
            {/* LSTM prediction */}
            <Line
              type="monotone"
              dataKey="lstm"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="LSTM Model"
            />
            
            {/* Random Forest prediction */}
            <Line
              type="monotone"
              dataKey="randomForest"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              strokeDasharray="10 5"
              dot={false}
              name="Random Forest"
            />
            
            {/* Linear Regression prediction */}
            <Line
              type="monotone"
              dataKey="linearReg"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              strokeDasharray="15 5"
              dot={false}
              name="Linear Regression"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Model Performance */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card-secondary/50 rounded-lg p-4 border border-card-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">LSTM Accuracy</span>
            <span className="text-sm font-medium text-primary">94.2%</span>
          </div>
          <div className="w-full bg-card-border rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '94.2%' }}></div>
          </div>
        </div>

        <div className="bg-card-secondary/50 rounded-lg p-4 border border-card-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Random Forest</span>
            <span className="text-sm font-medium text-success">91.8%</span>
          </div>
          <div className="w-full bg-card-border rounded-full h-2">
            <div className="bg-success h-2 rounded-full" style={{ width: '91.8%' }}></div>
          </div>
        </div>

        <div className="bg-card-secondary/50 rounded-lg p-4 border border-card-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Linear Reg.</span>
            <span className="text-sm font-medium text-accent">87.5%</span>
          </div>
          <div className="w-full bg-card-border rounded-full h-2">
            <div className="bg-accent h-2 rounded-full" style={{ width: '87.5%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionChart;