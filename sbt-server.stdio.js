'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const url = require("url");
let net = require('net'), fs = require('fs'), os = require('os'), stdin = process.stdin, stdout = process.stdout;
let u = discoverUrl();
let socket = net.Socket();
socket.on('data', (chunk) => {
    // send it back to stdout
    stdout.write(chunk);
}).on('end', () => {
    stdin.pause();
});
if (u.protocol == 'tcp:') {
    socket.connect(u.port, '127.0.0.1');
}
else if (u.protocol == 'local:' && os.platform() == 'win32') {
    let pipePath = '\\\\.\\pipe\\' + u.hostname;
    socket.connect(pipePath);
}
else if (u.protocol == 'local:') {
    socket.connect(u.path);
}
else {
    throw 'Unknown protocol ' + u.protocol;
}
stdin.resume();
stdin.on('data', (chunk) => {
    socket.write(chunk);
}).on('end', () => {
    socket.end();
});
// the port file is hardcoded to a particular location relative to the build.
function discoverUrl() {
    let pf = path.join(process.cwd(), 'project', 'target', 'active.json');
    let portfile = JSON.parse(fs.readFileSync(pf));
    return url.parse(portfile.uri);
}
//# sourceMappingURL=server.js.map
