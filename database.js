const Database = require('better-sqlite3');
const path = require('path');

// 使用持久化路徑，Zeabur 的 /data 目錄會持久保存
const dbPath = process.env.DB_PATH || path.join(__dirname, 'trip.db');
const db = new Database(dbPath);

console.log('資料庫路徑:', dbPath);

// 初始化資料庫表格
db.exec(`
  CREATE TABLE IF NOT EXISTS itinerary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    day_number INTEGER NOT NULL,
    location TEXT NOT NULL,
    activity TEXT NOT NULL,
    driving_info TEXT DEFAULT '',
    accommodation TEXT DEFAULT '',
    guide_tips TEXT DEFAULT '',
    recommendations TEXT DEFAULT '',
    custom_locations TEXT DEFAULT '',
    attachments TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    backup_plan TEXT DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    amount INTEGER NOT NULL,
    paid_by TEXT NOT NULL,
    description TEXT DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS budget (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL UNIQUE,
    budget_amount INTEGER DEFAULT 0
  );
`);

// 行程 CRUD
const itineraryQueries = {
  getAll: db.prepare('SELECT * FROM itinerary ORDER BY day_number ASC'),
  getById: db.prepare('SELECT * FROM itinerary WHERE id = ?'),
  insert: db.prepare('INSERT INTO itinerary (date, day_number, location, activity, driving_info, accommodation, guide_tips, recommendations, custom_locations, attachments, notes, backup_plan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'),
  update: db.prepare('UPDATE itinerary SET date = ?, day_number = ?, location = ?, activity = ?, driving_info = ?, accommodation = ?, guide_tips = ?, recommendations = ?, custom_locations = ?, attachments = ?, notes = ?, backup_plan = ? WHERE id = ?'),
  delete: db.prepare('DELETE FROM itinerary WHERE id = ?')
};

// 花費 CRUD
const expenseQueries = {
  getAll: db.prepare('SELECT * FROM expenses ORDER BY date ASC'),
  getById: db.prepare('SELECT * FROM expenses WHERE id = ?'),
  insert: db.prepare('INSERT INTO expenses (date, category, amount, paid_by, description) VALUES (?, ?, ?, ?, ?)'),
  update: db.prepare('UPDATE expenses SET date = ?, category = ?, amount = ?, paid_by = ?, description = ? WHERE id = ?'),
  delete: db.prepare('DELETE FROM expenses WHERE id = ?')
};

// 預算 CRUD
const budgetQueries = {
  getAll: db.prepare('SELECT * FROM budget ORDER BY category ASC'),
  upsert: db.prepare('INSERT OR REPLACE INTO budget (category, budget_amount) VALUES (?, ?)')
};

module.exports = {
  itinerary: {
    getAll: () => itineraryQueries.getAll.all(),
    getById: (id) => itineraryQueries.getById.get(id),
    create: (date, day_number, location, activity, driving_info, accommodation, guide_tips, recommendations, custom_locations, attachments, notes, backup_plan) => 
      itineraryQueries.insert.run(date, day_number, location, activity, driving_info, accommodation, guide_tips, recommendations, custom_locations || '', attachments || '', notes || '', backup_plan || ''),
    update: (id, date, day_number, location, activity, driving_info, accommodation, guide_tips, recommendations, custom_locations, attachments, notes, backup_plan) =>
      itineraryQueries.update.run(date, day_number, location, activity, driving_info, accommodation, guide_tips, recommendations, custom_locations || '', attachments || '', notes || '', backup_plan || '', id),
    delete: (id) => itineraryQueries.delete.run(id)
  },
  expenses: {
    getAll: () => expenseQueries.getAll.all(),
    getById: (id) => expenseQueries.getById.get(id),
    create: (date, category, amount, paid_by, description) =>
      expenseQueries.insert.run(date, category, amount, paid_by, description),
    update: (id, date, category, amount, paid_by, description) =>
      expenseQueries.update.run(date, category, amount, paid_by, description, id),
    delete: (id) => expenseQueries.delete.run(id)
  },
  budget: {
    getAll: () => budgetQueries.getAll.all(),
    set: (category, amount) => budgetQueries.upsert.run(category, amount)
  }
};
