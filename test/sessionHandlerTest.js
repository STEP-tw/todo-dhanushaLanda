const assert = require('chai').assert;
let request = require('./requestSimulator.js');
let th = require('./testHelper.js');
let fs = require('fs');
const SessionHandler = require('../handlers/sessionHandler.js');

describe('session',()=>{
  let session = {};
  beforeEach(function(){
    session = new SessionHandler();
  })
  it('addSession()',()=>{
    session.addSession(1234,'dhanu');
    let actual  =  session.users;
    let expected = {1234:'dhanu'};
    assert.deepEqual(actual,expected);
  })
  it('deleteSession()',()=>{
    session.addSession(1234,'dhanu');
    session.deleteSession(1234);
    let actual  =  session.users;
    assert.deepEqual(actual,{});
  })
});
