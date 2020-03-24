let http = require('http');
let fs = require('fs');
let path = require('path');
let mime = require('mime');
let cache = {};

function send404(response){
    response.writeHead(404,{'Content-Type':'text/plain'});
    response.write('Error 404: resource not find.')
    response.end();
}

function sendFile(response, filePath, fileContents){
    response.writeHead(200 , {'content-type':mime.getType(path.basename(filePath))});
    response.end(fileContents);
}

function serveStatic(response,cache,asbPath){
    if(cache[asbPath]){
        sendFile(response,asbPath,cache[asbPath]);
    } else {
        fs.exists(asbPath,function(exists){
            if(exists){
                fs.readFile(asbPath, function(err,data){
                    if(err){
                        send404(response);
                    } else {
                        cache[asbPath] = data;
                        sendFile(response,asbPath ,data);
                    }
                });
            } else {
                send404(response);
            }
        })
    }
}

let server = http.createServer(function(request,response){
    let filePath = false;
    if(request.url == '/'){
        filePath = 'public/index.html';
    }  else {
        filePath = 'public' + request.url;
    }
    var asbPath = './' + filePath;
    serveStatic(response,cache, asbPath);
})

server.listen(3000,function(){
    console.log('Server listening on port 3000.');
});