const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyNO4ASvWdge6Eut1y18htITpbhSBpXdni5bCicnix3ekh00DTogJtNxhKLfIhUeBJdZg/exec";

const form = document.getElementById("toast-form");
const toast = document.getElementById("toast");
const submitBtn = document.getElementById("submit-btn");

// ----------------------
// Отправка формы в Google Таблицу
// ----------------------
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("guest-name").value.trim();
    const relation = document.getElementById("guest-relation").value.trim();
    const wish = document.getElementById("guest-wish").value.trim();

    if (!name || !relation || !wish) return;

    // Блокируем кнопку на время отправки
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            redirect: "follow",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                name: name,
                relation: relation,
                wish: wish
            })
        });

        // Показываем плашку «Спасибо за поздравление»
        if (toast) {
            toast.style.display = "block";
            setTimeout(() => {
                toast.style.display = "none";
            }, 4000);
        }

        form.reset();
    } catch (err) {
        console.error("Ошибка при отправке в Google Таблицу:", err);
        alert("Произошла ошибка при отправке. Попробуйте еще раз.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Отправить поздравление";
    }
});
