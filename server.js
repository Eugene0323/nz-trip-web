const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== 行程 API =====

// 取得所有行程
app.get('/api/itinerary', (req, res) => {
  try {
    const items = db.itinerary.getAll();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 新增行程
app.post('/api/itinerary', (req, res) => {
  try {
    const { date, day_number, location, activity, driving_info, accommodation, notes, backup_plan } = req.body;
    db.itinerary.create(date, day_number, location, activity, driving_info || '', accommodation || '', notes || '', backup_plan || '');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 取得單筆行程
app.get('/api/itinerary/:id', (req, res) => {
  try {
    const { id } = req.params;
    const item = db.itinerary.getById(id);
    if (item) {
      res.json({ success: true, data: item });
    } else {
      res.status(404).json({ success: false, error: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 更新行程
app.put('/api/itinerary/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { date, day_number, location, activity, driving_info, accommodation, notes, backup_plan } = req.body;
    db.itinerary.update(id, date, day_number, location, activity, driving_info || '', accommodation || '', notes || '', backup_plan || '');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 刪除行程
app.delete('/api/itinerary/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.itinerary.delete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===== 花費 API =====

// 取得所有花費
app.get('/api/expenses', (req, res) => {
  try {
    const items = db.expenses.getAll();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 取得單筆花費
app.get('/api/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const item = db.expenses.getById(id);
    if (item) {
      res.json({ success: true, data: item });
    } else {
      res.status(404).json({ success: false, error: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 新增花費
app.post('/api/expenses', (req, res) => {
  try {
    const { date, category, amount, paid_by, description } = req.body;
    db.expenses.create(date, category, amount, paid_by, description || '');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 更新花費
app.put('/api/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { date, category, amount, paid_by, description } = req.body;
    db.expenses.update(id, date, category, amount, paid_by, description || '');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 刪除花費
app.delete('/api/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.expenses.delete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===== 預算 API =====

// 取得預算
app.get('/api/budget', (req, res) => {
  try {
    const items = db.budget.getAll();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 設定預算
app.post('/api/budget', (req, res) => {
  try {
    const { category, budget_amount } = req.body;
    db.budget.set(category, budget_amount);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 初始化預設行程資料
function initItinerary() {
  const existing = db.itinerary.getAll();
  if (existing.length > 0) return;

  const itineraryData = [
    { date: '2026-05-09', day: 1, location: '桃園機場', activity: '啟程', driving_info: '無 (搭機)', accommodation: '機上', notes: '搭乘 NZ78', backup: '' },
    { date: '2026-05-10', day: 2, location: '奧克蘭 → 基督城', activity: '抵達/轉機', driving_info: 'CHC 機場 ➔ 市區 (約 10km, 20分)', accommodation: '基督城市區飯店', notes: '09:20 抵達 AKL → 14:25 捷星國內線 → CHC → Riverside Market', backup: '' },
    { date: '2026-05-11', day: 3, location: '基督城 → 蒂卡波湖', activity: '取車出發', driving_info: 'CHC ➔ Castle Hill (95km, 1.5h) ➔ Tekapo (200km, 2.5h) | 本日總車程：約 4 小時', accommodation: 'Lake Tekapo M&H Park', notes: '10:00 取車 → 超市採購 → Castle Hill → Tekapo', backup: '出發若太晚果斷放棄巨石陣，走 SH1 直奔營地' },
    { date: '2026-05-12', day: 4, location: '蒂卡波湖', activity: '觀光', driving_info: '鎮上短途移動 (單趟約 5-10 分鐘)', accommodation: 'Lake Tekapo M&H Park', notes: '牧羊人教堂 → 午餐炸魚薯條 → Mt John 觀星團', backup: '觀星若因雲層太厚取消，改去 Tekapo Springs 泡溫泉' },
    { date: '2026-05-13', day: 5, location: '蒂卡波湖 → 庫克山', activity: '移動/觀光', driving_info: 'Tekapo ➔ Pukaki (50km, 45分) ➔ 庫克山 (55km, 50分) | 本日總車程：約 1.5-2 小時', accommodation: 'White Horse Hill 營地', notes: '普卡基湖(吃鮭魚) → Hooker Valley 冰河谷步道', backup: '若下雨改去隱士飯店喝下午茶看山景' },
    { date: '2026-05-14', day: 6, location: '庫克山', activity: '冰川健行', driving_info: '營地 ➔ 塔斯曼冰川 (8km, 15分) 園區內短途移動', accommodation: 'Glentanner 營地', notes: '塔斯曼冰川健行/遊船 → Kea Point Track', backup: '冰川極易因風大取消，立刻詢問能否改下午場或隔天' },
    { date: '2026-05-15', day: 7, location: '庫克山 → 瓦納卡', activity: '移動/觀光', driving_info: '庫克山 ➔ 鮭魚農場 (65km, 55分) ➔ Wanaka (140km, 2h) | 本日總車程：約 3 小時', accommodation: 'Wanaka Top 10', notes: 'High Country Salmon → Lindis Pass → 孤獨的樹', backup: '若遇道路結冰封路，需繞遠路經 SH82 等沿海公路' },
    { date: '2026-05-16', day: 8, location: '瓦納卡', activity: '觀光', driving_info: 'Wanaka ➔ 鑽石湖 (18km, 20分) ➔ 迷宮 (20km, 25分) | 本日總車程：約 1 小時內', accommodation: 'Wanaka Top 10', notes: '鑽石湖步道 → Puzzling World 迷宮 → 小鎮採買', backup: '大雨就去 Cinema Paradiso 復古電影院吃現烤餅乾' },
    { date: '2026-05-17', day: 9, location: '瓦納卡 → 皇后鎮', activity: '移動/觀光', driving_info: 'Wanaka ➔ 箭鎮 (55km, 1h) ➔ 皇后鎮 (20km, 25分) | 本日總車程：約 1.5 小時', accommodation: 'Queenstown Top 10', notes: '皇冠公路 → 箭鎮 Arrowtown → Skyline 纜車+Luge', backup: '若皇冠公路起大霧或低溫，改走 SH6 公路繞行' },
    { date: '2026-05-18', day: 10, location: '皇后鎮 / Glenorchy', activity: '觀光/活動', driving_info: '皇后鎮 ➔ Glenorchy (45km, 50分) ➔ 皇后鎮 (45km, 50分) | 本日總車程：約 1.5-2 小時', accommodation: 'Queenstown Top 10', notes: '最美公路 → Glenorchy → 騎馬行程 → Fergburger', backup: '大雨取消騎馬，改去 Fear Factory 或 iFly 室內跳傘' },
    { date: '2026-05-19', day: 11, location: '皇后鎮', activity: '觀光/活動', driving_info: '市區短途移動或搭乘接駁車', accommodation: 'Queenstown Top 10', notes: 'NZONE 跳傘 → 市區逛街 → Onsen 泡湯', backup: '跳傘若取消，改去 Deer Park Heights 餵動物' },
    { date: '2026-05-20', day: 12, location: '皇后鎮 → 米佛峽灣', activity: '一日遊', driving_info: '無 (搭乘觀光巴士) 單趟車程約 4-4.5 小時', accommodation: 'Queenstown Top 10', notes: '07:00 觀光巴士 → 峽灣遊船 → 傍晚返回', backup: '峽灣下雨更美，除非道路雪崩封閉否則風雨無阻' },
    { date: '2026-05-21', day: 13, location: '皇后鎮 → 丹尼丁', activity: '移動/觀光', driving_info: '皇后鎮 ➔ Cromwell (60km, 1h) ➔ 丹尼丁 (210km, 3h) | 本日總車程：約 4 小時', accommodation: 'Dunedin Holiday Park', notes: '跳傘補跳日 → Cromwell 水果 → 丹尼丁市區', backup: '若跳傘延到今天，抵達會很晚，直接回營地休息' },
    { date: '2026-05-22', day: 14, location: '丹尼丁 → 奧瑪魯', activity: '觀光', driving_info: '丹尼丁 ➔ 大圓石 (75km, 1h) ➔ 奧瑪魯 (40km, 35分) | 本日總車程：約 1.5 小時', accommodation: 'Oamaru Top 10', notes: '鮑德溫街 → Moeraki 大圓石 → 藍企鵝歸巢', backup: '大圓石需配合「退潮時間」才看得到全貌' },
    { date: '2026-05-23', day: 15, location: '奧瑪魯 → 阿卡羅阿', activity: '觀光', driving_info: '奧瑪魯 ➔ Akaroa (320km, 4.5-5h) | 本日總車程：約 5 小時', accommodation: 'Akaroa Top 10', notes: 'Oamaru 維多利亞區 → 班克斯半島 → Akaroa', backup: '半島山路若起大霧視線不佳，請放慢車速' },
    { date: '2026-05-24', day: 16, location: '阿卡羅阿 → 基督城 → 奧克蘭', activity: '移動', driving_info: 'Akaroa ➔ 基督城機場 (85km, 1.5h) | 本日總車程：約 1.5 小時', accommodation: '奧克蘭機場飯店', notes: '海豚遊船 → 開回基督城 → 還車 → 傍晚飛奧克蘭', backup: '遊船若取消就在小鎮漫步喝法式咖啡' },
    { date: '2026-05-25', day: 17, location: '奧克蘭', activity: '觀光/採買', driving_info: '搭乘大眾運輸/SkyBus', accommodation: '奧克蘭機場飯店', notes: 'SkyBus 市區 → 天空塔/伊甸山 → 採買伴手禮', backup: '不想進市區可去機場附近的 Dress Smart 暢貨中心' },
    { date: '2026-05-26', day: 18, location: '奧克蘭機場', activity: '賦歸', driving_info: '無 (搭機)', accommodation: '溫暖的家', notes: '07:00 報到 → 搭機直飛台灣', backup: '' }
  ];

  const stmt = db.itinerary.create;
  itineraryData.forEach(item => {
    stmt(item.date, item.day, item.location, item.activity, item.driving_info, item.accommodation, item.notes, item.backup);
  });
}

// 初始化預設花費資料
function initExpenses() {
  const existing = db.expenses.getAll();
  if (existing.length > 0) return;

  const expensesData = [
    { date: '2025-11-01', category: '機票', amount: 33200, paid_by: '小肉', desc: 'TPE⇆AKL' },
    { date: '2025-11-28', category: '機票', amount: 33000, paid_by: '小妞', desc: 'TPE⇆AKL' },
    { date: '2026-03-19', category: '機票', amount: 4730, paid_by: '小妞', desc: 'AKL→CHC' },
    { date: '2026-03-23', category: '住宿', amount: 1560, paid_by: '小肉', desc: '5/14營地' },
    { date: '2026-03-27', category: '體驗', amount: 9602, paid_by: '小肉', desc: '跳傘' },
    { date: '2026-03-27', category: '體驗', amount: 1298, paid_by: '小肉', desc: '通話網卡' },
    { date: '2026-03-27', category: '體驗', amount: 1977, paid_by: '小妞', desc: '無限網卡' },
    { date: '2026-03-27', category: '體驗', amount: 32586, paid_by: '小妞', desc: '冰川健行' },
    { date: '2026-03-30', category: '機票', amount: 7282, paid_by: '小肉', desc: 'CHC→AKL' },
    { date: '2026-03-31', category: '體驗', amount: 9738, paid_by: '小肉', desc: '峽灣' },
    { date: '2026-03-31', category: '交通', amount: 512, paid_by: '小肉', desc: '接駁巴士' },
    { date: '2026-04-01', category: '體驗', amount: 3415, paid_by: '小妞', desc: 'skyline' },
    { date: '2025-11-10', category: '住宿', amount: 3471, paid_by: '小肉', desc: '5/11.12營地' },
    { date: '2025-11-17', category: '住宿', amount: 4514, paid_by: '小肉', desc: '露營車訂金' }
  ];

  expensesData.forEach(item => {
    db.expenses.create(item.date, item.category, item.amount, item.paid_by, item.desc);
  });
}

initItinerary();
initExpenses();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎉 NZ Trip Web 運行中: http://0.0.0.0:${PORT}`);
});
