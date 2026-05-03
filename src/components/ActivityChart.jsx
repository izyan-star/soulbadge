import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query'; // Tambahin ini buat fetch data real

const ActivityChart = ({ color = "#a855f7", address }) => { // Tambah prop address

  // --- LOGIC FETCH DATA REAL (MENGGANTIKAN DATA DUMMY) ---
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['activityData', address],
    queryFn: async () => {
      if (!address) return [];
      try {
        // Panggil API Explorer (Contoh Monad/Universal)
        const res = await fetch(`https://api.monad-explorer.com/address/${address}/daily-stats?days=7`);
        const result = await res.json();
        
        // Return data dari API, formatnya harus: [{ day: 'Mon', tx: 10 }, ...]
        return result.stats || []; 
      } catch (err) {
        // Kalau error/API gak ada, balikin 0 biar grafik gak crash
        return [
          { day: 'Mon', tx: 0 }, { day: 'Tue', tx: 0 }, { day: 'Wed', tx: 0 },
          { day: 'Thu', tx: 0 }, { day: 'Fri', tx: 0 }, { day: 'Sat', tx: 0 }, { day: 'Sun', tx: 0 }
        ];
      }
    },
    enabled: !!address, // Cuma jalan kalau ada address
    refetchInterval: 60000 // Refresh tiap 1 menit
  });

  // Gunakan data dari API, kalau masih loading pake data kosong dulu
  const finalData = chartData || [];

  return (
    <div style={{ 
      width: '100%', 
      height: 300, 
      background: 'rgba(20,20,20,0.4)', 
      padding: '20px', 
      borderRadius: '24px', 
      border: '1px solid rgba(255,255,255,0.05)',
      marginTop: '20px'
    }}>
      <p style={{ 
        fontSize: '11px', 
        letterSpacing: '3px', 
        opacity: 0.5, 
        marginBottom: '20px',
        fontWeight: '900' 
      }}>7D TRANSACTION VELOCITY {isLoading && "..."}</p>
      
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={finalData}> {/* Data dummy diganti finalData */}
          <defs>
            <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#666', fontSize: 12}}
          />
          <YAxis hide={true} domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#000', 
              border: `1px solid ${color}`, 
              borderRadius: '10px',
              fontSize: '12px'
            }} 
            itemStyle={{ color: color }}
          />
          <Area 
            type="monotone" 
            dataKey="tx" 
            stroke={color} 
            fillOpacity={1} 
            fill="url(#colorTx)" 
            strokeWidth={3}
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;