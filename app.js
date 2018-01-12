let webapp = require('./webapp.js');
let fs = require('fs');

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




/*=================*/
let app = webapp.create();

app.get('/',(req,res)=>{
  res.redirect('/index.html');
});

app.usePostProcess(fileHandler);


module.exports = app;
