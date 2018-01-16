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
  getTodoInfo(todoTitle){
    return this.todos[todoTitle];
  }
  map(mapperFunction){
    let todoTitles = Object.keys(this.todos);
    return todoTitles.map(mapperFunction);
  }
}

module.exports=Todos;
