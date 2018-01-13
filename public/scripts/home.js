const getTodoDetails = function(){
  let title = document.getElementById('title').value;
  let description = document.getElementById('description').value;
  let Items = document.getElementById('items').value;
  allItems = Items.split('\n');
  // document.getElementById('todoForm').reset();
  return {
    title:title,description:description,items:allItems
  }
}

const requestToAddTodo = function(){
  console.log('HI');
  let todoDetails  = getTodoDetails();
  let xReq = new XMLHttpRequest();
  xReq.open('POST',"/newTodo");
  let todoData = `title=${todoDetails.title}&description=${todoDetails.description}&items=${todoDetails.items}`;
  xReq.send(todoData);
}
const displayTodos = function(){
  let todos = JSON.stringify(this.responseText);
  console.log(todos);
  document.getElementById('ToDoLists').innerHTML = todos;
}

const getUserTodos = function(){
  let xReq = new XMLHttpRequest();
  xReq.open('GET',"/todos");
  xReq.send();
  xReq.addEventListener('load',displayTodos);
}
