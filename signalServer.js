function signalServer(io) {
  const signalServer = require('simple-signal-server')(io)

  signalServer.on('discover', (request) => {
    if (!request.socket.request.session.user?.isLoggedIn)
      request.socket.disconnect(true)

    request.discover([])
  })

  signalServer.on('request', (request) => {
    request.forward()
  })
}

module.exports = signalServer
