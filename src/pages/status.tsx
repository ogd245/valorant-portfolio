
import { useState, useEffect } from "react";
iimport { supabase } from "@/lib/supabaseClient";

export default function AdminStatus() {

  const [activity, setActivity] = useState("offline");
  const [gamemode, setGamemode] = useState("none");
  const [agent, setAgent] = useState("none");
  const [customStatus, setCustomStatus] = useState("none");

  // ✅ FIX: useEffect INSIDE component
  useEffect(() => {
    const loadStatus = async () => {
      const { data, error } = await supabase
        .from("status")
        .select("*")
        .eq("id", 1)
        .single();

      if (data) {
        setActivity(data.activity);
        setGamemode(data.gamemode);
        setAgent(data.agent);
        setCustomStatus(data.custom_status ?? "none");
      }

      if (error) {
        console.error("Failed to load status:", error);
      }
    };

    loadStatus();
  }, []);

  const updateStatus = async (
    newActivity: string,
    newGamemode: string,
    newAgent: string,
    newCustomStatus: string
  ) => {

    const { error } = await supabase
      .from("status")
      .update({
        activity: newActivity,
        gamemode: newGamemode,
        agent: newAgent,
        custom_status: newCustomStatus,
        updated_at: new Date()
      })
      .eq("id", 1);

    if (error) {
      console.error("Supabase update error:", error);
    }
  };

  const handleActivityChange = (value: string) => {
    setActivity(value);
    updateStatus(value, gamemode, agent, customStatus);
  };

  const handleGamemodeChange = (value: string) => {
    setGamemode(value);
    updateStatus(activity, value, agent, customStatus);
  };

  const handleAgentChange = (value: string) => {
    setAgent(value);
    updateStatus(activity, gamemode, value, customStatus);
  };

  const handleCustomStatusChange = (value: string) => {
    setCustomStatus(value);
    updateStatus(activity, gamemode, agent, value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-background text-foreground">

      <h1 className="text-4xl font-bold">Status Control</h1>

      {/* Activity */}
      <div className="flex flex-col gap-2 w-64">
        <label className="text-sm text-muted-foreground">Activity</label>
        <select
          value={activity}
          onChange={(e) => handleActivityChange(e.target.value)}
          className="p-3 rounded-lg bg-secondary text-foreground border border-border"
        >
          <option value="offline">Offline</option>
          <option value="afk">AFK</option>
          <option value="in game">In Game</option>
          <option value="in match">In Match</option>
        </select>
      </div>

      {/* Agent */}
      <div className="flex flex-col gap-2 w-64">
        <label className="text-sm text-muted-foreground">Agent</label>
        <select
          value={agent}
          onChange={(e) => handleAgentChange(e.target.value)}
          className="p-3 rounded-lg bg-secondary text-foreground border border-border"
        >
          <option value="none">None</option>
          <option value="Jett">Jett</option>
          <option value="Reyna">Reyna</option>
          <option value="Raze">Raze</option>
          <option value="Chamber">Chamber</option>
          <option value="Omen">Omen</option>
          <option value="Sova">Sova</option>
        </select>
      </div>

      {/* Gamemode */}
      <div className="flex flex-col gap-2 w-64">
        <label className="text-sm text-muted-foreground">Gamemode</label>
        <select
          value={gamemode}
          onChange={(e) => handleGamemodeChange(e.target.value)}
          className="p-3 rounded-lg bg-secondary text-foreground border border-border"
        >
          <option value="none">None</option>
          <option value="competitive">Competitive</option>
          <option value="unrated">Unrated</option>
          <option value="swiftplay">Swiftplay</option>
          <option value="deathmatch">Deathmatch</option>
        </select>
      </div>

      {/* Custom Status */}
      <div className="flex flex-col gap-2 w-64">
        <label className="text-sm text-muted-foreground">Custom Status</label>
        <select
          value={customStatus}
          onChange={(e) => handleCustomStatusChange(e.target.value)}
          className="p-3 rounded-lg bg-secondary text-foreground border border-border"
        >
          <option value="none">None</option>
          <option value="side quests">Side Quests</option>
          <option value="touching grass">Touching Grass</option>
          <option value="cooking">Cooking</option>
          <option value="reviewing vods">Reviewing VODs</option>
          <option value="aim training">Aim Training</option>
          <option value="watching vct">Watching VCT</option>
          <option value="studying lineups">Studying Lineups</option>
        </select>
      </div>

      <p className="text-sm text-muted-foreground">
        Changes update your website instantly.
      </p>

    </div>
  );
}
