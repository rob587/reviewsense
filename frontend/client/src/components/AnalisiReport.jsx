import React from 'react'
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

const SENTIMENT_CONFIG = {
    positivo: { color: "#34d399", bg: "bg-emerald-500/10", border: "border-emerald-500/30", label: "Positivo" },
    neutro: { color: "#fbbf24", bg: "bg-yellow-500/10", border: "border-yellow-500/30", label: "Neutro" },
    negativo: { color: "#ef4444", bg: "bg-red-500/10", border: "border-red-500/30", label: "Negativo" },
    misto: { color: "#a78bfa", bg: "bg-violet-500/10", border: "border-violet-500/30", label: "Misto" },
};

const ScoreGauge = ({ score }) => {
    const color = score >= 7 ? "#34d399" : score >= 5 ? "#fbbf24" : "#ef4444";
    const data = [{ value: score * 10, fill: color }];

    return (
        <div style={{ width: "160px", height: "160px", position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={data}
                    startAngle={180}
                    endAngle={0}
                >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "rgba(255,255,255,0.05)" }} />
                </RadialBarChart>
            </ResponsiveContainer>
            <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "20px",
            }}>
                <span style={{ fontSize: "2rem", fontWeight: "700", color }}>{score}</span>
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>/ 10</span>
            </div>
        </div>
    );
};

const AnalisiReport = () => {
    return (
        <div>AnalisiReport</div>
    )
}

export default AnalisiReport