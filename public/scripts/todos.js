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
    return this.todos[todoId];
  }
  getTodoTitle(todoId){
    console.log(this.todos[todoId]);
    return this.todos[todoId].title;
  }
  getUniqTodoIdCounter(){
    return this.uniqTodoIdCounter;
  }
  map(mapperFunction){
    // let todoTitles = [];
    // for(let i in this.todos){
    //   todoTitles.push({'id':this.todos[i]["id"],"title":this.todos[i]['title']});
    // }
    // console.log();
    let todoTitles = Object.keys(this.todos);
    return todoTitles.map(mapperFunction);
  }
}

module.exports=Todos;
