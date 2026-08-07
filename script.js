const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyNO4ASvWdge6Eut1y18htITpbhSBpXdni5bCicnix3ekh00DTogJtNxhKLfIhUeBJdZg/exec";

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

  // Создаем динамическую скрытую форму для отправки без CORS
  const iframeName = "hidden_iframe_" + Date.now();
  const iframe = document.createElement("iframe");
  iframe.name = iframeName;
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const hiddenForm = document.createElement("form");
  hiddenForm.method = "POST";
  hiddenForm.action = GOOGLE_SCRIPT_URL;
  hiddenForm.target = iframeName;

  // Добавляем поля
  const data = { name, relation, wish };
  for (const key in data) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = data[key];
    hiddenForm.appendChild(input);
  }

  document.body.appendChild(hiddenForm);
  hiddenForm.submit();

  // Показываем сообщение об успехе через 1 секунду
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

    // Удаляем временные элементы
    document.body.removeChild(hiddenForm);
    document.body.removeChild(iframe);
  }, 1000);
});
