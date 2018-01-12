let chai = require('chai');
let assert = chai.assert;
let app = require('../app.js');
let request = require('./requestSimulator.js');
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
});
