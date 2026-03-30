import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatsSection";
import { supabase } from "@/lib/supabase";

export default function SearchRank() {
  const [riotId, setRiotId] = useState("");
  const [region, setRegion] = useState("ap");
  const [loading, setLoading] = useState(false);

  const [topAgent, setTopAgent] = useState("Jett");
  const [searchedStats, setSearchedStats] = useState<any>(null);
  const [agentImages, setAgentImages] = useState<Record<string, string>>({});

  const getRankImageUrl = (tierId: number): string => {
    const uuid = "03621f52-342b-cf4e-4f86-9350a49c6d04";
    return `https://media.valorant-api.com/competitivetiers/${uuid}/${tierId}/largeicon.png`;
  };

  // 🔥 FETCH AGENT IMAGES (NO HARDCODING)
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true");
        const json = await res.json();

        const map: Record<string, string> = {};

        json.data.forEach((agent: any) => {
          map[agent.displayName] = agent.displayIcon;
        });

        setAgentImages(map);
      } catch (err) {
        console.error("Failed to load agents", err);
      }
    };

    fetchAgents();
  }, []);

  // 🔥 SUPABASE (REAL STATS)
  const fetchPlayerStats = async (name: string, tag: string, region: string) => {
    const { data, error } = await supabase.functions.invoke("valorant-rank", {
      body: { name, tag, region },
    });

    if (error || !data?.mmr?.current) return null;

    return {
      rank: data.mmr.current.tier?.name || "Unranked",
      rankTierId: data.mmr.current.tier?.id || 0,
      rr: data.mmr.current.rr || 0,
      lastChange: data.mmr.current.last_change || 0,
      peakRank: data.mmr.peak?.tier?.name || "N/A",
      peakRankTierId: data.mmr.peak?.tier?.id || 0,
    };
  };

  // 🔥 TOP AGENT
  const getTopAgent = async (region: string, name: string, tag: string) => {
    try {
      const res = await fetch(
        `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${name}/${tag}?size=5`,
        {
          headers: {
            Authorization: "HDEV-192356a1-7c72-42d9-bf58-534ec248141a",
          },
        }
      );

      const json = await res.json();
      const matches = json.data || [];

      const agentCount: Record<string, number> = {};

      matches.forEach((match: any) => {
        const player = match?.players?.all_players?.find(
          (p: any) =>
  p.name.toLowerCase() === name.toLowerCase() &&
  p.tag.toLowerCase() === tag.toLowerCase()
        );

        if (player?.character) {
          const agent = player.character;
          agentCount[agent] = (agentCount[agent] || 0) + 1;
        }
      });

      const top = Object.entries(agentCount).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0];
console.log("agentCount:", agentCount);
      return top || "Jett";
    } catch {
      return "Jett";
    }
  };

  const handleSearch = async () => {
    if (!riotId.includes("#")) {
      alert("Enter Riot ID like name#tag");
      return;
    }

    const [name, tag] = riotId.split("#");

    setLoading(true);
    setSearchedStats(null);

    try {
      const stats = await fetchPlayerStats(name, tag, region);

      if (!stats) {
        alert("Player not found");
        return;
      }

      const agent = await getTopAgent(region, name, tag);

      setTopAgent(agent);
      setSearchedStats(stats);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch player");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center gap-4">

      {/* INPUT */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Enter Riot ID (name#tag)"
          value={riotId}
          onChange={(e) => setRiotId(e.target.value)}
          className="px-5 py-3 rounded-full bg-secondary/60 backdrop-blur text-white w-60 outline-none"
        />

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="px-4 py-3 rounded-full bg-secondary/60 text-white backdrop-blur"
        >
          <option value="ap">AP</option>
          <option value="eu">EU</option>
          <option value="na">NA</option>
          <option value="kr">KR</option>
        </select>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSearch}
        className="px-6 py-2 rounded-full bg-primary text-black font-medium transition hover:scale-105"
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {/* RESULT */}
      {searchedStats && (
        <div className="mt-6 w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <StatCard
              label="Current Rank"
              value={searchedStats.rank}
              subtext=""
              index={0}
              rankImage={
                searchedStats.rankTierId
                  ? getRankImageUrl(searchedStats.rankTierId)
                  : undefined
              }
              rrProgress={searchedStats.rr}
              rrChange={searchedStats.lastChange}
            />

            <StatCard
              label="Top Agent"
              value={topAgent}
              subtext=""
              index={1}
              agentImage={
                agentImages[topAgent] ||
                agentImages[
                  topAgent?.charAt(0).toUpperCase() + topAgent?.slice(1)
                ] 
              }
              peakRank={searchedStats.peakRank}
              peakRankImage={
                searchedStats.peakRankTierId
                  ? getRankImageUrl(searchedStats.peakRankTierId)
                  : undefined
              }
            />

          </div>
        </div>
      )}
    </div>
  );
}