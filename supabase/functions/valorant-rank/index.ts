import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RankResponse {
  status: number;
  data?: {
    current: {
      tier: {
        id: number;
        name: string;
      };
      rr: number;
      last_change: number;
      elo: number;
    };
    peak: {
      tier: {
        id: number;
        name: string;
      };
      season: {
        short: string;
      };
    };
    name: string;
    tag: string;
  };
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('HENRIKDEV_API_KEY');
    
    if (!apiKey) {
      console.error('HENRIKDEV_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body for player info
    const { name, tag, region } = await req.json();
    
    console.log(`Fetching rank for ${name}#${tag} in region ${region}`);

    // Fetch MMR data from Henrik Dev API v3
    const mmrResponse = await fetch(
      `https://api.henrikdev.xyz/valorant/v3/mmr/${region}/pc/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
      {
        headers: {
          'Authorization': apiKey,
        },
      }
    );

    if (!mmrResponse.ok) {
      console.error(`Henrik API error: ${mmrResponse.status}`);
      const errorText = await mmrResponse.text();
      console.error('Error response:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `Failed to fetch rank data: ${mmrResponse.status}`,
          details: errorText 
        }),
        { 
          status: mmrResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const mmrData: RankResponse = await mmrResponse.json();
    console.log('MMR data received:', JSON.stringify(mmrData, null, 2));

    // Also fetch account data for additional info
    const accountResponse = await fetch(
      `https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
      {
        headers: {
          'Authorization': apiKey,
        },
      }
    );

    let accountData = null;
    if (accountResponse.ok) {
      accountData = await accountResponse.json();
      console.log('Account data received:', JSON.stringify(accountData, null, 2));
    }

    // Return combined data
    return new Response(
      JSON.stringify({
        success: true,
        mmr: mmrData.data,
        account: accountData?.data,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in valorant-rank function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
