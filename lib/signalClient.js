const SimpleSignalClient = require('simple-signal-client')
const io = require('socket.io-client')

let signalClient

module.exports = function setupSignalClient() {
  if (signalClient)
    return

  const socket = io({ secure: true })
  signalClient = new SimpleSignalClient(socket)

  signalClient.on('discover', async (id) => {
    await signalClient.connect(id)
  })

  signalClient.on('request', async (request) => {
    const { peer } = await request.accept()

    peer.on('data', data => {
      console.log('got a message: ' + data)
    })
  })

  signalClient.discover()
}
