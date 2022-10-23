import SimpleSignalClient from 'simple-signal-client'
import io from 'socket.io-client'

export default async function setupSignalClient() {
  const socket = io({ secure: true })
  let signalClient = new SimpleSignalClient(socket)

  signalClient.on('discover', async (allIDs) => {
    const { peer } = await signalClient.connect("")
  })

  signalClient.on('request', async (request) => {
    const { peer } = await request.accept()

    peer.on('stream', stream => {
    })
  })

  // TODO check login
  signalClient.discover("")
}
