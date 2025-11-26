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
