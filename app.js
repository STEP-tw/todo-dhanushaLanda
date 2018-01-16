let webapp = require('./webapp.js');
let fs = require('fs');
let registeredUsers = ['dhanu','pavani'];
let TodosHandler = require('./public/scripts/todosHandler.js')
let todosHandler = new TodosHandler('./data/todos.json');
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
  if(user){
    req.user = user;
  }
}

const fileNotFound = function(fileName){
  return !fs.existsSync(fileName);
};

const getContentType = function(filePath) {
  let fileExtension = filePath.slice(filePath.lastIndexOf('.'));
  let contentTypes = {
      '.html':'text/html',
      '.css':'text/css',
      '.js':'text/javascript',
      '.png':'image/png',
      '.gif':'image/gif',
      '.jpg':'image/jpg',
      '.pdf':'application/pdf'
  }
  return contentTypes[fileExtension];
}

const getResourcePath = function(resource){
  return './public'+resource;
}

const serveResource = function(resource,res,content){
  let resourceType = getContentType(resource);
  res.setHeader('Content-Type',resourceType);
  res.write(content);
  res.end();
}

const fileHandler = function(req,res){
  let resource = getResourcePath(req.url);
  if(fileNotFound(resource)){
    res.statusCode = 404;
    res.write('File not found!');
    res.end();
    return;
  }
  let content = fs.readFileSync(resource);
  serveResource(resource,res,content);
}

const respondLoginFailed= function(res){
  res.setHeader('Set-Cookie',`message=login failed;Max-Age=5`);
  res.redirect('/login.html');
}

const processGetLogin = function(req,res){
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
  res.redirect('/home.html');
  res.end();
}

const processLogOut = function(req,res){
  res.setHeader('Set-Cookie',`sessionid=0,Expires=${new Date(1).toUTCString()}`);
  delete req.user;
  res.redirect('/login.html');
}

const toHtml = function(todo){
  return `<h3><a href= todoForm.html.${todo} >${todo}</a></h3>`;
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
  req.statusCode = 200;
  res.end();
}

const getTodoInformation = function(req,res){
  let title = req.cookies.title;
  let serveResponse = {};
  if(title)
    serveResponse = todosHandler.todos.getTodoInfo(title);
  res.write(JSON.stringify(serveResponse));
  res.end();
}

/*=====================================*/

let app = webapp.create();
app.use((req,res)=>{logger(fs,req,res)});

app.usePostProcess((req,res)=>{
  let url = req.url;
  if(url.startsWith('/todoForm.html.')){
    let title = url.split('.')[2];
    res.setHeader('Set-Cookie',`title=${title};Max-Age=5`);
    res.redirect('/todoForm.html');
  }
});

app.get('/',(req,res)=>{
  res.redirect('/index.html');
});

app.get('/login.html',processGetLogin);

app.post('/login.html',processPostLogin);

app.get('/todos',processTodos);

app.get('/logout',processLogOut);

app.post('/newTodo',storeTodo);

app.get('/todoInfo',getTodoInformation);


app.usePostProcess(fileHandler);


module.exports = app;
