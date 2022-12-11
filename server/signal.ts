import * as http from 'http'
import { dirname, resolve } from 'path'
import { ironSession } from "iron-session/express"
import { sessionOptions } from "../lib/withSession"
import { Server, Socket } from "socket.io"
import { TscWatchClient } from "tsc-watch/client"
import type SignalServer from "./signal/signalServer"

var signalServerFile = './signal/signalServer.js'

function signalServerImported(port: number, startServer: () => http.Server, signalServer: typeof SignalServer) {
  const server = startServer()

  const io = new Server(server)
  signalServer(io, port)

  const wrap = (middleware: any) => (socket: Socket, next: any) => middleware(socket.request, {}, next)

  io.use(wrap(ironSession(sessionOptions())))
}

export default function signal(dev: boolean, port: number, startServer: () => http.Server, closeServer: () => void) {
  if (dev) {
    const watch = new TscWatchClient()

    watch.on('success', () => {
      closeServer()

      delete require.cache[require.resolve(resolve(dirname(module.filename), signalServerFile))]
      signalServerImported(port, startServer, require(signalServerFile))
    })

    watch.start('--project', 'tsconfig.server.signal.json', '--noClear', '--sourceMap')
  } else
    signalServerImported(port, startServer, require(signalServerFile))
}
