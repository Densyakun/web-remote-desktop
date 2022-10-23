function signalServer(io) {
  const signalServer = require('simple-signal-server')(io)

  signalServer.on('discover', (request) => {
    request.discover([])
  })

  signalServer.on('request', (request) => {
    request.forward()
  })
}

module.exports = signalServer
