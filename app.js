let webapp = require('./webapp.js');
let fs = require('fs');
let registeredUsers = ['dhanu','pavani'];
let TodosHandler = require('./public/scripts/todosHandler.js')
let todosHandler = new TodosHandler('./data/todos.json');
let StaticFileHandler = require('./handlers/staticFileHandler.js');
let LoginHandler = require('./handlers/loginHandler.js');
let fileHandler = new StaticFileHandler('public',fs);
let loginHandler = new LoginHandler('/login.html',[{"userName":"pavani","password":"pavani"},{"userName":"dhanu","password":"dhanu"}]);
todosHandler.loadTodos();

const logger = function(fs,req,res) {
  let logs = ['--------------------------------------------------------------',
    `${req.method}`,
    `${req.url}`,
    `${JSON.stringify(req.headers,null,2)}`,
    ''
  ].join('\n');
  console.log(`${req.method} ${req.url}`);
  fs.appendFile('./data/log.json',logs,()=>{});
}

const respondLoginFailed= function(res){
  res.setHeader('Set-Cookie',`message=login failed;Max-Age=5`);
  res.redirect('/login');
}

const processLogOut = function(req,res){
  res.setHeader('Set-Cookie',`sessionId=0,Expires=${new Date(1).toUTCString()}`);
  delete req.user;
  res.redirect('/index.html');
}

const toHtml = function(todo){
  return `<h3><a href= todoForm.html.${todo.id} >${todo.title}</a></h3>`;
}

const processTodos = function(req,res){
  let serveResponse = {};
  serveResponse.todos =  todosHandler.map(toHtml).join('');
  console.log(serveResponse);
  res.setHeader('Content-Type','text/html');
  res.write(serveResponse.todos);
  res.end();
}

const storeTodo = function(req,res){
  todosHandler.storeTodo(req.body);
  res.statusCode = 200;
  res.end();
}

const getTodoInformation = function(req,res){
  let title = req.cookies.title;
  let serveResponse = {};
  if(title)
    serveResponse = todosHandler.todos.getTodoInfo(title) || {};
  res.write(JSON.stringify(serveResponse));
  res.end();
}

const homePage = function(req,res){
  let homePage = fs.readFileSync('./public/home.html','utf8');
  res.setHeader('Content-Type','text/html');
  let user = req.user;
  res.write(homePage.replace('WELCOME_USER',`WELCOME ${user}`));
  res.end();
}

/*=====================================*/

let app = webapp.create();
app.use((req,res)=>{logger(fs,req,res)});

app.use((req,res)=>{
  let url = req.url;
  if(url.startsWith('/todoForm.html.')){
    let id = url.split('.')[2];
    let todoPage = fs.readFileSync('./public/todoForm.html','utf8');
    let todoInfo = todosHandler.todos.getTodoInfo(id);
    console.log(todoInfo);
    todoPage = todoPage.replace("TITLE",todoInfo.title);
    todoPage= todoPage.replace("DESCRIPTION",todoInfo.description);
    todoPage = todoPage.replace("ITEMS",todoInfo.items)||"";
    res.setHeader('Content-Type','text/html');
    res.write(todoPage);
    res.end();
    }
    return;
});

app.use(loginHandler.getHandler());

app.use(loginHandler.session.getHandler());

app.use((req,res)=>{
  if(req.url!='/index.html'&& !req.user)
    res.redirect('/index.html');
});
app.get('/',(req,res)=>{
  res.redirect('/index.html');
});


app.get('/home',homePage);

app.get('/todos',processTodos);

app.get('/logout',processLogOut);

app.post('/newTodo',storeTodo);

app.get('/todoInfo',getTodoInformation);


app.usePostProcess(fileHandler.getHandler());


module.exports = app;
