const Todo = require('./todo.js');

class Todos {
  constructor(idCounter,todos){
    this.todos =todos;
    this.uniqTodoIdCounter = idCounter;
  }
  addTodo(todoObject){
    this.uniqTodoIdCounter++;
    todoObject.id = this.uniqTodoIdCounter;
    let newTodo = new Todo(todoObject);
    this.todos[this.uniqTodoIdCounter] = newTodo;
    return newTodo;
  }
  getAllTodos(){
    return this.todos;
  }
  getTodoInfo(todoId){
    console.log(this.todos);
    return this.todos[todoId];
  }
  getTodoTitle(todoId){
    return this.todos[todoId].title;
  }
  getUniqTodoIdCounter(){
    return this.uniqTodoIdCounter;
  }
  map(mapperFunction){
    let todoTitles = [];
    for(let i in this.todos){
      let title = this.todos[i].title;
      let id = this.todos[i].id;
      todoTitles.push({'id':id,"title":title});
    }
    return todoTitles.map(mapperFunction);
  }
}

module.exports=Todos;
