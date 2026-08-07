const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz4j7NQ-288IMgDDBtVxcjOUX0RUUB2XyYqC3Jmc5UPzyqwA4-tcWCE6JNCVTo7NEi9/exec";

const form = document.getElementById("toast-form");
const toast = document.getElementById("toast");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("guest-name").value.trim();
  const relation = document.getElementById("guest-relation").value.trim();
  const wish = document.getElementById("guest-wish").value.trim();

  if (!name || !relation || !wish) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Отправка...";

  // Формируем параметры для GET-запроса через URL
  const params = new URLSearchParams({
    name: name,
    relation: relation,
    wish: wish
  });

  // Отправляем запрос с помощью скрытого изображения (гарантированно работает на всех телефонах)
  const img = new Image();
  img.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;

  // Показываем плашку об успехе
  setTimeout(() => {
    if (toast) {
      toast.style.display = "block";
      setTimeout(() => {
        toast.style.display = "none";
      }, 4000);
    }
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить поздравление";
  }, 800);
});
