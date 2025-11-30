import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  time: number; // Waktu dalam menit
  waveHeight: number; // Tinggi gelombang dalam meter
}

interface ChartComponentProps {
  data: ChartData[];
  eta?: number; // Estimated Time of Arrival (menit)
  maxHeight?: number; // Tinggi gelombang maksimum
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data, eta, maxHeight }) => {
  return (
    <div className="w-full space-y-6">
      {/* Info Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {eta !== undefined && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg">
            <div className="text-sm font-medium opacity-90">Estimated Time of Arrival</div>
            <div className="text-3xl font-bold mt-1">{eta} menit</div>
          </div>
        )}
        {maxHeight !== undefined && (
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-lg shadow-lg">
            <div className="text-sm font-medium opacity-90">Tinggi Gelombang Maksimum</div>
            <div className="text-3xl font-bold mt-1">{maxHeight.toFixed(2)} m</div>
          </div>
        )}
      </div>

      {/* Line Chart - Tinggi Gelombang vs Waktu */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Grafik Tinggi Gelombang vs Waktu</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="time" 
              label={{ value: 'Waktu (menit)', position: 'insideBottom', offset: -5 }}
              stroke="#666"
            />
            <YAxis 
              label={{ value: 'Tinggi Gelombang (m)', angle: -90, position: 'insideLeft' }}
              stroke="#666"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px'
              }}
              formatter={(value: number) => [`${value.toFixed(2)} m`, 'Tinggi Gelombang']}
              labelFormatter={(label) => `Waktu: ${label} menit`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Line 
              type="monotone" 
              dataKey="waveHeight" 
              name="Tinggi Gelombang"
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Area Chart - Zona Bahaya */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Area Genangan Tsunami</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="time" 
              label={{ value: 'Waktu (menit)', position: 'insideBottom', offset: -5 }}
              stroke="#666"
            />
            <YAxis 
              label={{ value: 'Tinggi (m)', angle: -90, position: 'insideLeft' }}
              stroke="#666"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value.toFixed(2)} m`, 'Tinggi']}
            />
            <Area 
              type="monotone" 
              dataKey="waveHeight" 
              name="Area Genangan"
              stroke="#ef4444" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorWave)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600 font-medium">Durasi Simulasi</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">
            {data.length > 0 ? data[data.length - 1].time : 0} min
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600 font-medium">Data Points</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{data.length}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600 font-medium">Rata-rata Tinggi</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">
            {data.length > 0 
              ? (data.reduce((sum, d) => sum + d.waveHeight, 0) / data.length).toFixed(2)
              : '0.00'
            } m
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600 font-medium">Tinggi Min</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">
            {data.length > 0 
              ? Math.min(...data.map(d => d.waveHeight)).toFixed(2)
              : '0.00'
            } m
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
