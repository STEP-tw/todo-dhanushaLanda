const getTodoDetails = function(){
  let title = document.getElementById('title').value;
  let description = document.getElementById('description').value;
  let Items = document.getElementById('items').value;
  allItems = Items.split('\n');
  document.getElementById('todoForm').reset();
  return {
    title:title,description:description,items:allItems
  }
}

const requestToAddTodo = function(){
  let todoDetails  = getTodoDetails();
  let xReq = new XMLHttpRequest();
  xReq.open('POST',"/newTodo");
  let todoData = `title=${todoDetails.title}&description=${todoDetails.description}&items=${todoDetails.items}`;
  xReq.send(todoData);
}

const setTodoInfo = function(){
  let todoInfo = JSON.parse(this.responseText);
  document.getElementById('title').value = todoInfo.title || '';
  document.getElementById('description').value = todoInfo.description || '';
  document.getElementById('items').value = todoInfo.items || '';
}

const getTodoInfo = function(){
  let req = new XMLHttpRequest();
  req.addEventListener('load',setTodoInfo);
  req.open('GET',"/todoInfo");
  req.send();
}
// window.onload = getTodoInfo;
