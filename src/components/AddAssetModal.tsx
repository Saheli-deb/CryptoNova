import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { toast } from "sonner";

interface AddAssetModalProps {
  children?: React.ReactNode;
}

const popularCrypto = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'DOT', name: 'Polkadot' },
  { symbol: 'LINK', name: 'Chainlink' },
  { symbol: 'LTC', name: 'Litecoin' },
  { symbol: 'XRP', name: 'Ripple' },
  { symbol: 'MATIC', name: 'Polygon' },
  { symbol: 'AVAX', name: 'Avalanche' }
];

const AddAssetModal: React.FC<AddAssetModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    amount: '',
    purchasePrice: '',
    purchaseDate: undefined as Date | undefined,
    customSymbol: ''
  });
  const { addAsset, isLoading } = usePortfolio();

  const handleOpenModal = () => {
    console.log('Opening modal...');
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.symbol || !formData.amount || !formData.purchasePrice || !formData.purchaseDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const symbol = formData.symbol === 'custom' ? formData.customSymbol : formData.symbol;
      const name = formData.symbol === 'custom' ? formData.customSymbol : 
        popularCrypto.find(crypto => crypto.symbol === formData.symbol)?.name || formData.symbol;

      await addAsset({
        symbol,
        name,
        amount: parseFloat(formData.amount),
        purchasePrice: parseFloat(formData.purchasePrice),
        purchaseDate: format(formData.purchaseDate, 'yyyy-MM-dd')
      });

      toast.success(`${symbol} added to portfolio successfully!`);
      setIsOpen(false);
      setFormData({
        symbol: '',
        name: '',
        amount: '',
        purchasePrice: '',
        purchaseDate: undefined,
        customSymbol: ''
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add asset');
    }
  };

  return (
    <>
      {/* Trigger Button */}
      {children ? (
        <div onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
          {children}
        </div>
      ) : (
        <Button onClick={handleOpenModal} className="bg-primary hover:bg-primary-dark">
          <Plus className="w-4 h-4 mr-2" />
          Add Asset
        </Button>
      )}
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Add New Asset</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Add a cryptocurrency to your portfolio with purchase details.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="crypto-select" className="text-gray-700 dark:text-gray-300">Cryptocurrency</Label>
                <select 
                  value={formData.symbol} 
                  onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900"
                >
                  <option value="">Select cryptocurrency</option>
                  {popularCrypto.map((crypto) => (
                    <option key={crypto.symbol} value={crypto.symbol}>
                      {crypto.symbol} - {crypto.name}
                    </option>
                  ))}
                  <option value="custom">Custom - Enter manually</option>
                </select>
              </div>

              {formData.symbol === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="custom-symbol" className="text-gray-700 dark:text-gray-300">Custom Symbol</Label>
                  <Input
                    id="custom-symbol"
                    placeholder="e.g., DOGE"
                    value={formData.customSymbol}
                    onChange={(e) => setFormData({...formData, customSymbol: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900 dark:placeholder-gray-400 placeholder-gray-500"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">Amount</Label>
                  <input
                    id="amount"
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900 dark:placeholder-gray-400 placeholder-gray-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purchase-price" className="text-gray-700 dark:text-gray-300">Purchase Price (USD)</Label>
                  <input
                    id="purchase-price"
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900 dark:placeholder-gray-400 placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Purchase Date</Label>
                <input
                  type="date"
                  value={formData.purchaseDate ? format(formData.purchaseDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value ? new Date(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Asset'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddAssetModal;
