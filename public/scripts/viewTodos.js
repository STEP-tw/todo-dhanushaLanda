const displayTodos = function(){
  let todos = this.responseText;
  document.getElementById('Todos').innerHTML = todos;
}

const getUserTodos = function(){
  let xReq = new XMLHttpRequest();
  xReq.addEventListener('load',displayTodos);
  xReq.open('GET',"/todos");
  xReq.send();
}

window.onload = getUserTodos;
