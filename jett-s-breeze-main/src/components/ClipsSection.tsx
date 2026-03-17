import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ChevronDown, X } from 'lucide-react';

interface Clip {
  title: string;
  thumbnail: string;
  video: string;
  views: string;
  duration: string;
}

interface ClipCardProps extends Clip {
  index: number;
  onPlay: (clip: Clip) => void;
}

const ClipCard = ({ title, thumbnail, views, duration, video, index, onPlay }: ClipCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * 15, y: (x - 0.5) * -15 });
  };

  return (
    <div
      ref={cardRef}
      className={`opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
      style={{
        animationDelay: `${index * 0.1}s`,
        animationFillMode: 'forwards',
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onClick={() => onPlay({ title, thumbnail, views, duration, video })}
    >
      <Card
        className="group cursor-pointer overflow-hidden transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="relative aspect-video overflow-hidden rounded-t-2xl">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
              <Play className="w-7 h-7 text-primary-foreground ml-1" />
            </div>
          </div>

          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-background/80 text-xs">
            {duration}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm">{views} views</p>
        </CardContent>
      </Card>
    </div>
  );
};

const ClipsSection = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeClip, setActiveClip] = useState<Clip | null>(null);
  const [showLessVisible, setShowLessVisible] = useState(false);

  useEffect(() => {
    const closeOnEsc = (e: KeyboardEvent) => e.key === 'Escape' && setActiveClip(null);
    window.addEventListener('keydown', closeOnEsc);
    return () => window.removeEventListener('keydown', closeOnEsc);
  }, []);

  const clips: Clip[] = [
    { title: '123',
      thumbnail: '/thumbnails/clutch1.jpg',
      video: '/clips/clutch1.mp4', 
      views: '0', 
      duration: '0:42' },

  ];

  const visibleClips = clips.slice(0, visibleCount);
  const hasMoreClips = visibleCount < clips.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, clips.length));
    setShowLessVisible(true);
  };

  const handleShowLess = () => {
    setVisibleCount(6);
    setShowLessVisible(false);
  };

  const showButtons = clips.length > 6;

  return (
    <section id="clips" className="py-24 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <p className="text-primary font-display uppercase tracking-[0.3em] mb-3 text-sm">Featured</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Epic Moments</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Watch the most insane plays, clutches, and highlights from competitive matches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleClips.map((clip, index) => (
            <ClipCard key={index} {...clip} index={index} onPlay={setActiveClip} />
          ))}
        </div>

        {/* Buttons */}
        {showButtons && (
          <div className="flex justify-center mt-12 gap-4">
            {hasMoreClips && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleShowMore}
                className="group gap-2 font-display tracking-wide"
              >
                Show More
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
              </Button>
            )}

            {showLessVisible && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleShowLess}
                className="group gap-2 font-display tracking-wide"
              >
                Show Less
                <ChevronDown className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-y-1" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {activeClip && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4"
          onClick={() => setActiveClip(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveClip(null)} className="absolute -top-10 right-0 text-white">
              <X />
            </button>
            <video src={activeClip.video} controls autoPlay className="w-full rounded-xl" />
          </div>
        </div>
      )}
    </section>
  );
};

export default ClipsSection;
