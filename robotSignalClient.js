const SimpleSignalClient = require('simple-signal-client')
const io = require('socket.io-client')
const wrtc = require('wrtc')

module.exports = function setupSignalClient(port, password) {
  const socket = io(`http://localhost:${port}`, { secure: true })
  const signalClient = new SimpleSignalClient(socket)

  signalClient.on('discover', async (id) => {
    await signalClient.connect(id, undefined, { wrtc: wrtc }).catch(reason => console.error(`robotClient:discover:err ${JSON.stringify(reason)}`))
  })

  signalClient.on('request', async (request) => {
    await request.accept(undefined, { wrtc: wrtc }).catch(reason => console.error(`robotClient:request:err ${JSON.stringify(reason)}`))
  })

  signalClient.discover(password)
}
