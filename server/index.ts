import * as http from 'http'
import { parse } from 'url'
import next from 'next'
import { ironSession } from "iron-session/express"
import { sessionOptions } from "../lib/withSession"
import { Server, Socket } from "socket.io"
import type SignalServer from "./signalServer"

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000')
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

var signalServerFile = './signalServer.js'

let server: http.Server | undefined

function signalServerImported(signalServer: typeof SignalServer) {
  server = http.createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url as string, true)

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  const io = new Server(server)
  signalServer(io, port)

  const wrap = (middleware: any) => (socket: Socket, next: any) => middleware(socket.request, {}, next)

  io.use(wrap(ironSession(sessionOptions())))

  server.listen(port, (err?: Error) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
}

app.prepare().then(() => {
  if (dev) {
    const hmr = require('node-hmr')
    const ehhmr = require('error-handled-node-hmr')

    ehhmr(hmr, signalServerFile, signalServerImported, () => {
      if (server) {
        server.close()
        server = undefined
      }
    }, {
      watchFilePatterns: [
        signalServerFile,
        './robotSignalClient.js'
      ]
    })
  } else
    signalServerImported(require(signalServerFile))
})
