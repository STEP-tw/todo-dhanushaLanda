let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let app = require('../webapp.js').create;
let th = require('./testHelper.js');

describe('app',()=>{
  describe.only('GET /bad',()=>{
    it('responds with 404',()=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        // done();
      })
    })
  })
});
