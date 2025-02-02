// src/app/page.js
import { Header } from '@/components/layout/Header';
import { HomeClient } from '@/components/home/HomeClient';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="pt-20 md:pt-24">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-primary rounded-full filter blur-3xl opacity-10" />
          <div className="absolute top-1/2 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-primary rounded-full filter blur-3xl opacity-10" />
        </div>

        <HomeClient />
      </div>
    </div>
  );
}