const addTaskBtn = document.querySelector("#add-task-btn");
const deskTaskInput = document.querySelector("#description-task");
const tasksWrapper = document.querySelector(".tasks-wrapper");

let tasks;
//загружаем список задач из localStorage
!localStorage.tasks ? (tasks = []) : (tasks = JSON.parse(localStorage.getItem("tasks")));

let taskItemElements = [];

//функция-конструктор для создания задачи
function Task(description) {
  this.description = description;
  this.completed = false;
}

//функция, реализующая шаблон одной задачи
const createTemplate = (task, index) => {
  return `
    <div class="task-item ${task.completed ? "checked" : ""}">
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

//функция заполнения задач на странице
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
addTaskBtn.addEventListener("click", () => {
  tasks.push(new Task(deskTaskInput.value));
  updateLocalStorage();
  updateHtmlList();
  deskTaskInput.value = "";
});
