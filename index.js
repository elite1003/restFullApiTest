const axiosInstance = axios.create({
  baseURL: "https://crudcrud.com/api/fc0a32627b594508a3e6e006a772bb1b",
});

let data = [];
document.addEventListener("DOMContentLoaded", function () {
  axiosInstance
    .get("/todoData")
    .then((res) => {
      data = res.data;
      for (let i = 0; i < data.length; i++) showTodo(data[i]);
    })
    .catch((err) => console.log(err));
});

const form = document.getElementById("todoForm");
const todoListRemaining = document.getElementById("todoListRemaining");
const todoListDone = document.getElementById("todoListDone");

function handleSubmit(e) {
  e.preventDefault();
  console.log("submit");
  const todoName = e.target.todoName.value;
  const description = e.target.description.value;
  const todo = {
    todoName,
    description,
    isDone: false,
  };
  axiosInstance
    .post("/todoData", todo)
    .then((res) => {
      showTodo(res.data);
      data.push(res.data);
    })
    .catch((err) => console.log(err));
  form.reset();
}
function showTodo(data) {
  const { _id, todoName, description, isDone } = data;

  const list = document.createElement("li");
  list.id = _id;
  list.className = "list-group-item";
  list.innerText = `Name : ${todoName}  Description: ${description} `;

  if (isDone) {
    todoListDone.appendChild(list);
  } else {
    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger m-2";
    deleteButton.innerText = "X";
    deleteButton.addEventListener("click", handleDelete);

    const tickBox = document.createElement("input");
    tickBox.className = "form-check-input ";
    tickBox.type = "checkbox";
    tickBox.value = "";
    tickBox.id = "flexCheckDefault";
    tickBox.addEventListener("click", handleDone);

    list.appendChild(tickBox);
    list.appendChild(deleteButton);
    todoListRemaining.appendChild(list);
  }
}

function handleDelete(e) {
  const li = e.target.parentNode;
  const id = li.id;
  todoListRemaining.removeChild(li);
  axiosInstance
    .delete(`/todoData/${id}`)
    .then((res) => console.log("deleted successfully"))
    .catch((err) => console.log(err));
}

function handleDone(e) {
  console.log("handleDone");
  const li = e.target.parentNode;
  const id = li.id;
  todoListRemaining.removeChild(li);
  const list = document.createElement("li");
  list.id = id;
  list.className = "list-group-item";
  list.innerText = li.firstChild.data;
  todoListDone.appendChild(list);
  const selectedData = data.find(({ _id }) => _id === id);
  selectedData.isDone = true;
  delete selectedData._id;
  axiosInstance
    .put(`/todoData/${id}`, selectedData)
    .then((res) => console.log("work done"))
    .catch((err) => console.log(err));
}
