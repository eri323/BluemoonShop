import { ImageResponse } from 'next/og';

export const alt = 'Bluemoon · tienda online';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Vista previa del link en el chat: el logo y el nombre de la tienda. */
export default function ImagenOG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 64,
          background: 'radial-gradient(circle at 30% 50%, #131a4a 0%, #07080f 62%)',
          color: '#ecebfa',
        }}
      >
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 50% 40%, #2a55f0, #0a2bb8)',
            boxShadow: '0 0 90px rgba(58, 96, 255, 0.65)',
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.05,
            color: '#fff',
            textShadow: '0 0 22px rgba(255,255,255,0.9)',
          }}
        >
          <span>BLUE</span>
          <span>MOON</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 96, fontWeight: 700 }}>Bluemoon</span>
          <span style={{ fontSize: 44, color: '#a6aad0' }}>tienda online</span>
        </div>
      </div>
    ),
    size,
  );
}
