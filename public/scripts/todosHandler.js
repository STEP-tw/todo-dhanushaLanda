let fs = require('fs');
let Todos = require('./todos.js');

class TodosHandler {
  constructor(storagePath,){
    this.storagePath = storagePath;
    this.todos;
  }
  loadTodos(){
    let filePath = this.storagePath;
    fs.readFile(filePath,'utf8',(err,userTodos)=>{
      if(err) throw err;
      userTodos = JSON.parse(userTodos)
      this.todos = new Todos(userTodos);
    });
  }
  storeTodo(todo){
    this.todos.addTodo(todo);
    let allTodos = this.todos.getAllTodos();
    console.log(allTodos);
    console.log(this.storagePath);
    fs.writeFile(this.storagePath,allTodos,(err)=>{
      // console.log(err);
    });
  }
  map(mapperFunction){
    return this.todos.map(mapperFunction);
  }
}
module.exports = TodosHandler;
