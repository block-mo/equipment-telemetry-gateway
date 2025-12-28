/* eslint-env jest */
import request from "supertest";
import express from "express";
import { Pool } from "pg";

// Mock the database to avoid real connections during tests
jest.mock("pg", () => ({
  Pool: jest.fn(() => ({
    query: jest.fn(),
  })),
}));

// Simple test app setup - mirrors main app structure
function createApp() {
  const app = express();
  app.use(express.json());

  const pool = new Pool();

  // POST /telemetry endpoint (simplified for testing)
  app.post("/telemetry", async (req, res) => {
    const { deviceId } = req.body;

    // Validate required field
    if (!deviceId) {
      return res.status(400).json({ error: "deviceId required" });
    }

    // Simulate database insert
    await pool.query("INSERT INTO telemetry...", [deviceId]);

    res.status(202).json({ accepted: true });
  });

  // GET /devices endpoint (simplified)
  app.get("/devices", async (req, res) => {
    const result = await pool.query("SELECT DISTINCT device_id...");
    res.json(result.rows.map((row) => ({ id: row.device_id })));
  });

  return { app, pool };
}

// Group related tests together
describe("Telemetry API - Basic Tests", () => {
  let app, pool;

  // Setup fresh app before each test (keeps tests isolated)
  beforeEach(() => {
    jest.clearAllMocks();
    ({ app, pool } = createApp());
  });

  // Test 1: Basic validation - reject bad requests
  test("rejects telemetry without deviceId", async () => {
    const response = await request(app)
      .post("/telemetry")
      .send({ temperature: 72.5 }); // missing deviceId

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("deviceId required");
  });

  // Test 2: Happy path - accept valid data
  test("accepts valid telemetry data", async () => {
    pool.query.mockResolvedValueOnce({}); // mock successful DB insert

    const response = await request(app).post("/telemetry").send({
      deviceId: "device-01",
      temperature: 72.5,
      vibration: 0.05,
    });

    expect(response.status).toBe(202);
    expect(response.body.accepted).toBe(true);
  });

  // Test 3: Verify database is called
  test("stores data in database", async () => {
    pool.query.mockResolvedValueOnce({});

    await request(app).post("/telemetry").send({ deviceId: "device-01" });

    // Verify pool.query was called once
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  // Test 4: GET /devices returns empty array when no data
  test("returns empty device list initially", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get("/devices");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  // Test 5: GET /devices returns formatted list
  test("returns list of devices", async () => {
    // Mock database returning 2 devices
    pool.query.mockResolvedValueOnce({
      rows: [{ device_id: "device-01" }, { device_id: "device-02" }],
    });

    const response = await request(app).get("/devices");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: "device-01" }, { id: "device-02" }]);
  });
});
