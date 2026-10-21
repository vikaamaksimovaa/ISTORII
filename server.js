
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

// Подключаем базу данных SQLite.
const db = require("./database");

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

// Создаём сервер сайта ISTORII.
const server = http.createServer((req, res) => {
    const url = new URL(
        req.url,
        `http://${req.headers.host || "localhost"}`
    );

    // API: получаем меню из базы данных.
    if (url.pathname === "/api/menu") {
        try {
            const menu = db.prepare(
                "SELECT * FROM menu"
            ).all();

            res.writeHead(200, {
                "Content-Type": "application/json; charset=utf-8"
            });

            res.end(JSON.stringify(menu));
        } catch (error) {
            console.error("Ошибка чтения меню:", error);

            res.writeHead(500, {
                "Content-Type": "application/json; charset=utf-8"
            });

            res.end(JSON.stringify({
                error: "Не удалось загрузить меню"
            }));
        }

        return;
    }

    // Главная страница и статические файлы сайта.
    let filePath = url.pathname === "/"
        ? path.join(PUBLIC_DIR, "index.html")
        : path.resolve(PUBLIC_DIR, "." + decodeURIComponent(url.pathname));

    // Не разрешаем обращаться к файлам за пределами public.
    if (
        filePath !== PUBLIC_DIR &&
        !filePath.startsWith(PUBLIC_DIR + path.sep)
    ) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    const contentTypes = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8"
    };

    fs.readFile(filePath, (error, content) => {
        if (error) {
            const statusCode = error.code === "ENOENT" ? 404 : 500;

            res.writeHead(statusCode, {
                "Content-Type": "text/plain; charset=utf-8"
            });

            res.end(
                statusCode === 404
                    ? "Файл не найден"
                    : "Ошибка сервера"
            );

            return;
        }

        const extension = path.extname(filePath);

        res.writeHead(200, {
            "Content-Type":
                contentTypes[extension] || "application/octet-stream"
        });

        res.end(content);
    });
});

// Запускаем сервер.
server.listen(PORT, () => {
    console.log(`ISTORII работает: http://localhost:${PORT}`);
});
