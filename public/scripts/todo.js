const Todo = function(todoObject){
  this.id = todoObject.id;
  this.title = todoObject.title;
  this.description = todoObject.description ;
  this.items = todoObject.items;
}
Todo.prototype.getTitle = function () {
  return this.title;
};
Todo.prototype.getDiscription = function () {
  return this.discription;
};
Todo.prototype.getItems = function () {
  return this.items;
};
module.exports = Todo;
