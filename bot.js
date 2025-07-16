const { Telegraf } = require('telegraf');
const fs = require('fs');

const bot = new Telegraf(process.env.TOKEN); // توکن از متغیر محیطی

// بارگذاری دیتابیس از فایل
let data = {};
const dbPath = 'db.json';
if (fs.existsSync(dbPath)) {
  data = JSON.parse(fs.readFileSync(dbPath));
}

// تابع ذخیره دیتا
function saveData() {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// شروع به کار ربات
bot.start((ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;
  if (!data[userId]) {
    data[userId] = { username, score: 0 };
    saveData();
  }

  ctx.reply(`سلام ${username}! 👋

تو به ربات هخامنشی پیوستی.
برای جمع‌آوری امتیاز، از دوستات دعوت کن که روی لینک تو کلیک کنن!

🔗 لینک اختصاصی تو:
https://t.me/binesh_beyzaii_bot?start=${userId}
  `);
});

// وقتی کسی با لینک معرف وارد میشه
bot.command('start', (ctx) => {
  const parts = ctx.message.text.split(' ');
  const referrerId = parts[1];

  const userId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;

  if (!data[userId]) {
    data[userId] = { username, score: 0 };
  }

  if (referrerId && referrerId !== String(userId)) {
    if (data[referrerId]) {
      data[referrerId].score += 1;
      ctx.telegram.sendMessage(referrerId, `🎉 یه نفر جدید با لینک تو عضو شد! امتیازت شد ${data[referrerId].score}`);
    }
  }

  saveData();
  ctx.reply('✅ ورود موفق! خوش اومدی.');
});

// نمایش امتیاز
bot.command('score', (ctx) => {
  const userId = ctx.from.id;
  const user = data[userId];
  if (user) {
    ctx.reply(`امتیاز تو: ${user.score}`);
  } else {
    ctx.reply('ثبت‌نام نکردی! اول /start بزن.');
  }
});

// اجرای ربات
bot.launch();
console.log('🤖 ربات هخامنشی راه افتاد...');
