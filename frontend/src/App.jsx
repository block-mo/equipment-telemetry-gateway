import React, { useEffect, useState } from "react";
import DeviceList, { DeviceControls } from "./components/DeviceList";
import TelemetryChart from "./components/TelemetryChart";

export default function App() {
  // Store all discovered device IDs
  const [devices, setDevices] = useState([]);

  // Store telemetry history keyed by deviceId
  const [telemetry, setTelemetry] = useState({});

  // Currently selected device
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Connect to backend WebSocket
    const ws = new WebSocket("ws://localhost:4000/ws");

    // Fired every time a message is received
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data); // parse JSON message

      if (msg.type === "telemetry") {
        const { deviceId } = msg.payload;

        // Add device if not already listed
        setDevices((prev) =>
          prev.includes(deviceId) ? prev : [...prev, deviceId],
        );

        // Update telemetry and keep only last 50 entries
        setTelemetry((prev) => ({
          ...prev,
          [deviceId]: [
            ...(prev[deviceId] || []), // keep previous entries
            msg.payload, // append new one
          ].slice(-50), // limit to last 50
        }));
      }
    };

    // Cleanup WebSocket on component unmount
    return () => ws.close();
  }, []);

  return (
    <div className="mx-auto p-6 space-y-4">
      <h1 className="text-5xl text-blue-500 font-bold">Telemetry Viewer</h1>

      {/* Device selector list */}
      <DeviceList
        devices={devices}
        selected={selected}
        onSelect={setSelected}
      />

      {/* Only show chart when a device is selected */}
      {selected && (
        <>
          <TelemetryChart
            deviceId={selected}
            data={telemetry[selected] || []}
          />
          <DeviceControls deviceId={selected} />
        </>
      )}
    </div>
  );
}
