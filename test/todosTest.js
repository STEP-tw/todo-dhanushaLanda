let assert = require('chai').assert;
let Todos = require('../public/scripts/todos.js');
let Todo = require('../public/scripts/todo.js');

describe('Todos ',()=>{
  let todo = {};
  beforeEach(function(){
    todos = new Todos(4,{4:{"title":'testing',"description":'hello',"items":""}});
  })
  it('getUniqueIdPointer should give the uniqTodoIdCounter value',()=>{
    let actual = todos.getUniqTodoIdCounter();
    let expected = 4;
    assert.deepEqual(actual,expected);
  })
  it('addTodo should add todo to todos',()=>{
    let actual = todos.addTodo({"title":'testing',"description":'hello',"items":""});
    let expected = new Todo({"title":'testing',"description":'hello',"items":""});
    assert.deepEqual(actual,expected);
  })
  it('getAllTodos should give all todos',()=>{
    let actual = todos.getAllTodos();
    let expected = {4:{"title":'testing',"description":'hello',"items":""}};
    assert.deepEqual(actual,expected);
  })
  it('getTodoInfo should give info of given todo',()=>{
    let actual = todos.getTodoInfo(4)
    let expected = {"title":'testing',"description":'hello',"items":""};
    assert.deepEqual(actual,expected);
  })
  it('getTodoTitle should give title of the todo based on id',()=>{
    let actual = todos.getTodoTitle(4);
    let expected  ='testing';
    assert.deepEqual(actual,expected);
  })
});
