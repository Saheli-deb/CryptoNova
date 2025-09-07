import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const TestModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    console.log("Button clicked!");
    alert("Add Asset button works!");
    setIsOpen(true);
  };

  return (
    <div>
      <Button onClick={handleClick} className="bg-primary hover:bg-primary-dark crypto-glow">
        <Plus className="w-4 h-4 mr-2" />
        Add Asset (Test)
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Test Modal</h2>
            <p className="mb-4">This is a test modal to verify that modals can open.</p>
            <div className="flex space-x-2">
              <Button onClick={() => setIsOpen(false)} variant="outline">
                Close
              </Button>
              <Button onClick={() => setIsOpen(false)} className="bg-primary">
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestModal;
