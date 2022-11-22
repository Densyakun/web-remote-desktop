const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { ironSession } = require("iron-session/express")
const { ironOptions } = require("./ironOptions")
const { Server } = require("socket.io")

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000')
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

var signalServerFile = './signalServer.js'

let server

function signalServerImported(signalServer) {
  server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  const io = new Server(server)
  signalServer(io)

  const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

  io.use(wrap(ironSession(ironOptions())))

  server.listen(port, (err) => {
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
    })
  } else
    signalServerImported(require(signalServerFile))
})
