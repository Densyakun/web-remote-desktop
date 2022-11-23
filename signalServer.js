const setupSignalClient = require('./robotSignalClient')

let robotPeerPassword = ''
for (var i = 0; i < 6; i++)
  robotPeerPassword += String.fromCodePoint(Math.floor(Math.random() * 0x10FFFF))

let robotPeerRequest

module.exports = function (io, port) {
  const signalServer = require('simple-signal-server')(io)

  signalServer.on('discover', (request) => {
    const isRobotPeer = robotPeerPassword && request.discoveryData === robotPeerPassword
    if (!isRobotPeer) {
      if (!request.socket.request.session.user?.isLoggedIn) {
        request.socket.disconnect(true)
        return
      }

      request.discover(robotPeerRequest.socket.id)
      robotPeerRequest.discover(request.socket.id)
    } else {
      robotPeerPassword = ''
      robotPeerRequest = request
    }
  })

  signalServer.on('request', (request) => {
    request.forward()
  })

  setupSignalClient(port, robotPeerPassword)
}
