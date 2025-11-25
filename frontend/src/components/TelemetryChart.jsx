// ES module imports for React + Recharts components
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// TelemetryChart shows time-series temperature + vibration for a device
export default function TelemetryChart({ deviceId, data }) {
  return (
    // Constrain parent width to 200px so child (ResponsiveContainer) matches it
    <div className="bg-white shadow rounded p-4">
      {/* Chart title */}
      <h2 className="text-lg font-semibold mb-2">
        Device {deviceId} Telemetry
      </h2>

      {/* Responsive chart container — auto resizes to parent */}
      <ResponsiveContainer width="100%" height={300}>
        {/* Recharts LineChart takes array of telemetry points */}
        <LineChart data={data}>
          {/* X-axis uses timestamp but we hide labels to reduce clutter */}
          <XAxis dataKey="timestamp" hide />

          {/* Standard Y-axis */}
          <YAxis />

          {/* Tooltip on hover */}
          <Tooltip />

          {/* Line labels */}
          <Legend />

          {/* Temperature line (red) */}
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ef4444" // Tailwind red-500 hex
            dot={true} // Show point markers, for clean looks set to false
          />

          {/* Vibration line (blue) */}
          <Line
            type="monotone"
            dataKey="vibration"
            stroke="#3b82f6" // Tailwind blue-500 hex
            dot={true} // Show point markers, for clean looks set to false
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
