let inputValue = document.querySelector('#todoInput');
let addBtn = document.querySelector('.addBtn');
let taskBox = document.querySelector('.taskBox');
let totalTasks = document.querySelector('.totalTasks');
let dayBtn = document.querySelector('#day');
let nightBtn = document.querySelector('#night');
let nightModeToggler = document.querySelector('.nightmode-toggler');
let completedTasks = document.querySelector('.completedTasks');
let userName = document.querySelector('.userName');

userName.value = JSON.parse(localStorage.getItem('user'));

userName.addEventListener('change', function() {
    localStorage.setItem('user', JSON.stringify(userName.value));
})

dayBtn.addEventListener('click', () => {
    document.body.style.filter = 'invert(1) hue-rotate(200deg)';
})

nightBtn.addEventListener('click', () => {
    document.body.style.filter = '';
})


let allTodos = [];

addBtn.addEventListener('click', function() {
    addTodo(inputValue.value);
})

// To Add an item to our todo list app
function addTodo(item) {
    console.log("Todo Item function");
    if (item !== "") {
        let singleTask = {
            taskId: Date.now(),
            taskName: inputValue.value,
            isCompleted: false,
        }
        allTodos.push(singleTask);
        // renderTodos(allTodos);
        addToLocalStorage(allTodos);

        inputValue.value = '';
    } else {
        alert("Enter something to proceed");
        return;
    }
}

// To Render all items to our todo list app
function renderTodos(allTodos) {
    totalTasks.innerHTML = `Total Tasks: ${allTodos.length}`;
    completedTasks.innerHTML = ``;

    console.log("All Todo function");
    taskBox.innerHTML = '';

    allTodos.forEach((item) => {
        let checked = item.isCompleted ? 'checked' : null;

        const taskVal = inputValue.value;
        const taskElem = document.createElement("div");
        taskElem.setAttribute('data-key', item.taskId);
        taskElem.classList.add("task");

        const taskInput = document.createElement("input");
        taskInput.setAttribute("type", "checkbox");
        item.isCompleted ? taskInput.setAttribute('checked', 'checked') : '';

        const taskLabel = document.createElement("input");
        taskLabel.setAttribute('class', 'text');
        taskLabel.setAttribute('type', 'text');

        taskLabel.setAttribute('readonly', 'readonly');
        taskLabel.value = item.taskName;

        const taskEditSaveBtn = document.createElement("button");
        taskEditSaveBtn.classList.add("taskEditSaveBtn");
        taskEditSaveBtn.innerText = "Edit";

        const taskDoneBtn = document.createElement("button");
        taskDoneBtn.classList.add("taskDone");
        taskDoneBtn.innerText = "Delete";

        taskElem.appendChild(taskInput);
        taskElem.appendChild(taskLabel);
        taskElem.appendChild(taskDoneBtn);
        taskElem.appendChild(taskEditSaveBtn);

        taskBox.insertAdjacentElement('afterbegin', taskElem)
    })
}

// To Add to localStorage all items of our todo list app
function addToLocalStorage(allTodos) {
    console.log("Add to Local Storage function");
    localStorage.setItem("allTodos", JSON.stringify(allTodos));
    renderTodos(allTodos);
}


// To Get from localStorage of our todo list app
function getFromLocalStorage() {
    console.log("Get from Local Storage function");
    let taskOfLocalStorage = localStorage.getItem("allTodos");
    if (taskOfLocalStorage) {
        allTodos = JSON.parse(taskOfLocalStorage);
    }
    renderTodos(allTodos);
}

getFromLocalStorage();


// To Check/unCheck an item of our todo list app
function toggle(id) {
    console.log('Toggled');
    allTodos.map(task => {
        if (task.taskId === id) {
            if (!task.isCompleted) {
                task.isCompleted = true;
            } else {
                task.isCompleted = false;
            }
        }
    })
    addToLocalStorage(allTodos);
}


// To Edit an item of our todo list app

function editTodo(id, updatedTask) {
    allTodos.forEach(task => {
        if (task.taskId == id) {
            task.taskName = updatedTask;
        }
    })
    addToLocalStorage(allTodos);
}


// To Delete an item of our todo list app
function deleteTodo(id) {
    console.log('deleted');
    if (confirm('Are you sure?')) {
        allTodos = allTodos.filter(function(tasks) {
            return tasks.taskId !== id;
        })
    }

    addToLocalStorage(allTodos);
}


taskBox.addEventListener('click', function(event) {
    if (event.target.className === 'taskDone') {
        let dataKey = event.path.find(elem => elem.className === 'task');
        let deleteId = +dataKey.getAttribute('data-key');
        deleteTodo(deleteId);
    }

    let editId = 0;
    if (event.target.className === 'taskEditSaveBtn') {
        // console.log('Edit and Save button clicked');
        let dataKey = event.path.find(elem => elem.className === 'task');
        editId = +dataKey.getAttribute('data-key');

        console.log(event.path[1].childNodes[0].hasAttribute === 'checked')

        if (event.target.innerHTML === 'Edit') {
            event.path[1].childNodes[1].removeAttribute('readonly')
            event.path[1].childNodes[1].setSelectionRange(0, event.path[1].childNodes[1].innerHTML.length - 1);
            event.path[1].childNodes[1].focus();
            event.target.innerHTML = 'Save';

        } else if (event.target.innerHTML === 'Save') {
            let editedTask = event.path[1].childNodes[1].value;
            event.path[1].childNodes[1].setAttribute('readonly', 'readonly')
            editTodo(editId, editedTask);
        }


    }


    if (event.target.type === 'checkbox') {
        event.target.setAttribute('checked', 'checked');
        let dataKey = event.path.find(elem => elem.className === 'task');
        toggleId = +dataKey.getAttribute('data-key');

        toggle(toggleId)
    } else {
        event.target.removeAttribute('checked')
    }

})