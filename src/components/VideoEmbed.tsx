import { useState } from 'react'

const fill = { position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 } as const

export function VideoEmbed({ id }: { id: string }) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        style={fill}
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`}
        title="Introduction video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  return (
    <div style={{ ...fill, background: '#000' }}>
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        style={{ ...fill, objectFit: 'cover', opacity: 0.85 }}
      />
      <button
        type="button"
        aria-label="Play video"
        onClick={() => setPlaying(true)}
        style={{
          ...fill,
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'manipulation',
        }}
      >
        <span
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(90deg, #a86bff, #d4af37)',
            color: '#120a1f',
            fontSize: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 6,
          }}
        >
          {'\u25B6'}
        </span>
      </button>
      
      <a
        href={`https://www.youtube.com/watch?v=${id}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ position: 'absolute', right: 10, bottom: 8, fontSize: 12, color: '#fff', textDecoration: 'underline', zIndex: 2 }}
      >
        Open on YouTube
      </a>
    </div>
  )
}
