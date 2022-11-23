const SimpleSignalClient = require('simple-signal-client')
const io = require('socket.io-client')
const wrtc = require('wrtc')

module.exports = function setupSignalClient(port, password) {
  const socket = io(`http://localhost:${port}`, { secure: true })
  const signalClient = new SimpleSignalClient(socket)

  signalClient.on('discover', async (id) => {
    const { peer } = await signalClient.connect(id, undefined, { wrtc: wrtc })

    peer.on('connect', () => {
      peer.send('how is it going?')
    })
  })

  signalClient.on('request', async (request) => {
    await request.accept(undefined, { wrtc: wrtc })
  })

  signalClient.discover(password)
}
