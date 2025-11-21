// Load environment variables (.env) using ESM side-effect import
import 'dotenv/config'

// Import axios for HTTP requests
import axios from 'axios'

// Read backend URL + device ID from environment (with defaults)
const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000/telemetry'
const DEVICE_ID = process.env.DEVICE_ID || 'device-01'

// Function that creates + sends telemetry to backend
async function sendTelemetry() {
    const payload = {
        deviceId: DEVICE_ID,
        timestamp: new Date().toISOString(),
        temperature: 40 + Math.random() * 10, // random temp
        vibration: Math.random() * 5,        // random vibration
        status: 'OK',
    }

    try {
        await axios.post(BACKEND, payload)   // send to backend
        console.log('sent', payload)
    } catch (e) {
        console.error('send failed', e.message)
    }
}

// Repeated send (every 2 seconds)
setInterval(sendTelemetry, 2000)

// Send first payload immediately
sendTelemetry()
