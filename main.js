const addTaskBtn = document.querySelector("#add-task-btn");
const deskTaskInput = document.querySelector("#description-task");
const tasksWrapper = document.querySelector(".tasks-wrapper");

//инициализируем массив tasks, или загружаем из localStorage
let tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];

let taskItemElements = [];

//функция-конструктор для создания задачи
function Task(description) {
  this.description = description;
  this.completed = false;
}

//функция, реализующая шаблон одной задачи
const createTemplate = (task, index) => {
  return `
    <div class="task-item ${task.completed ? "checked" : ""}" draggable="true">
      <div class="description">${task.description}</div>
      <div class="buttons">
        <input onClick="completeTask(${index})" type="checkbox" class="btn-complete" ${
    task.completed ? "checked" : ""
  }/>
        <button onClick="deleteTask(${index})" class="btn-delete">Удалить</button>
      </div>
    </div>
  `;
};

//функция сортировки задач
const filterTasks = () => {
  const activeTasks = tasks.length && tasks.filter((item) => item.completed == false);
  const completedTasks = tasks.length && tasks.filter((item) => item.completed == true);
  tasks = [...activeTasks, ...completedTasks];
};

//функция обновления списка задач на странице
const updateHtmlList = () => {
  tasksWrapper.innerHTML = "";
  if (tasks.length > 0) {
    filterTasks();
    tasks.forEach((item, index) => {
      tasksWrapper.innerHTML += createTemplate(item, index);
    });
    taskItemElements = document.querySelectorAll(".task-item");
  }
};

updateHtmlList();

const updateLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//функция смена отображения выполненной задачи
const completeTask = (index) => {
  tasks[index].completed = !tasks[index].completed;
  if (tasks[index].completed) {
    taskItemElements[index].classList.toggle("checked");
  } else {
    taskItemElements[index].classList.toggle("checked");
  }
  updateLocalStorage();
  updateHtmlList();
};

//функция удаления задачи
const deleteTask = (index) => {
  taskItemElements[index].classList.add("delition");
  setTimeout(() => {
    tasks.splice(index, 1);
    updateLocalStorage();
    updateHtmlList();
  }, 500);
};

//обработчик клика по кнопке добавления задачи
addTaskBtn.addEventListener("click", addNewTask);

//обработчик нажатия на клавишу Enter для добавления задачи
deskTaskInput.addEventListener("keydown", (event) => {
  if (deskTaskInput.value.length > 0 && event.key === "Enter") {
    addNewTask();
  }
});

//обработчик начала перетаскивания
tasksWrapper.addEventListener("dragstart", (event) => {
  event.target.classList.add("selected");
});

//обработчик конца перетаскивания
tasksWrapper.addEventListener("dragend", (event) => {
  event.target.classList.remove("selected");
});

const getNextElement = (cursorPosition, currentElement) => {
  // Получаем объект с размерами и координатами
  const currentElementCoord = currentElement.getBoundingClientRect();
  // Находим вертикальную координату центра текущего элемента
  const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

  // Если курсор выше центра элемента, возвращаем текущий элемент
  // В ином случае — следующий DOM-элемент
  const nextElement = cursorPosition < currentElementCenter ? currentElement : currentElement.nextElementSibling;

  return nextElement;
};

//обработчик логики перетаскивания
tasksWrapper.addEventListener("dragover", (event) => {
  event.preventDefault();

  //находим перемещаемый элемент
  const activeElement = tasksWrapper.querySelector(".selected");
  //находим элемент, над которым в данный момент находится курсор
  const currentElement = event.target;
  const isMoveable = activeElement !== currentElement && currentElement.classList.contains("task-item");

  if (!isMoveable) {
    return;
  }

  // evt.clientY — вертикальная координата курсора в момент,
  // когда сработало событие
  const nextElement = getNextElement(event.clientY, currentElement);

  // Проверяем, нужно ли менять элементы местами
  if ((nextElement && activeElement === nextElement.previousElementSibling) || activeElement === nextElement) {
    // Если нет, выходим из функции, чтобы избежать лишних изменений в DOM
    return;
  }

  tasksWrapper.insertBefore(activeElement, nextElement);
});

function addNewTask() {
  tasks.push(new Task(deskTaskInput.value));
  updateLocalStorage();
  updateHtmlList();
  deskTaskInput.value = "";
}
