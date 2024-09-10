'use client';

import { CaretCircleLeft } from "@phosphor-icons/react";
import { useState } from 'react';
import { Alloy } from '@/app/types';
import { AlloySelectionGrid } from './components/AlloySelectionGrid';

export default function Home() {
  const [selectedAlloy, setSelectedAlloy] = useState<Alloy | null>(null);

  const handleAlloySelect = (alloy: Alloy) => {
    setSelectedAlloy(alloy);
  };

  const handleBack = () => {
    setSelectedAlloy(null);
  };

  return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            {selectedAlloy && (
                <button onClick={handleBack} className="mr-4">
                  <CaretCircleLeft size={40} weight="bold" className="text-primary hover:text-blue transition-colors duration-200"/>
                </button>
            )}

            <h1 className="text-3xl font-bold text-primary flex-grow text-center">
              {selectedAlloy ? selectedAlloy.name : 'CHOOSE TARGET ALLOY'}
            </h1>

            {selectedAlloy && <div className="w-10"></div>}
          </div>

          {!selectedAlloy && <AlloySelectionGrid onAlloySelect={handleAlloySelect}/>}

          {selectedAlloy && (
              <div className="text-primary">
                {/* Calculator content will be added here later */}<p>Calculator view for {selectedAlloy.name} - content to be added.</p>
              </div>
          )}
        </div>
      </main>
  );
}