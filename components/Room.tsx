import { useEffect } from 'react'
import setupSignalClient from '../lib/signalClient'

export default function Room() {
  useEffect(() => { setupSignalClient() })

  return (
    <>
      <video width="250">
        Sorry, your browser doesn't support embedded videos.
      </video>
    </>
  )
}
