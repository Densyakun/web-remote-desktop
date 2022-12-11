import { Server } from 'socket.io'
import setupSignalClient from './robotSignalClient'

let robotPeerPassword = ''
for (var i = 0; i < 6; i++)
  robotPeerPassword += String.fromCodePoint(Math.floor(Math.random() * 0x10FFFF))

let robotPeerRequest: any

export default function signalServer(io: Server, port: number) {
  const signalServer = require('simple-signal-server')(io)

  signalServer.on('discover', (request: any) => {
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

  signalServer.on('request', (request: any) => {
    request.forward()
  })

  setupSignalClient(port, robotPeerPassword)
}

module.exports = exports.default
