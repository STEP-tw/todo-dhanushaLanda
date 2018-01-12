const Todo = require('./todo.js');

class Todos {
  constructor(todos){
    this.todos = todos;
  }
  addTodo(todo){
    let newTodo = new Todo(todo);
    let title = newTodo.getTitle();
    this.todos[title] = newTodo;
  }
  getAllTodos(){
    return this.todos;
  }
  map(mapperFunction){
    return this.todos.map(mapperFunction);
  }
}

module.exports=Todos;
