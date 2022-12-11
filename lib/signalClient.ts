import io from 'socket.io-client'

const SimpleSignalClient = require('simple-signal-client')

let signalClient: any

export default function setupSignalClient() {
  if (signalClient)
    return

  const socket = io({ secure: true })
  signalClient = new SimpleSignalClient(socket)

  signalClient.on('discover', async (id: any) => {
    await signalClient.connect(id)
  })

  signalClient.on('request', async (request: any) => {
    const { peer } = await request.accept()

    peer.on('data', (data: any) => {
      console.log('got a message: ' + data)
    })
  })

  signalClient.discover()
}
