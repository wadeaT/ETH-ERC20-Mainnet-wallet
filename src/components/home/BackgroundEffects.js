// src/components/home/BackgroundEffects.js
export const BackgroundEffects = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-1/2 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-primary rounded-full filter blur-3xl opacity-10" />
      <div className="absolute top-1/2 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-primary rounded-full filter blur-3xl opacity-10" />
    </div>
  );