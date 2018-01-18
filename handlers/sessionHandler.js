const DefaultHandler = require('./defaultHandler.js');
class Session extends DefaultHandler {
  constructor(user={}){
    super();
    this.users = user;
  }

  loadSession(req, res) {
    let sessionId = req.cookies.sessionId;
    if (sessionId) {
      let user = this.users[sessionId];
      req.user = user;
    }
  }

  addSession(sessionId,userName){
    this.users[sessionId]=userName;
  }
  deleteSession(sessionId){
    delete this.users[sessionId];
  }
  execute(req,res){
    this.loadSession(req,res);
  }
}
module.exports = Session;
