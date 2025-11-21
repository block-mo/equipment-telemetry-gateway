// Load environment variables (.env) using ESM side-effect import
import 'dotenv/config'

// ES module imports (instead of require)
import express from 'express'
import cors from 'cors'
import http from 'http'
import WebSocket from 'ws'
import { Pool } from 'pg'

// Create express app
const app = express()

// Enable CORS + JSON parsing middleware
app.use(cors())
app.use(express.json())

// Create PostgreSQL pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Initialize database tables
export async function initDb() {
  const client = await pool.connect() // get pooled connection

  await client.query(`
    CREATE TABLE IF NOT EXISTS telemetry (
      id SERIAL PRIMARY KEY,
      device_id TEXT NOT NULL,
      ts TIMESTAMP DEFAULT NOW(),
      temperature REAL,
      vibration REAL,
      status TEXT
    );
  `)

  client.release() // return client to pool
}

// Create HTTP server + WebSocket server
const server = http.createServer(app)
const wss = new WebSocket.Server({ server, path: '/ws' })

// Make WS server available to routes
app.locals.wss = wss

// POST /telemetry — insert telemetry + broadcast over WebSocket
app.post('/telemetry', async (req, res) => {
  const { deviceId, timestamp, temperature, vibration, status } = req.body

  if (!deviceId) {
    return res.status(400).json({ error: 'deviceId required' })
  }

  // Insert into DB
  await pool.query(
    `INSERT INTO telemetry (device_id, ts, temperature, vibration, status)
     VALUES ($1, COALESCE($2, NOW()), $3, $4, $5)`,
    [deviceId, timestamp, temperature, vibration, status]
  )

  // Prepare WebSocket broadcast message
  const msg = JSON.stringify({
    type: 'telemetry',
    payload: req.body,
  })

  // Broadcast only to connected (OPEN) clients
  wss.clients.forEach(c => {
    if (c.readyState === 1) c.send(msg)
  })

  res.status(202).json({ accepted: true })
})

// GET /devices — return distinct device list
app.get('/devices', async (_req, res) => {
  const r = await pool.query(`
    SELECT DISTINCT device_id
    FROM telemetry
    ORDER BY device_id
  `)

  // Format output as [{ id: 'device-01' }]
  res.json(r.rows.map(row => ({ id: row.device_id })))
})

// Start server after DB is initialized
async function start() {
  await initDb()
  const port = process.env.PORT || 4000

  server.listen(port, () =>
    console.log(`backend on :${port}`)
  )
}

start()
