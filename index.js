const taskInput = document.querySelector(".input_task");
const dueTaskSection = document.querySelector(".due .tasks");
const progressTaskSection = document.querySelector(".progress .tasks");
const doneTaskSection = document.querySelector(".done .tasks");
const backlogTaskSection = document.querySelector(".backlog .tasks");
const addTaskButton = document.querySelector(".add_task");
let today = new Date().toISOString().split("T")[0];
let taskId = 0;
let tasks = [];

// Clear localStorage if needed for testing
// localStorage.clear();

addTaskButton.addEventListener("click", () => {
  let taskValue = taskInput.value.trim();

  taskId++;

  let taskHTML = `
    <div class="task" id="task-${taskId}" draggable="true" ondragstart="drag(event)">
        <p>${taskValue}</p>
        <button onclick="deleteTask(this)" class="delete-btn"></button>
    </div>`;

  dueTaskSection.insertAdjacentHTML("beforeend", taskHTML);

  taskInput.value = "";
  tasks.push({
    id: `task-${taskId}`,
    text: taskHTML,
    date: today,
    done: false,
  });
  saveToLocal();
});

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("task", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();

  const data = ev.dataTransfer.getData("task");
  const task = document.getElementById(data);

  ev.currentTarget.appendChild(task);
  if (ev.currentTarget === doneTaskSection) {
    console.log(JSON.stringify(task));

    let filterTasks = tasks.filter((t) => task.id !== t.id);
    tasks = [...filterTasks];
  }
  saveToLocal();
}

function deleteTask(button) {
  const parentRef = button.parentElement;
  parentRef.remove();
  filterTasks = tasks.filter((t) => t.id !== parentRef.id);
  saveToLocal();
}

function saveToLocal() {
  let dueTasks = dueTaskSection.innerHTML;
  let progressTasks = progressTaskSection.innerHTML;
  let doneTasks = doneTaskSection.innerHTML;
  localStorage.setItem("due", dueTasks);
  localStorage.setItem("progress", progressTasks);
  localStorage.setItem("done", doneTasks);
  localStorage.setItem("tasks_data", JSON.stringify(tasks));
}

function loadTasksFromLocal() {
  dueTaskSection.innerHTML = localStorage.getItem("due");
  progressTaskSection.innerHTML = localStorage.getItem("progress");
  doneTaskSection.innerHTML = localStorage.getItem("done");
  backlogTaskSection.innerHTML = localStorage.getItem("backlog");

  loadTaskData();

  const backlogTasks = tasks.filter((t) => !t.done && t.date !== today);
  backlogTasks.forEach((task) => {
    let taskHTML = task.text;
    backlogTaskSection.insertAdjacentHTML("beforeend", taskHTML);
  });
}

function loadTaskData() {
  const tasksData = JSON.parse(localStorage.getItem("tasks_data")) || [];
  tasks = [...tasksData];
  if (tasks.length > 0) {
    taskId = Math.max(...tasks.map((t) => t.id));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocal();
});
