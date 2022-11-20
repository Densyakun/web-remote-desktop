import { useEffect } from 'react'
import setupSignalClient from '../lib/signalClient'

export default function Room() {
  useEffect(() => { setupSignalClient() })

  return (
    <>
      <video width="250">
        Sorry, your browser doesn&apos;t support embedded videos.
      </video>
    </>
  )
}
