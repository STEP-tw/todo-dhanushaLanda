let chai = require('chai');
let assert = chai.assert;
let app = require('../app.js');
let request = require('./requestSimulator.js');
process.env.COMMENDS_STORE = './testTodos.js'
let th = require('./testHelper.js');

describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with 404',(done)=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        console.log('ok');
        assert.equal(res.statusCode,404);
        done();
      })
    })
  });
  describe('GET /',()=>{
    it('redirects to index.html',(done)=>{
      request(app,{method:'GET',url:'/'},(res)=>{
        th.should_be_redirected_to(res,'/index.html');
        assert.equal(res.body,"");
        done();
      })
    })
  })
  describe('GET /index.html',()=>{
    it('gives the index page',done=>{
      request(app,{method:'GET',url:'/index.html'},res=>{
        th.status_is_ok(res);
        th.content_type_is(res,'text/html');
        th.body_contains(res,'ToDo Website');
        done();
      })
    })
  })
  describe('GET /login.html',()=>{
    it('serves the login page',done=>{
      request(app,{method:'GET',url:'/login.html'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'password:');
        th.body_does_not_contain(res,'login failed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
    it('serves the login page with message for a failed login',done=>{
      request(app,{method:'GET',url:'/login.html',headers:{'cookie':'message=login failed'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'password:');
        th.body_contains(res,'login failed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  });
  describe('POST /login.html',()=>{
    it('redirects to home page for valid user',(done)=>{
      request(app,{method:'POST',url:'/login.html',body:'username=dhanu'},res=>{
        th.should_be_redirected_to(res,'/home.html');
        th.should_not_have_cookie(res,'message');
      })
      done();
    })
    it('redirects to login for invalid user',done=>{
      request(app,{method:'POST',url:'/login.html',body:'username=badUser'},res=>{
        th.should_be_redirected_to(res,'/login.html');
        th.should_have_expiring_cookie(res,'message','login failed');
        done();
      })
    })
  })
  describe('GET /home.html',()=>{
    it('serves the home page of logined User',done=>{
      request(app,{method:'GET',url:'/home.html'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'ToDoLists');
        done();
      })
    })
  })
  describe.skip('GET /viewTodos.html',()=>{
    it('serves the viewTodos page ',done=>{
      request(app,{mehtod:'GET',url:'/viewTodos.html'},res=>{
        th.status_is_ok(res);
        done();
      })
    })
  })
  describe('GET /logout',()=>{
    it('redirects to login page',done=>{
      request(app,{method:'GET',url:'/logout'},res=>{
        th.should_be_redirected_to(res,'/login.html');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })
});
