import Sortable from "sortablejs";

const themeButton = document.getElementById("theme-btn");
const darkTheme = "dark";
const iconTheme = "icon-sun";

const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";

const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "icon-moon" : "icon-sun";

if (selectedTheme) {
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    darkTheme
  );

  themeButton.classList[selectedIcon === "icon-moon" ? "add" : "remove"](
    iconTheme
  );
}

themeButton.addEventListener("click", () => {
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);

  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});

const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const btnsFilters = document.querySelectorAll(".todo__filter");
const btnAll = document.getElementById("filter-all");
const btnActive = document.getElementById("filter-active");
const btnCompleted = document.getElementById("filter-completed");
const btnClearCompleted = document.getElementById("clear-completed");

let statusFilter = "all";

let allTodos = getTodos();
updateTodoList(allTodos);

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
});

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    const todoObject = {
      text: todoText,
      completed: false,
      id: generarIdSimple(),
    };

    allTodos.push(todoObject);
    updateTodoList(allTodos);
    saveTodos();
    itemsLeft();
    todoInput.value = "";
  }
}

function updateTodoList() {
  let arr = allTodos;
  if (statusFilter === "all") {
    allTodos;
  }

  if (statusFilter === "active") {
    arr = allTodos.filter((e) => e.completed === false);
  }

  if (statusFilter === "completed") {
    arr = allTodos.filter((e) => e.completed === true);
  }

  todoList.innerHTML = "";
  arr.forEach((todo, todoIndex) => {
    let todoItem = createTodoItem(todo, todoIndex);
    todoList.append(todoItem);
  });
}

function createTodoItem(todo) {
  const todoId = "todo-" + todo.id;
  const todoLI = document.createElement("li");
  const todoText = todo.text;
  todoLI.className = "todo__item";
  todoLI.dataset.identifier = `${todoId}`;
  todoLI.innerHTML = `
            <input class="todo__checkbox" type="checkbox" id="${todoId}" />
            <label class="todo__custom-checkbox circle" for="${todoId}">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
                <path
                  fill="none"
                  stroke="#FFF"
                  stroke-width="2"
                  d="M1 4.304L3.696 7l6-6"
                />
              </svg>
            </label>
            <label for="${todoId}" class="todo__text">
              ${todoText}
            </label>

            <button class="todo__btn-delete">
              <img src="/images/icon-cross.svg" alt="icon cross" />
            </button>
          `;
  const deleteButton = todoLI.querySelector(".todo__btn-delete");
  deleteButton.addEventListener("click", () => {
    deleteTodoItem(todoId);
  });

  const checkbox = todoLI.querySelector("input");
  checkbox.addEventListener("change", (e) => {
    let ID = e.target.id.split("-")[1];
    let arr = allTodos.find((todo) => todo.id === ID);
    arr.completed = checkbox.checked;
    saveTodos();
    updateTodoList();
    itemsLeft();
  });

  checkbox.checked = todo.completed;
  return todoLI;
}

function deleteTodoItem(todoId) {
  let ID = todoId.split("-")[1];
  allTodos = allTodos.filter((e) => e.id !== ID);
  saveTodos();
  updateTodoList();
  itemsLeft();
}

function saveTodos(arr) {
  const todosJson = JSON.stringify(arr ? arr : allTodos);
  localStorage.setItem("todos", todosJson);
}

function getTodos() {
  if (localStorage.getItem("todos") === null) {
    localStorage.setItem(
      "todos",
      JSON.stringify([
        {
          text: "Complete online JavaScript course",
          completed: true,
          id: "0",
        },
        {
          text: "Jog around the park 3x",
          completed: false,
          id: "1",
        },
        {
          text: "10 minutes meditation",
          completed: false,
          id: "2",
        },
        { text: "Read for 1 hour", completed: false, id: "3" },
        { text: "Pick up groceries", completed: false, id: "4" },
        {
          text: "Complete Todo App on Frontend Mentor",
          completed: false,
          id: "5",
        },
      ])
    );
  }
  const todos = localStorage.getItem("todos");
  return JSON.parse(todos);
}

btnAll.addEventListener("click", () => {
  filterAllTodos();
  clearClassActive();
  btnAll.classList.add("active");
});

btnActive.addEventListener("click", () => {
  filterActiveTodos();
  clearClassActive();
  btnActive.classList.add("active");
});

btnCompleted.addEventListener("click", () => {
  filterCompletedTodos();
  clearClassActive();
  btnCompleted.classList.add("active");
});

btnClearCompleted.addEventListener("click", clearCompleted);

function filterAllTodos() {
  statusFilter = "all";
  updateTodoList();
}

function filterActiveTodos() {
  statusFilter = "active";
  updateTodoList();
}

function filterCompletedTodos() {
  statusFilter = "completed";
  updateTodoList();
}

function clearClassActive() {
  btnsFilters.forEach((btn) => {
    btn.classList.remove("active");
  });
}

function generarIdSimple() {
  return Date.now().toString(30);
}

function itemsLeft() {
  let itemsLeft = document.getElementById("todo-itemsLeft");
  let numItemsLeft = allTodos.filter((e) => e.completed === false).length;
  itemsLeft.textContent = `${numItemsLeft} items left`;
}

function clearCompleted() {
  allTodos = allTodos.filter((e) => e.completed === false);
  saveTodos();
  updateTodoList();
}

function newOrder(a, b) {
  if (statusFilter !== "all") return;

  let newA = b.map((e) => e.split("-")[1]);
  let sortedUsers = newA.map((id) => {
    return a.find((todo) => todo.id === id);
  });
  return sortedUsers;
}

Sortable.create(todoList, {
  animation: 150,
  chosenClass: "seleccionado",
  dragClass: "drag",
  dataIdAttr: "data-identifier",
  store: {
    set: function (sortable) {
      const order = sortable.toArray();
      saveTodos(newOrder(allTodos, order));
    },
  },
});
