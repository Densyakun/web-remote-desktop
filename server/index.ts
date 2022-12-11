import * as http from 'http'
import { parse } from 'url'
import next from 'next'
import signal from './signal'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000')
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

let server: http.Server | undefined

function startServer() {
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

  server.listen(port, (err?: Error) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })

  return server
}

app.prepare().then(() => {
  signal(dev, port, startServer, () => {
    if (server) {
      server.close()
      server = undefined
    }
  })
})
