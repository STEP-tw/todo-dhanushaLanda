const fs =require('fs');
const DefaultHandler = require('./defaultHandler.js');
const Session = require('./sessionHandler.js');


class LoginHandler extends DefaultHandler{
  constructor(path,users){
    super();
    this.session = new Session();
    this.path = path;
    this.users = users;
  }

  getUser(userName, password) {
    return this.users.find(user => user.userName == userName && user.password == password);
  }

  loginUser(req,res){
    let sessionId = new Date().getTime();
    let userName = req.body.username;
    let password = req.body.password;
    let user = this.getUser(userName, password);
    if (user) {
      user.sessionId = sessionId;
      res.setHeader('Set-Cookie',`sessionId=${sessionId}`);
      this.session.addSession(sessionId,userName);
      res.redirect('/home');
      return;
    }
    res.setHeader('Set-Cookie',`message=Login Failed; Max-Age=5`);
    res.redirect('/login.html');
  }

  processGetLogin(req,res){
    if(req.user) {
      res.redirect('/home');
      return;
    }
    let html = fs.readFileSync('./public/login.html','utf8');
    res.setHeader('Content-Type','text/html');
    res.write(html.replace('LOGIN_MESSAGE',req.cookies.message||''));
    res.end();
  }

  execute(req,res){
    console.log(req.body);
    if(req.method=='POST' && req.url == this.path)
      return this.loginUser(req,res);
    if(req.url==this.path)
      return this.processGetLogin(req,res);
  }
}
module.exports = LoginHandler;
