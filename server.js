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

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  let io
  const fn = () => {
    const signalServer = require(signalServerFile)
    io = new Server(server)
    signalServer(io)

    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

    io.use(wrap(ironSession(ironOptions())))
  }

  // Use hmr only in development mode
  if (dev) {
    const path = require('path')
    const hmr = require('node-hmr')

    var watchDir = './'

    hmr(() => {
      if (io) {
        io.attach(createServer())
        io.disconnectSockets()
        io = undefined
      }

      try {
        fn()
      } catch (e) {
        console.error(e)
        const moduleId = path.resolve(watchDir, signalServerFile)
        require.cache[moduleId] = { id: moduleId }
      }
    }, { watchDir: watchDir, watchFilePatterns: [signalServerFile] })
  } else
    fn()

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
