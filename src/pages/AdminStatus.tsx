import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function Admin() {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: string) => {
    setLoading(true);
    await supabase
      .from("status")
      .update({ activity: status })
      .eq("id", 1);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 p-6">
      
      <h1 className="text-2xl font-bold">Status Control</h1>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">

        <button
          onClick={() => updateStatus("online")}
          className="bg-green-600 py-4 rounded-xl text-lg active:scale-95"
        >
          🟢 Online
        </button>

        <button
          onClick={() => updateStatus("offline")}
          className="bg-red-600 py-4 rounded-xl text-lg active:scale-95"
        >
          🔴 Offline
        </button>

        <button
          onClick={() => updateStatus("playing")}
          className="bg-purple-600 py-4 rounded-xl text-lg active:scale-95 col-span-2"
        >
          🎮 Playing
        </button>

      </div>

      {loading && <p className="text-sm opacity-70">Updating...</p>}
    </div>
  );
}