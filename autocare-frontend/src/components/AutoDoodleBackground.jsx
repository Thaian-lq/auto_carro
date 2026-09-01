function AutoDoodleBackground() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none opacity-85">
        <svg
          viewBox="0 0 1200 1200"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="autoDoodles"
              width="300"
              height="300"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-6)"
            >
              {/* roda / pneu */}
              <g className="doodle-tile" transform="translate(20,20)">
                <circle cx="35" cy="35" r="30" />
                <circle cx="35" cy="35" r="12" />
                <path d="M35 5 L35 23 M35 47 L35 65 M5 35 L23 35 M47 35 L65 35 M15 15 L27 27 M43 43 L55 55 M55 15 L43 27 M27 43 L15 55" />
              </g>

              {/* engrenagem */}
              <g className="doodle-tile-accent" transform="translate(180,30)">
                <circle cx="20" cy="20" r="12" />
                <circle cx="20" cy="20" r="4" />
                <path d="M20 2 L20 9 M20 31 L20 38 M2 20 L9 20 M31 20 L38 20 M7 7 L12 12 M28 28 L33 33 M33 7 L28 12 M12 28 L7 33" />
              </g>

              {/* vela de ignição */}
              <g className="doodle-tile" transform="translate(230,110) rotate(15)">
                <rect x="0" y="0" width="14" height="30" rx="3" />
                <path d="M2 30 L2 42 L12 42 L12 30" />
                <path d="M7 42 L7 52" />
                <path d="M2 52 L12 52" />
                <path d="M0 8 L14 8 M0 14 L14 14" />
              </g>

              {/* chave de boca */}
              <g className="doodle-tile-accent" transform="translate(30,140) rotate(-20)">
                <path d="M0 10 Q0 0 10 0 Q20 0 20 10 Q20 16 14 18 L14 60 Q14 66 20 68 Q26 70 26 76 Q26 86 16 86 Q6 86 6 76 Q6 70 12 68 L12 18 Q6 16 6 10 Q6 4 10 4" />
              </g>

              {/* gota de óleo */}
              <g className="doodle-tile" transform="translate(130,190)">
                <path d="M12 0 C20 14 24 22 24 30 A12 12 0 1 1 0 30 C0 22 4 14 12 0 Z" />
                <path d="M9 26 Q9 32 15 32" strokeWidth="1.1" />
              </g>

              {/* bloco de motor simplificado */}
              <g className="doodle-tile-accent" transform="translate(200,200)">
                <rect x="0" y="10" width="50" height="30" rx="3" />
                <rect x="8" y="0" width="12" height="10" />
                <rect x="30" y="0" width="12" height="10" />
                <circle cx="12" cy="25" r="4" />
                <circle cx="28" cy="25" r="4" />
                <circle cx="44" cy="25" r="4" />
              </g>

              {/* parafuso */}
              <g className="doodle-tile" transform="translate(90,90) rotate(30)">
                <polygon points="10,0 20,6 20,18 10,24 0,18 0,6" />
                <circle cx="10" cy="12" r="4" />
              </g>

              {/* velocímetro */}
              <g className="doodle-tile-accent" transform="translate(250,250)">
                <path d="M2 30 A28 28 0 1 1 58 30" />
                <path d="M30 30 L44 12" />
                <circle cx="30" cy="30" r="3" />
                <path d="M8 30 L14 30 M46 30 L52 30 M15 9 L19 13 M45 9 L41 13" />
              </g>

              {/* amortecedor */}
              <g className="doodle-tile" transform="translate(150,10) rotate(10)">
                <line x1="10" y1="0" x2="10" y2="18" />
                <path d="M2 18 L18 18 L18 26 L2 26 Z" />
                <path d="M2 26 L2 44 M18 26 L18 44" />
                <line x1="10" y1="44" x2="10" y2="60" />
              </g>
            </pattern>
          </defs>
          <rect x="0" y="0" width="1200" height="1200" fill="url(#autoDoodles)" />
        </svg>
      </div>

      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(600px circle at 50% 45%, rgba(13,13,13,0.55), transparent 60%), linear-gradient(180deg, rgba(13,13,13,0.55), rgba(13,13,13,0.75) 60%, #0d0d0d 100%)',
        }}
      />

      <style>{`
        .doodle-tile, .doodle-tile-accent {
          fill: none;
          stroke-width: 1.4;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .doodle-tile {
          stroke: #56564f;
          opacity: 0.55;
        }
        .doodle-tile-accent {
          stroke: #cc5514;
          opacity: 0.4;
        }
      `}</style>
    </>
  )
}

export default AutoDoodleBackground