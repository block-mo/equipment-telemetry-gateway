// Import React using ES module syntax
import React from "react";

// DeviceList component receives devices, selected, and onSelect as props
export default function DeviceList({ devices, selected, onSelect }) {
  return (
    <div>
      {/* Section header */}
      <h2 className="text-3xl text-slate-500 font-bold mb-4">Devices</h2>

      {/* Horizontal list of device buttons */}
      <div className="flex gap-2">
        {devices.map((d) => (
          <button
            key={d} // unique key for React list rendering
            onClick={() => onSelect(d)} // update selected device when clicked
            // Conditionally apply Tailwind classes:
            // - Always add padding + rounded corners
            // - If selected: blue background + white text
            // - If not: light gray background
            className={`px-3 py-1 rounded bg-green-500 text-lg ${
              selected === d
                ? "bg-green-600 text-white" // Selected (active)
                : "bg-gray-200" // Unselected (inactive)
            }`}
          >
            {d} {/* Render device name */}
          </button>
        ))}
      </div>
    </div>
  );
}

// DeviceControls component to send start/stop commands to selected device
export function DeviceControls({ deviceId }) {
  // Async function to send command action to backend API
  const send = async (action) => {
    await fetch(`http://localhost:4000/devices/${deviceId}/command`, {
      method: "POST", // POST request to send command
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }), // Send action (start/stop) as JSON
    });
  };

  return (
    <div className="mt-2 flex gap-2">
      {/* Start button - sends "start" command */}
      <button
        className="px-3 py-1 bg-green-600 text-white rounded"
        onClick={() => send("start")}
      >
        Start
      </button>
      {/* Stop button - sends "stop" command */}
      <button
        className="px-3 py-1 bg-red-600 text-white rounded"
        onClick={() => send("stop")}
      >
        Stop
      </button>
    </div>
  );
}
