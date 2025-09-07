import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  logo?: string;
}

export interface Portfolio {
  assets: CryptoAsset[];
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
}

export interface PortfolioContextType {
  portfolio: Portfolio;
  addAsset: (asset: Omit<CryptoAsset, 'id' | 'currentPrice'>) => Promise<void>;
  removeAsset: (assetId: string) => Promise<void>;
  updateAsset: (assetId: string, updates: Partial<CryptoAsset>) => Promise<void>;
  refreshPrices: () => Promise<void>;
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    assets: [],
    totalValue: 0,
    totalCost: 0,
    totalGainLoss: 0,
    totalGainLossPercentage: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, token } = useAuth();

  // Load portfolio from backend on mount
  useEffect(() => {
    if (isAuthenticated && user && token) {
      loadPortfolio();
    }
  }, [isAuthenticated, user?.id, token]);

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const loadPortfolio = async () => {
    if (!token || !user) return;
    
    try {
      setIsLoading(true);
      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/api/portfolio`);
      setPortfolio(data.portfolio);
    } catch (error: any) {
      console.error('Error loading portfolio:', error);
      toast.error(error.message || 'Failed to load portfolio');
    } finally {
      setIsLoading(false);
    }
  };


  const addAsset = async (assetData: Omit<CryptoAsset, 'id' | 'currentPrice'>) => {
    if (!token || !user) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/portfolio/add`, {
        method: 'POST',
        body: JSON.stringify(assetData),
      });

      // Reload portfolio to get updated data
      await loadPortfolio();
      
      return response;
    } catch (error: any) {
      console.error('Error adding asset:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeAsset = async (assetId: string) => {
    if (!token || !user) {
      throw new Error('User not authenticated');
    }

    try {
      await makeAuthenticatedRequest(`${API_BASE_URL}/api/portfolio/remove`, {
        method: 'DELETE',
        body: JSON.stringify({ assetId }),
      });

      // Reload portfolio to get updated data
      await loadPortfolio();
    } catch (error: any) {
      console.error('Error removing asset:', error);
      toast.error(error.message || 'Failed to remove asset');
      throw error;
    }
  };

  const updateAsset = async (assetId: string, updates: Partial<CryptoAsset>) => {
    // For now, we'll implement this as a client-side update
    // In the future, this could be a backend API call
    const updatedAssets = portfolio.assets.map(asset =>
      asset.id === assetId ? { ...asset, ...updates } : asset
    );
    
    const totalCost = updatedAssets.reduce((sum, asset) => sum + (asset.amount * asset.purchasePrice), 0);
    const totalValue = updatedAssets.reduce((sum, asset) => sum + (asset.amount * asset.currentPrice), 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    const newPortfolio = {
      assets: updatedAssets,
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercentage
    };
    
    setPortfolio(newPortfolio);
  };

  const refreshPrices = useCallback(async () => {
    if (!token || !user || portfolio.assets.length === 0) return;
    
    setIsLoading(true);
    try {
      await makeAuthenticatedRequest(`${API_BASE_URL}/api/portfolio/refresh`, {
        method: 'POST',
      });

      // Reload portfolio to get updated prices
      await loadPortfolio();
    } catch (error: any) {
      console.error('Error refreshing prices:', error);
      toast.error(error.message || 'Failed to refresh prices');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [portfolio.assets.length, token, user?.id]);

  // Auto-refresh prices every 5 minutes (disabled for now to prevent issues)
  // useEffect(() => {
  //   if (portfolio.assets.length > 0) {
  //     const interval = setInterval(() => {
  //       refreshPrices();
  //     }, 5 * 60 * 1000);
  //     return () => clearInterval(interval);
  //   }
  // }, [portfolio.assets.length]);

  const value: PortfolioContextType = {
    portfolio,
    addAsset,
    removeAsset,
    updateAsset,
    refreshPrices,
    isLoading
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
