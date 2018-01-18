const DefaultHandler = require('./defaultHandler.js');
const fs = require('fs');

class StaticFileHandler extends DefaultHandler {
  constructor(root,fs=fs){
    super();
    this.root = root;
    this.fs = fs;
  }
  getFilePath(url){
    return `${this.root}${url}`;
  }
  getContentType(filePath) {
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

  serveFile(fileName,res,content){
    let resourceType = this.getContentType(fileName);
    res.setHeader('Content-Type',resourceType);
    res.write(content);
    res.end();
  }

  readExistedFile(fileName){
    let filePath = this.getFilePath(fileName);
    if(this.fs.existsSync(filePath)) {
      console.log(filePath);
      return this.fs.readFileSync(filePath);
    }
  }

  execute(req,res){
    let filePath = this.getFilePath(req.url);

    if(!this.fs.existsSync(filePath)){
      res.write('file Not Found');
      res.end();
      return;
    }
    let content = this.fs.readFileSync(filePath);
    this.serveFile(filePath,res,content);
    return;
  }

}
module.exports=StaticFileHandler;
