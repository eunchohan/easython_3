const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

// =============================
// 1. DB 설정 (SQLite)
// =============================
const dbPath = path.join(__dirname, "lostfound.db");
const db = new Database(dbPath);

// 테이블 생성
db.prepare(`
  CREATE TABLE IF NOT EXISTS lost_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    building TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// =============================
// 2. Express 기본 설정
// =============================
const app = express();
const PORT = process.env.PORT || 3000;

// JSON 파싱
app.use(express.json());

// CORS 허용 (프론트에서 fetch 쓸 수 있게)
app.use(
  cors({
    origin: "*", // 필요하면 특정 도메인으로 제한 가능
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
  })
);

// =============================
// 3. 헬스 체크
// =============================
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// =============================
// 4. 건물별 분실물 개수 API
//    GET /api/buildings
// =============================
app.get("/api/buildings", (req, res) => {
  try {
    const rows = db
      .prepare(
        `
      SELECT building, COUNT(*) AS count
      FROM lost_items
      GROUP BY building
    `
      )
      .all();

    res.json(rows);
  } catch (err) {
    console.error("GET /api/buildings error:", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// =============================
// 5. 분실물 목록 조회 API
//    GET /api/items?building=xxx
// =============================
app.get("/api/items", (req, res) => {
  const { building } = req.query;

  try {
    let rows;
    if (building) {
      rows = db
        .prepare(
          `
        SELECT 
          id, 
          building, 
          description, 
          datetime(created_at) AS createdAt
        FROM lost_items
        WHERE building = ?
        ORDER BY created_at DESC
      `
        )
        .all(building);
    } else {
      // building 파라미터 없으면 전체 조회 (필요 없으면 막아도 됨)
      rows = db
        .prepare(
          `
        SELECT 
          id, 
          building, 
          description, 
          datetime(created_at) AS createdAt
        FROM lost_items
        ORDER BY created_at DESC
      `
        )
        .all();
    }

    res.json(rows);
  } catch (err) {
    console.error("GET /api/items error:", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// =============================
// 6. 분실물 등록 API
//    POST /api/items
//    body: { building, description }
// =============================
app.post("/api/items", (req, res) => {
  const { building, description } = req.body;

  if (!building || !description) {
    return res.status(400).json({
      error: "validation_error",
      message: "building과 description은 필수입니다."
    });
  }

  try {
    const insertStmt = db.prepare(
      `
      INSERT INTO lost_items (building, description)
      VALUES (?, ?)
    `
    );

    const info = insertStmt.run(building, description);

    const row = db
      .prepare(
        `
      SELECT 
        id, 
        building, 
        description, 
        datetime(created_at) AS createdAt
      FROM lost_items
      WHERE id = ?
    `
      )
      .get(info.lastInsertRowid);

    res.status(201).json(row);
  } catch (err) {
    console.error("POST /api/items error:", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// =============================
// 7. 서버 시작
// =============================
app.listen(PORT, () => {
  console.log(`Lost & Found API 서버가 포트 ${PORT}에서 실행 중`);
});