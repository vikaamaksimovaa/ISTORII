
const Database = require("better-sqlite3");
const path = require("node:path");

// Открываем базу данных или создаём её, если её ещё нет.
const db = new Database(path.join(__dirname, "istorii.db"));

// Создаём таблицу с товарами меню.
db.exec(`
    CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL
    )
`);

// Проверяем, есть ли товары в меню.
const count = db.prepare(
    "SELECT COUNT(*) AS total FROM menu"
).get();

if (count.total === 0) {
    const insert = db.prepare(`
        INSERT INTO menu (name, description, price, category)
        VALUES (?, ?, ?, ?)
    `);

    insert.run(
        "Капучино",
        "Эспрессо и нежная молочная пена",
        250,
        "Кофе"
    );

    insert.run(
        "Латте",
        "Мягкий вкус кофе и молока",
        280,
        "Кофе"
    );

    insert.run(
        "Чизкейк",
        "Нежный десерт к любимому напитку",
        320,
        "Десерты"
    );
}

// Делаем базу доступной для других файлов проекта.
module.exports = db;
