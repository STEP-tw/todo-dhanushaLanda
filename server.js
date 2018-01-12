let http = require('http');
let webapp = require('./webapp.js');
let app = webapp.create();
let server = http.createServer(app);
const PORT = 9000;
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
