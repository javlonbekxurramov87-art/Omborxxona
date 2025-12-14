import React from 'react';

interface BarcodeRendererProps {
  value: string;
  width?: number;
  height?: number;
}

export const BarcodeRenderer: React.FC<BarcodeRendererProps> = ({ value }) => {
  // A simulated visual barcode using css stripes for aesthetic purposes
  // In a real app, use 'react-barcode' package.
  return (
    <div className="flex flex-col items-center bg-white p-2 border border-gray-200 inline-block rounded">
      <div className="flex items-end h-12 gap-[2px] overflow-hidden w-full justify-center">
        {value.split('').map((char, i) => {
           const num = parseInt(char, 10);
           const isThick = num % 2 === 0;
           return (
             <div 
                key={i} 
                className={`bg-black ${isThick ? 'w-1.5' : 'w-0.5'}`} 
                style={{ height: `${80 + (num * 2)}%` }}
             />
           );
        })}
      </div>
      <div className="text-xs font-mono tracking-widest mt-1 font-bold">
        {value}
      </div>
    </div>
  );
};