import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ClipsSection from '@/components/ClipsSection';
import StatsSection from '@/components/StatsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <ClipsSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
