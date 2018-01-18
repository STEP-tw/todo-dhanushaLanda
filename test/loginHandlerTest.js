const assert = require('chai').assert;
let request = require('./requestSimulator.js');
let th = require('./testHelper.js');
let fs = require('fs');
let LoginHandler = require('../handlers/loginHandler.js');

describe('loginHandler()',()=>{
  beforeEach(function(){
    loginHandler = new LoginHandler('/login');

  })
  it("execute()",done=>{
    let headers = {
      method:'GET',
      url:loginHandler.path,
      user: "dhanu",
      statusCode:302,
      cookies:{
      },
      body:{
        username:'dhanu',
        password:'dhanu'
      }
    };
    request(loginHandler.getHandler(),headers,res=>{
      th.content_type_is(res,'text/html');
      th.should_be_redirected_to(res,'/home.html');

    })
    done();
  })
})
