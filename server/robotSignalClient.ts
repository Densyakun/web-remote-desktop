import io from 'socket.io-client'

const SimpleSignalClient = require('simple-signal-client')
const wrtc = require('wrtc')

export default function setupSignalClient(port: number, password: string) {
  const socket = io(`http://localhost:${port}`, { secure: true })
  const signalClient = new SimpleSignalClient(socket)

  signalClient.on('discover', async (id: string) => {
    const { peer } = await signalClient.connect(id, undefined, { wrtc: wrtc })

    peer.on('connect', () => {
      peer.send('how is it going?')
    })
  })

  signalClient.on('request', async (request: any) => {
    await request.accept(undefined, { wrtc: wrtc })
  })

  signalClient.discover(password)
}
