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
  console.log(`${req.method}    ${req.url}`);
  fs.appendFile('./data/log.json',logs,()=>{});
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
  res.setHeader('Set-Cookie',`message=login failed;Max-Age=8`);
  res.redirect('login.html');
}

const processGetLogin = function(req,res){
  let html = fs.readFileSync('public/login.html','utf8');
  res.setHeader('Content-Type','text/html');
  res.write(html.replace('LOGIN_MESSAGE',req.cookies.message||''));
  res.end();
}

const processPostLogin = function(req,res){
  console.log(req.body);
  let userName = req.body.username;
  if(!registeredUsers.includes(userName)) return respondLoginFailed(res);
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookies',`sessionid=${sessionid}`);
  res.setHeader('Set-Cookie',`message=`);
  res.redirect('/home.html');
  res.end();
}
const toHtml = function(todo){
  console.log(todo);
  return `<p>${todo.title}</p>`
}

const processTodos = function(req,res){
  let serveResponse = {};
  serveResource.todos =  todosHandler.map(toHtml).join('<br>');
  res.write(serveResource.todos);
  res.end();
}



/*=================*/
let app = webapp.create();
app.use((req,res)=>{logger(fs,req,res)});
app.get('/',(req,res)=>{
  res.redirect('/index.html');
});

app.get('/login.html',processGetLogin);

app.post('/login.html',processPostLogin);

app.get('/todos',processTodos);

app.usePostProcess(fileHandler);


module.exports = app;
