'use client'

import { useEffect, useRef } from 'react'

export default function Aud() {
  const canvasRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const audio = audioRef.current

    // Create AudioContext + analyser
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const source = audioCtx.createMediaElementSource(audio)
    const analyser = audioCtx.createAnalyser()
    source.connect(analyser)
    analyser.connect(audioCtx.destination)
    analyser.fftSize = 256

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx.fillStyle = '#111'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i]
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 200)`
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2)
        x += barWidth + 1
      }
    }

    audio.onplay = () => {
      audioCtx.resume()
      draw()
    }
  }, [])

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black">
      <audio
        ref={audioRef}
        controls
        src="/Aaron Smith - Dancin (KRONO Remix) - Lyrics.mp3"
        className="mb-6 w-3/4"
      ></audio>

      <canvas ref={canvasRef} width={800} height={200} className="border border-gray-500" />
    </div>
  )
}
