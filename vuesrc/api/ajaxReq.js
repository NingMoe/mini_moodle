
export default function(op){
    var method = op.method;
    var path = op.path;
    var args = op.args;
    var url = path;
    if(args){
        url += '?';
    }
    var query = '';
    var formData = new FormData();
    if(args){

        for(var key in args){
            var value = args[key];
            query += encodeURIComponent(key) + '=' + encodeURIComponent(value);
            query += '&';
            formData.append(key, value);

        }
    }

    url += query;

    var resData = '';
    var core = new Promise(function(resolve, reject){

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4) {
                if((xhr.status >= 200 && xhr.status <300) || xhr.status == 304){
                    resolve(xhr);
                }else{
                    reject(xhr);
                }
            }
        }

        if(method == 'post'){
            xhr.open(method, path,true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(args));
            //console.log("path: "+ path);
        }else if(method == 'get'){
            xhr.open(method, url, true);
            xhr.send(null);
        }

    });

    return core;
}