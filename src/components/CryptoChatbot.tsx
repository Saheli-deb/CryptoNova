import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const CryptoChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your crypto assistant. I can help you with cryptocurrency information, market analysis, trading tips, and portfolio questions. What would you like to know?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple AI responses for crypto-related questions
  const getCryptoResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('bitcoin') || lowerQuestion.includes('btc')) {
      return "Bitcoin (BTC) is the world's first and largest cryptocurrency. It's often considered digital gold and a store of value. Currently, Bitcoin's price is influenced by factors like institutional adoption, regulatory news, and market sentiment. Would you like to know about Bitcoin's current price or recent trends?";
    }
    
    if (lowerQuestion.includes('ethereum') || lowerQuestion.includes('eth')) {
      return "Ethereum (ETH) is a blockchain platform that enables smart contracts and decentralized applications (DApps). It's the second-largest cryptocurrency by market cap. Ethereum 2.0 has improved its scalability and energy efficiency through proof-of-stake consensus. Are you interested in ETH price movements or its technology?";
    }
    
    if (lowerQuestion.includes('price') || lowerQuestion.includes('cost')) {
      return "I can help you understand price movements! Cryptocurrency prices are influenced by supply and demand, market sentiment, regulatory news, technological developments, and macroeconomic factors. For real-time prices, check our dashboard. What specific coin's price are you curious about?";
    }
    
    if (lowerQuestion.includes('buy') || lowerQuestion.includes('invest')) {
      return "Investment advice: 1) Only invest what you can afford to lose 2) Do your own research (DYOR) 3) Diversify your portfolio 4) Consider dollar-cost averaging 5) Use reputable exchanges. Remember, cryptocurrency is highly volatile and risky. What's your investment experience level?";
    }
    
    if (lowerQuestion.includes('wallet') || lowerQuestion.includes('storage')) {
      return "Crypto storage options: 1) Hot wallets (online) - convenient but less secure 2) Cold wallets (hardware) - more secure for long-term storage 3) Paper wallets - completely offline. Popular hardware wallets include Ledger and Trezor. Always keep your private keys secure and backed up!";
    }
    
    if (lowerQuestion.includes('portfolio') || lowerQuestion.includes('diversify')) {
      return "Portfolio diversification tips: 1) Don't put everything in one coin 2) Mix large-cap (BTC, ETH) with smaller altcoins 3) Consider different sectors (DeFi, NFTs, Layer 1s) 4) Regularly rebalance 5) Keep some stablecoins for opportunities. Our portfolio tracker can help you monitor your investments!";
    }
    
    if (lowerQuestion.includes('trading') || lowerQuestion.includes('strategy')) {
      return "Trading strategies: 1) HODLing (long-term holding) 2) Dollar-cost averaging 3) Swing trading 4) Day trading (high risk) 5) Technical analysis. Remember: 95% of day traders lose money. Start with small amounts and learn risk management first!";
    }
    
    if (lowerQuestion.includes('defi') || lowerQuestion.includes('yield')) {
      return "DeFi (Decentralized Finance) allows earning yield through: 1) Liquidity provision 2) Staking 3) Lending 4) Yield farming. Risks include smart contract bugs, impermanent loss, and protocol risks. Start with established protocols and small amounts. APYs that seem too good to be true usually are!";
    }
    
    if (lowerQuestion.includes('nft')) {
      return "NFTs (Non-Fungible Tokens) represent unique digital ownership. Use cases include art, gaming, music, and utility tokens. The market is highly speculative. Tips: 1) Research the project and team 2) Understand utility beyond art 3) Check rarity and community 4) Be prepared for high volatility.";
    }
    
    if (lowerQuestion.includes('regulation') || lowerQuestion.includes('legal')) {
      return "Crypto regulations vary by country and are evolving. Key considerations: 1) Tax implications (capital gains) 2) KYC/AML compliance 3) Reporting requirements 4) Licensed exchanges. Always consult with tax professionals and stay updated on your local regulations. The regulatory landscape is becoming clearer but remains complex.";
    }
    
    if (lowerQuestion.includes('security') || lowerQuestion.includes('scam')) {
      return "Crypto security tips: 1) Use 2FA everywhere 2) Never share private keys 3) Verify URLs (avoid phishing) 4) Be skeptical of 'guaranteed returns' 5) Use reputable exchanges 6) Keep software updated. Common scams: fake giveaways, Ponzi schemes, fake exchanges, and social engineering attacks.";
    }
    
    if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey')) {
      return "Hello! Great to meet you! I'm here to help with all things cryptocurrency. Whether you're a beginner looking to learn the basics or an experienced trader seeking advanced insights, I'm here to assist. What would you like to explore today?";
    }
    
    if (lowerQuestion.includes('thank')) {
      return "You're very welcome! I'm always here to help with your crypto questions. Feel free to ask me anything about cryptocurrencies, trading, DeFi, NFTs, or blockchain technology. Happy investing! 🚀";
    }
    
    // Default response
    return "That's an interesting question about crypto! While I can provide general information about cryptocurrencies, market trends, trading strategies, and blockchain technology, I'd recommend doing additional research from multiple sources. Is there a specific aspect of cryptocurrency you'd like me to explain further?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getCryptoResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 seconds delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary-dark shadow-lg crypto-glow"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Open crypto chat</span>
          </Button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <Card className="w-96 h-[500px] shadow-xl border-card-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-card-border">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm">Crypto Assistant</CardTitle>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-0 flex flex-col h-[calc(500px-120px)]">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-2 ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <Avatar className="h-6 w-6 mt-1">
                        <AvatarFallback className={message.sender === 'user' ? 'bg-secondary' : 'bg-primary text-primary-foreground'}>
                          {message.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-6 w-6 mt-1">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input */}
              <div className="border-t border-card-border p-3">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about crypto..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-primary hover:bg-primary-dark"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default CryptoChatbot;
