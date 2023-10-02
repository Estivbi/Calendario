document.addEventListener("DOMContentLoaded", function () {
  const prevMonthButton = document.getElementById("prevMonth");
  const nextMonthButton = document.getElementById("nextMonth");
  const monthYearText = document.getElementById("monthYear");
  const calendarBody = document.getElementById("calendarBody");

  let currentDate = new Date();

  // Objeto para almacenar las tareas por día
  const tasksByDate = {};

  function generateCalendar(year, month) {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Obtén el día de la semana en el que comienza el mes (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
    const startDayOfWeek = firstDayOfMonth.getDay();

    let currentDate = new Date(firstDayOfMonth);
    currentDate.setDate(currentDate.getDate() - startDayOfWeek + 1); // +1 para ajustar al primer día del mes

    const calendarRows = [];

    while (currentDate <= lastDayOfMonth) {
      const weekRow = document.createElement("tr");

      for (let i = 0; i < 7; i++) {
        const dayCell = document.createElement("td");

        if (currentDate.getMonth() === month) {
          dayCell.textContent = currentDate.getDate();
          // Agregar una clase genérica para identificar las celdas de día
          dayCell.classList.add("day-cell");
          // Agregar un atributo de datos para identificar la fecha
          dayCell.dataset.date = currentDate.toISOString().split("T")[0];
        } else {
          // Los días fuera del mes actual pueden dejarse en blanco o deshabilitarse.
          // Puedes personalizar esto según tus necesidades.
          dayCell.classList.add("disabled");
        }

        weekRow.appendChild(dayCell);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      calendarBody.appendChild(weekRow);
    }
  }

  function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYearText.textContent = new Date(year, month).toLocaleDateString(
      "es-ES",
      { month: "long", year: "numeric" }
    );

    calendarBody.innerHTML = "";
    generateCalendar(year, month);
  }

  // Agregar un evento clic para permitir a los usuarios agregar tareas al hacer clic en un día
  calendarBody.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("day-cell")) {
      const date = target.dataset.date;

      // Verificar si ya existe un contenedor de tareas en el día actual
      let taskContainer = tasksByDate[date];
      if (!taskContainer) {
        taskContainer = document.createElement("div");
        taskContainer.classList.add("task-container");
        tasksByDate[date] = taskContainer;
      }

      // Crear un formulario dinámicamente
      const form = document.createElement("form");

      const taskInput = document.createElement("input");
      taskInput.type = "text";
      taskInput.placeholder = "Ingrese la tarea";

      const timeInput = document.createElement("input");
      timeInput.type = "text";
      timeInput.placeholder = "Ingrese la hora";

      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.textContent = "Guardar";
      saveButton.classList.add("save-button"); // Agrega la clase "save-button"

      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.textContent = "Cancelar";
      cancelButton.classList.add("cancel-button"); // Agrega la clase "cancel-button"

      form.appendChild(taskInput);
      form.appendChild(timeInput);
      form.appendChild(saveButton);
      form.appendChild(cancelButton);

      // Crear un contenedor para el número del día y las tareas
      const dayContainer = document.createElement("div");

      // Mantener el número del día visible
      const dayNumber = document.createElement("div");
      dayNumber.textContent = target.textContent;
      dayNumber.classList.add("day-number");

      // Agregar el número del día al contenedor
      dayContainer.appendChild(dayNumber);

      // Evento clic en el botón "Guardar" para guardar la tarea
      saveButton.addEventListener("click", function () {
        const task = taskInput.value;
        const time = timeInput.value;

        if (task && time) {
          // Crear un elemento de tarea para agregar al día del calendario
          const taskElement = document.createElement("div");
          taskElement.classList.add("task");
          taskElement.innerHTML = `<strong>${time}</strong>: ${task}`;

          // Agregar la tarea al día del calendario
          taskContainer.appendChild(taskElement);

          // Limpiar el formulario y ocultarlo
          taskInput.value = "";
          timeInput.value = "";
          form.style.display = "none";
        }
      });

      // Evento clic en el botón "Cancelar" para ocultar el formulario
      cancelButton.addEventListener("click", function () {
        // Ocultar el formulario
        form.style.display = "none";
      });

      // Mostrar el formulario y el contenedor de tareas
      form.style.display = "block";

      // Limpiar la celda y agregar el formulario y el contenedor de tareas
      target.appendChild(form);
      target.appendChild(taskContainer);
    }
  });

  prevMonthButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
  });

  nextMonthButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
  });

  // Llama a updateCalendar para inicializar el calendario
  updateCalendar();
});
