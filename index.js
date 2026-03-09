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
  if(taskValue === ""){
    return;
  }
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
    text: taskValue,
    date: today,
    status: "due",
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

  if(ev.currentTarget === dueTaskSection){
    for (let t of tasks) {
      if(t.id === task.id){
        t.status = "due";
        t.date = today;
      }
    }
  }

  if(ev.currentTarget === progressTaskSection){
    for (let t of tasks) {
      if(t.id === task.id){
        t.status = "progress";
        t.date = today;
      }
    }
  }

  if(ev.currentTarget === doneTaskSection){
    for (let t of tasks) {
      if(t.id === task.id){
        t.status = "done";
        t.date = today;
      }
    }
  }
  saveToLocal();
}

function deleteTask(button) {
  const parentRef = button.parentElement;
  parentRef.remove();
  tasks = tasks.filter((t) => t.id !== parentRef.id);
  saveToLocal();
}

function saveToLocal() {
  localStorage.setItem("tasks_data", JSON.stringify(tasks));
}

function loadTasksFromLocal() {
  loadTaskData();
  console.log(tasks);
  
  tasks.forEach((task) => {

    let taskHTML = `
    <div class="task" id="${task.id}" draggable="true" ondragstart="drag(event)">
        <p>${task.text}</p>
        <button onclick="deleteTask(this)" class="delete-btn"></button>
    </div>`;

    if (task.status !== "done" && task.date !== today) {
      backlogTaskSection.insertAdjacentHTML("beforeend", taskHTML);
    }

    else if (task.status === "due") {
      dueTaskSection.insertAdjacentHTML("beforeend", taskHTML);
    }

    else if (task.status === "progress") {
      progressTaskSection.insertAdjacentHTML("beforeend", taskHTML);
    }

    else if (task.status === "done") {
      doneTaskSection.insertAdjacentHTML("beforeend", taskHTML);
    }
  });
}

function loadTaskData() {
  const tasksData = JSON.parse(localStorage.getItem("tasks_data")) || [];
  tasks = [...tasksData];
  if (tasks.length > 0) {
    taskId = Math.max(...tasks.map((t) => Number(t.id.split("-")[1])));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocal();
});
