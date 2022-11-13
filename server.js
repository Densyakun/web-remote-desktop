const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require("socket.io")
const path = require('path')
const hmr = require('node-hmr')

var watchDir = './'
var signalServerFile = './signalServer.js'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000')
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  let io
  hmr(() => {
    if (io) {
      server.close()
      io = undefined
    }

    try {
      const signalServer = require(signalServerFile)
      io = new Server(server)
      signalServer(io)
    } catch (e) {
      console.error(e)
      const moduleId = path.resolve(watchDir, signalServerFile)
      require.cache[moduleId] = { id: moduleId }
    }
  }, { watchDir: watchDir, watchFilePatterns: [signalServerFile] })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
