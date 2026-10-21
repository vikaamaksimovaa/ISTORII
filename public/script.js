
/**
 * Загружает меню кофейни ISTORII из базы данных
 * через API сервера и отображает товары на странице.
 */

async function loadMenu() {
    const menuContainer = document.querySelector("#menu-container");

    if (!menuContainer) {
        console.error("Не найден контейнер меню #menu-container");
        return;
    }

    menuContainer.textContent = "Загружаем меню...";

    try {
        // Получаем товары из базы данных через сервер.
        const response = await fetch("/api/menu");

        if (!response.ok) {
            throw new Error("Не удалось получить меню");
        }

        const menuItems = await response.json();

        // Очищаем контейнер перед отображением товаров.
        menuContainer.replaceChildren();

        if (menuItems.length === 0) {
            menuContainer.textContent = "Меню пока пустое.";
            return;
        }

        // Создаём карточку для каждого товара.
        menuItems.forEach((item) => {
            const card = document.createElement("article");
            card.className = "menu-card";

            const title = document.createElement("h3");
            title.textContent = item.name;

            const description = document.createElement("p");
            description.textContent = item.description;

            const category = document.createElement("p");
            category.className = "menu-category";
            category.textContent = item.category;

            const price = document.createElement("p");
            price.className = "menu-price";
            price.textContent = `${item.price} ₽`;

            card.append(title, description, category, price);
            menuContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Ошибка загрузки меню:", error);
        menuContainer.textContent =
            "Не удалось загрузить меню. Попробуйте обновить страницу.";
    }
}

// Загружаем меню после подготовки HTML-страницы.
document.addEventListener("DOMContentLoaded", loadMenu);
