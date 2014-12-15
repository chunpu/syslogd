var parser = require('../').parser

console.time('performance')
for (var i = 0; i < 500000; i++) {
    parser('<183>Dec 15 10:58:44 hostname tag: info', {
          address: '127.0.0.1'
        , family: 'IPv4'
        , port: 60097
        , size: 39
    })
}
console.timeEnd('performance')
