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
let session = {};

const loadUser = function(req,res){
  let sessionid = req.cookies.sessionid;
  let user = session[sessionid];
  console.log(user);
  if(user){
    req.user = user;
  }
}

const loginUser = function (req, res) {
  let sessionId = new Date().getTime();
  let userName = req.body.username;
  let password = req.body.password;
  let user = getUser(userName, password);
  if (user) {
    user.sessionId = sessionId;
    res.setHeader('Set-Cookie', `sessionId=${sessionId}`);
    res.redirect('/todolists');
    return;
  }
  res.setHeader('Set-Cookie', `message=Login Failed; Max-Age=5`);
  res.redirect('/');
}


const respondLoginFailed= function(res){
  res.setHeader('Set-Cookie',`message=login failed;Max-Age=5`);
  res.redirect('/login');
}

const processGetLogin = function(req,res){
  console.log(req.user);
  if(req.user) {
    res.redirect('/home.html');
    return;
  }
  let html = fs.readFileSync('./public/login.html','utf8');
  res.setHeader('Content-Type','text/html');
  res.write(html.replace('LOGIN_MESSAGE',req.cookies.message||''));
  res.end();
}

const processPostLogin = function(req,res){
  let userName = req.body.username;
  if(!registeredUsers.includes(userName)) return respondLoginFailed(res);
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  session[sessionid]=userName;
  res.redirect('/home.html');
  res.end();
}

const processLogOut = function(req,res){
  res.setHeader('Set-Cookie',`sessionid=0,Expires=${new Date(1).toUTCString()}`);
  delete req.user;
  res.redirect('/index.html');
}

const toHtml = function(todo){
  return `<h3><a href= todoForm.html.${todo.id} >${todo.title}</a></h3>`;
}

const processTodos = function(req,res){
  let serveResponse = {};
  serveResource.todos =  todosHandler.map(toHtml).join('');
  console.log(serveResource.todos);
  res.setHeader('Content-Type','text/html');
  res.write(serveResource.todos);
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

/*=====================================*/

let app = webapp.create();
// app.use(loadUser);
app.use((req,res)=>{logger(fs,req,res)});

app.usePostProcess((req,res)=>{
  let url = req.url;
  if(url.startsWith('/todoForm.html.')){
    let id = url.split('.')[2];
    console.log(id);
    let title = todosHandler.todos.getTodoTitle(id);
    console.log(title);
    res.setHeader('Set-Cookie',`title=${title};Max-Age=5`);
    res.redirect('/todoForm.html');
  }
});

app.get('/',(req,res)=>{
  res.redirect('/index.html');
});

app.use(loginHandler.getHandler());


app.get('/login.html',processPostLogin);

app.get('/todos',processTodos);

app.get('/logout',processLogOut);

app.post('/newTodo',storeTodo);

app.get('/todoInfo',getTodoInformation);


app.usePostProcess(fileHandler.getHandler());


module.exports = app;
