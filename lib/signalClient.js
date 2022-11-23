const SimpleSignalClient = require('simple-signal-client')
const io = require('socket.io-client')

module.exports = function setupSignalClient() {
  const socket = io({ secure: true })
  const signalClient = new SimpleSignalClient(socket)

  signalClient.on('discover', async (id) => {
    await signalClient.connect(id)
  })

  signalClient.on('request', async (request) => {
    const { peer } = await request.accept()

    peer.on('stream', stream => {
    })
  })

  signalClient.discover()
}
