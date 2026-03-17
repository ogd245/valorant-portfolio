import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Target, Crosshair, Loader2, RefreshCw, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  index: number;
  isLoading?: boolean;
  rankImage?: string;
  rrProgress?: number;
  rrChange?: number;
  accountLevel?: number;
  playerCard?: string;
  compact?: boolean;
  color?: string;
  agentImage?: string;
  peakRank?: string;
  peakRankImage?: string;
}

const StatCard = ({ 
  icon, 
  label, 
  value, 
  subtext, 
  index, 
  isLoading, 
  rankImage,
  rrProgress,
  rrChange,
  accountLevel,
  playerCard,
  compact,
  agentImage,
  peakRank,
  peakRankImage,
  color 
}: StatCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (compact) {
    return (
      <div ref={cardRef} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}>
        <Card className="py-4 px-4 hover:border-primary/50 transition-all duration-300 group">
          <CardContent className="p-0 flex items-center gap-4">
            {/* Rank Image */}
            {rankImage && (
              <img 
                src={rankImage} 
                alt={value} 
                className="w-12 h-12 object-contain drop-shadow-[0_0_10px_hsl(var(--primary)/0.4)]"
              />
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-display mb-0.5">{label}</p>
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <p className="font-display text-lg font-bold text-foreground truncate">{value}</p>
              )}
            </div>

            {/* RR Progress */}
            {rrProgress !== undefined && !isLoading && (
              <div className="w-24 space-y-1">
                <div className="relative">
                  <Progress value={rrProgress} className="h-2 bg-secondary/50" />
                </div>
                <p className="text-xs text-muted-foreground text-center">{rrProgress}/100 RR</p>
                {rrChange !== undefined && (
                  <div className={`flex items-center justify-center gap-0.5 text-xs ${rrChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {rrChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{rrChange >= 0 ? '+' : ''}{rrChange}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className={`opacity-0 ${isVisible ? 'animate-scale-in' : ''}`}
      style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'forwards' }}
    >
      <Card className="text-center py-8 px-6 min-h-[315px] hover:border-primary/50 transition-all duration-500 group relative overflow-hidden">
        {/* Player card background for account level card */}
        {playerCard && (
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${playerCard})` }}
          />
        )}
        
        <CardContent className="p-0 relative z-10">
          {/* Agent Image, Icon, or Rank Image */}
          <div className="mb-4 flex items-center justify-center">
            {agentImage ? (
              <div className="relative">
                <img 
                  src={agentImage} 
                  alt={value} 
                  className="w-24 h-24 object-contain drop-shadow-[0_0_20px_hsl(var(--primary)/0.6)] transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ) : rankImage ? (
              <div className="relative">
                <img 
                  src={rankImage} 
                  alt={value} 
                  className="w-20 h-20 object-contain drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)] transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ) : icon ? (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary group-hover:bg-primary/20 transition-colors duration-500">
                <div className="text-primary transition-transform duration-500 group-hover:scale-110">
                  {icon}
                </div>
              </div>
            ) : null}
          </div>

          {/* Label */}
          <p className="text-muted-foreground text-sm uppercase tracking-wider font-display mb-2">
            {label}
          </p>

          {/* Value */}
          {isLoading ? (
  <div className="flex items-center justify-center h-14">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
) : label === "Activity" ? (
  <div className="mt-4 flex flex-col items-center gap-3">

  {/* Agent image only if not offline */}
  {value !== "offline" && (
  <img
    src={
      value === "afk"
        ? "/gifs/jett-afk.webp"
        : agentImages["Jett"]
    }
    alt="Agent"
    className="w-28 h-28 object-contain drop-shadow-[0_0_20px_hsl(var(--primary)/0.6)]"
  />
)}

  {/* Status */}
  <div className="flex items-center gap-2">
    <span
      className={`w-3 h-3 rounded-full animate-pulse ${
        value === "in game"
          ? "bg-green-400"
          : value === "in match"
          ? "bg-red-400"
          : value === "afk"
          ? "bg-yellow-400"
          : "bg-gray-400"
      }`}
    />

    <p className={`font-display text-3xl font-bold ${color ?? "gradient-text"}`}>
      {value.replace(/\b\w/g, c => c.toUpperCase())}
    </p>
  </div>

  {/* Gamemode only when playing */}
  {subtext && subtext !== "none" && (
  <p className="text-lg text-muted-foreground font-display">
    {subtext.replace(/\b\w/g, c => c.toUpperCase())}
  </p>
)}

  </div>
) : (
  <p className={`font-display text-3xl md:text-4xl font-bold mb-3 ${color ?? "gradient-text"}`}>
    {value}
  </p>
)}

          {/* RR Progress Bar */}
          {rrProgress !== undefined && !isLoading && (
            <div className="mt-4 space-y-2">
              <div className="relative">
                <Progress 
                  value={rrProgress} 
                  className="h-3 bg-secondary/50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-display font-semibold text-foreground drop-shadow-md">
                    {rrProgress} / 100 RR
                  </span>
                </div>
              </div>
              
              {/* RR Change */}
              {rrChange !== undefined && (
                <div className={`flex items-center justify-center gap-1 mt-3 text-sm font-display ${rrChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {rrChange >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-semibold">
                    {rrChange >= 0 ? '+' : ''}{rrChange} RR
                  </span>
                  <span className="text-muted-foreground text-xs ml-1">last game</span>
                </div>
              )}
            </div>
          )}

          {/* Peak Rank Display (for Top Agent card) */}
          {peakRank && peakRankImage && (
            <div className="mt-4 flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <img 
                  src={peakRankImage} 
                  alt={peakRank} 
                  className="w-8 h-8 object-contain drop-shadow-[0_0_8px_hsl(var(--primary)/0.4)]"
                />
                <span className="text-sm font-display text-muted-foreground">{peakRank}</span>
              </div>
              <span className="text-xs font-display text-muted-foreground/70 uppercase tracking-wider">Peak Rank</span>
            </div>
          )}

          {/* Subtext (for non-RR cards) */}
          {/* Subtext (for non-RR cards) */}

 


          

          {/* Account Level Badge */}
          {accountLevel && (
            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-display">
              Level {accountLevel}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Get rank image URL from tier ID
const getRankImageUrl = (tierId: number): string => {
  // Valorant competitive tiers UUID for Episode 8+
  const competitiveTiersUuid = '03621f52-342b-cf4e-4f86-9350a49c6d04';
  return `https://media.valorant-api.com/competitivetiers/${competitiveTiersUuid}/${tierId}/largeicon.png`;
};

interface LiveStats {
  rank: string;
  rankTierId: number;
  rr: number;
  peakRank: string;
  peakRankTierId: number;
  lastChange: number;
  accountLevel: number;
  playerCard: string;
}

interface AltAccount {
  name: string;
  tag: string;
  region: string;
  displayName: string;
}

const ALT_ACCOUNTS: AltAccount[] = [
  { name: 'OGD', tag: '245', region: 'ap', displayName: 'OGD#245' },
  { name: 'iwhiffshots', tag: 'every', region: 'ap', displayName: 'iwhiffshots#every' },
];

const agentImages: Record<string, string> = {
  Jett: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png"
};
const StatsSection = () => {
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  const [altStats, setAltStats] = useState<Record<string, LiveStats | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [altLoading, setAltLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [isAltsOpen, setIsAltsOpen] = useState(false);


const [status, setStatus] = useState({
  activity: "offline",
  gamemode: "none",
  agent: "none",
  custom_status: "none"
});





  const fetchAccountStats = async (name: string, tag: string, region: string): Promise<LiveStats | null> => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke('valorant-rank', {
        body: { name, tag, region },
      });

      if (fnError || !data?.mmr?.current) {
        return null;
      }

      return {
        rank: data.mmr.current.tier?.name || 'Unranked',
        rankTierId: data.mmr.current.tier?.id || 0,
        rr: data.mmr.current.rr || 0,
        peakRank: data.mmr.peak?.tier?.name || 'N/A',
        peakRankTierId: data.mmr.peak?.tier?.id || 0,
        lastChange: data.mmr.current.last_change || 0,
        accountLevel: data.account?.account_level || 0,
        playerCard: data.account?.card?.wide || '',
      };
    } catch {
      return null;
    }
  };

useEffect(() => {

  const fetchStatus = async () => {
    const { data } = await supabase
      .from("status")
      .select("*")
      .eq("id", 1)
      .single();

    if (data) setStatus(data);
  };

  fetchStatus();

  const channel = supabase
    .channel("status-updates")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "status",
      },
      (payload) => {
        setStatus(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

}, []);

const activityColors: Record<string, string> = {
  "offline": "text-gray-400",
  "afk": "text-yellow-400",
  "in game": "text-green-400",
  "in match": "text-red-400"
};


  const fetchLiveStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const stats = await fetchAccountStats('jettquake', 'OGD', 'ap');
      if (stats) {
        setLiveStats(stats);
      } else {
        setError('No rank data available');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to connect to API');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAltStats = async () => {
    for (const alt of ALT_ACCOUNTS) {
      const key = `${alt.name}#${alt.tag}`;
      setAltLoading(prev => ({ ...prev, [key]: true }));
      
      const stats = await fetchAccountStats(alt.name, alt.tag, alt.region);
      setAltStats(prev => ({ ...prev, [key]: stats }));
      setAltLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    fetchLiveStats();
  }, []);

  useEffect(() => {
    if (isAltsOpen && Object.keys(altStats).length === 0) {
      fetchAltStats();
    }
  }, [isAltsOpen]);

  const stats = [
    {
      label: "Current Rank",
      value: liveStats?.rank || 'Loading...',
      subtext: '',
      rankImage: liveStats?.rankTierId ? getRankImageUrl(liveStats.rankTierId) : undefined,
      rrProgress: liveStats?.rr,
      rrChange: liveStats?.lastChange,
    },
      {
  label: "Activity",
  value: status.activity,
  subtext:
    status.activity === "afk"
      ? status.custom_status
      : status.activity === "offline"
      ? "none"
      : status.gamemode,
  color: activityColors[status.activity?.toLowerCase()]
},
    {
      label: "Top Agent",
      value: "Jett",
      subtext: "",
      agentImage: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png",
      peakRank: liveStats?.peakRank || 'Loading...',
      peakRankImage: liveStats?.peakRankTierId ? getRankImageUrl(liveStats.peakRankTierId) : undefined,
    },
  ];

  return (
    <section id="stats" className="py-24 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <p className="text-primary font-display uppercase tracking-[0.3em] text-sm">
              Performance
            </p>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-display animate-live-glow">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              LIVE
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Live Stats
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Real-time statistics for <span className="text-primary">jettquake#OGD</span>
          </p>
          
          {/* Refresh Button */}
          <Button 
            variant="glass" 
            size="sm" 
            onClick={fetchLiveStats}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Stats
          </Button>

          {error && (
            <p className="text-destructive mt-4 text-sm">{error}</p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <StatCard 
              key={index} 
              {...stat} 
              index={index}
              isLoading={isLoading && index < 2}
            />
          ))}
        </div>
         
        {/* Alt Accounts Collapsible */}
        <div className="max-w-5xl mx-auto mt-8">
          <Collapsible open={isAltsOpen} onOpenChange={setIsAltsOpen}>
            <CollapsibleTrigger asChild>
              <button className="mx-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/80 border border-border/50 hover:border-primary/30 transition-all duration-300 group">
                <span className="text-sm font-display font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  My Alts
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isAltsOpen ? 'rotate-180' : ''}`} />
              </button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4">
              <div className="space-y-3">
                {ALT_ACCOUNTS.map((alt, index) => {
                  const key = `${alt.name}#${alt.tag}`;
                  const stats = altStats[key];
                  const loading = altLoading[key];
                  
                  return (
                    <StatCard
                      key={key}
                      label={alt.displayName}
                      value={stats?.rank || 'Loading...'}
                      subtext={`${alt.region.toUpperCase()} Region`}
                      index={index}
                      isLoading={loading}
                      rankImage={stats?.rankTierId ? getRankImageUrl(stats.rankTierId) : undefined}
                      rrProgress={stats?.rr}
                      rrChange={stats?.lastChange}
                      compact
                    />
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
