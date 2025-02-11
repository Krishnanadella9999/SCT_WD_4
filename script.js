document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    checkReminders();
});

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskTime = document.getElementById("taskTime");
    let taskText = taskInput.value.trim();
    let taskDateTime = taskTime.value;

    if (taskText === "" || taskDateTime === "") return;

    let task = { text: taskText, completed: false, time: taskDateTime };
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
    taskTime.value = "";
    renderTasks();
}

function renderTasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.className = task.completed ? "completed" : "";
        
        let taskText = document.createElement("span");
        taskText.textContent = task.text;
        taskText.onclick = () => toggleComplete(index);

        let timeText = document.createElement("span");
        timeText.className = "time";
        timeText.textContent = `⏰ ${formatDateTime(task.time)}`;

        let buttonContainer = document.createElement("div");
        buttonContainer.className = "task-buttons";

        let editBtn = document.createElement("button");
        editBtn.className = "edit";
        editBtn.textContent = "✏️";
        editBtn.onclick = () => editTask(index);

        let deleteBtn = document.createElement("button");
        deleteBtn.className = "delete";
        deleteBtn.textContent = "❌";
        deleteBtn.onclick = () => deleteTask(index);

        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(deleteBtn);

        li.appendChild(taskText);
        li.appendChild(timeText);
        li.appendChild(buttonContainer);

        taskList.appendChild(li);
    });
}

function formatDateTime(dateTimeStr) {
    let dateObj = new Date(dateTimeStr);
    let day = String(dateObj.getDate()).padStart(2, '0');
    let month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    let year = dateObj.getFullYear();

    let hours = dateObj.getHours();
    let minutes = String(dateObj.getMinutes()).padStart(2, '0');
    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
}

function toggleComplete(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function editTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let newTaskText = prompt("Edit your task:", tasks[index].text);
    
    if (newTaskText !== null) {
        tasks[index].text = newTaskText;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function loadTasks() {
    renderTasks();
}

function checkReminders() {
    setInterval(() => {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        let now = new Date().getTime();

        tasks.forEach((task, index) => {
            let taskTime = new Date(task.time).getTime();
            if (!task.completed && taskTime <= now) {
                showNotification(task.text);
                tasks[index].completed = true;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                renderTasks();
            }
        });
    }, 60000); // Check every minute
}

function showNotification(taskText) {
    if (Notification.permission === "granted") {
        new Notification("Reminder! ⏰", { body: `Task: ${taskText}`, icon: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png" });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showNotification(taskText);
            }
        });
    }
}
