let StaticFileHandler  = require('../handlers/staticFileHandler.js');
const assert = require('chai').assert;
let request = require('./requestSimulator.js');
let th = require('./testHelper.js');
let fs = require('fs');

describe('staticFileHandler()',()=>{
  let fileHandler = {};
  let myFs={fileName:"../public/index.html"};
  myFs.existsSync=function(fileName){return this.fileName==fileName};
  myFs.readFileSync=function(fileName){return fileName;}
  describe('myFs',()=>{
    describe('existsSync()',()=>{
      it('existsSync() should return true if myFs have that file',()=>{
        assert.isTrue(myFs.existsSync("../public/index.html"));
      });
      it('existsSync() should return false if myFs dont have that file',()=>{
        assert.notOk(myFs.existsSync('home.html'));
      })
    })
    describe('readFileSync()',()=>{
      it('should return the fileName as content',()=>{
        let actual = myFs.readFileSync('/index.html');
        let expected = '/index.html';
        assert.equal(actual,expected);
      })
    })
  });

  beforeEach(function(){
    fileHandler = new StaticFileHandler('../public',myFs);
  })

  it("getContentType()",()=>{
    let actual = fileHandler.getContentType('todo.js');
    let expected = 'text/javascript';
    assert.equal(actual,expected);
  })
  it('readExistedFile()',()=>{
    let actual = fileHandler.readExistedFile('/index.html');
    console.log(actual);
    let expected = '../public/index.html';
    assert.equal(actual,expected);
  })

  it('execute() gives the index page',done=>{
    request(fileHandler.getHandler(),{method:'GET',url:'/index.html'},res=>{
      th.status_is_ok(res);
      th.content_type_is(res,'text/html');
      th.body_contains(res,'../public/index.html');
    })
    done();
  })

});
