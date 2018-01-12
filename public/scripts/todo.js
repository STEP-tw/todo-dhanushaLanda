const Todo = function(title,discription,items){
  this.title = title;
  this.discription = discription ;
  this.items = items;
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
