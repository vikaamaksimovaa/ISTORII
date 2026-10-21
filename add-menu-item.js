
const db = require("./database");

// Получаем данные нового товара из команды в терминале.
const [, , name, description, priceText, category] = process.argv;

if (!name || !description || !priceText || !category) {
    console.log(
        'Пример: node add-menu-item.js "Американо" "Кофе без молока" 200 "Кофе"'
    );
    process.exitCode = 1;
} else {
    const price = Number(priceText);

    if (!Number.isFinite(price) || price <= 0) {
        console.error("Цена должна быть числом больше нуля.");
        process.exitCode = 1;
    } else {
        const insert = db.prepare(`
            INSERT INTO menu (name, description, price, category)
            VALUES (?, ?, ?, ?)
        `);

        insert.run(name, description, price, category);

        console.log(`Товар "${name}" добавлен в меню!`);
    }
}

db.close();
