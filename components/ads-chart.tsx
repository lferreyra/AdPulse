"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface AdsChartProps {
  data: { date: string; count: number }[];
}

export function AdsChart({ data }: AdsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="h-48 flex items-center justify-center rounded-xl border"
        style={{ borderColor: "#1f2128" }}
      >
        <p className="text-xs" style={{ color: "#5a5c66" }}>
          Sin datos de historial todavía
        </p>
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#5a5c66" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#5a5c66" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#161820",
              border: "1px solid #1f2128",
              borderRadius: 8,
              fontSize: 12,
              color: "#f0f0ee",
            }}
            labelStyle={{ color: "#9899a0", marginBottom: 4 }}
            itemStyle={{ color: "#10b981" }}
            formatter={(value: any) => [value ?? 0, "Anuncios activos"]}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#059669"
            strokeWidth={2}
            fill="url(#emeraldGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#059669", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
