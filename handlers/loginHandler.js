const fs =require('fs');
const DefaultHandler = require('./defaultHandler.js');
const session = require('./sessionHandler.js');


class LoginHandler extends DefaultHandler{
  constructor(path,users){
    super();
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
      res.setHeader('Set-Cookie', `sessionId=${sessionId}`);
      res.redirect('/home.html');
      return;
    }
    res.setHeader('Set-Cookie', `message=Login Failed; Max-Age=5`);
    res.redirect('/login.html');
  }

  execute(req,res){
    if(req.method=='POST' && req.url == this.path)
      return this.loginUser(req,res);
    return;
  }
}
module.exports = LoginHandler;
