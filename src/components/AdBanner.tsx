import React from 'react';

const AdBanner = () => {
  return (
    <div className="mt-12 py-6 border-t border-dashed border-neutral-200 dark:border-neutral-700">
      <div className="bg-neutral-100 dark:bg-neutral-800/50 w-full min-h-[90px] flex items-center justify-center rounded-lg p-4">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">
          Espacio Publicitario
        </p>
      </div>
    </div>
  );
};

export default AdBanner;