const displayTodos = function(){
  let todos = JSON.stringify(this.responseText);
  console.log(todos);
  document.getElementById('Todos').innerHTML = todos;
}

const getUserTodos = function(){
  let xReq = new XMLHttpRequest();
  xReq.open('GET',"/todos");
  xReq.send();
  xReq.addEventListener('load',displayTodos);
}

window.onload = getUserTodos;
