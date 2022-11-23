const setupSignalClient = require('./robotSignalClient')

let robotPeerPassword
function resetRobotPeerPassword() {
  robotPeerPassword = ''
  for (var i = 0; i < 6; i++)
    robotPeerPassword += String.fromCodePoint(Math.floor(Math.random() * 0x10FFFF))
}
resetRobotPeerPassword()

let clientRequest

module.exports = function (io, port) {
  const signalServer = require('simple-signal-server')(io)

  signalServer.on('discover', (request) => {
    const isRobotPeer = request.discoveryData === robotPeerPassword
    if (!isRobotPeer) {
      if (!request.socket.request.session.user?.isLoggedIn) {
        request.socket.disconnect(true)
        return
      }

      clientRequest = request
      setupSignalClient(port, robotPeerPassword)
    } else {
      resetRobotPeerPassword()

      clientRequest.discover(request.socket.id)
      request.discover(clientRequest.socket.id)
    }
  })

  signalServer.on('request', (request) => {
    request.forward()
  })
}
