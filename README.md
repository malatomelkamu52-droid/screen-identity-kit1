# Stellar Navigator

Build a responsive full-stack Space Intelligence and Satellite Tracking Web App inspired by Orbital Radar using React, Vite, Tailwind CSS, Lucide icons, Framer Motion, and Three.js (@react-three/fiber, @react-three/drei).

1. Visual Layout & HUD Theme:
- Deep-space dark background (#050811) with glassmorphism cards (#0b1120/90) and gold (#FACC15)/cyan (#06B6D4) accents.
- Top Header:
  * Brand: "ORBITAL INTELLIGENCE".
  * Celestial Selector Pills: [Sun, Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune].
  * UTC Mission Clock, Tracked Count badge, and Hamburger Mega-Menu button.
- Side HUD Panels:
  * Left Panel: Target Telemetry HUD (Altitude, Velocity km/s, Orbital Period, Sub-point Lat/Lon, "Ride Along" camera button).
  * Right Panel: Map Layers toggles (Landing Sites, Craters, Live Orbiters, Sun/Terminator, Surface Temperature).
  * Bottom Bar: Time controller (Play/Pause, 1x/10x/100x speed, scrub slider, LIVE lock).

2. Photorealistic 3D Planetary Engine:
- Render all 8 planets, the Moon, and the Sun with 2K texture maps, axial tilts, and day/night terminator shading:
  * Earth: Multi-layer surface with ocean specular reflectivity, night city lights, and an atmospheric Fresnel glow shell.
  * Moon: High-contrast crater topography with matte roughness.
  * Mars: Iron-oxide red surface with bump mapping for Olympus Mons and Valles Marineris.
  * Saturn & Uranus: True 3D double-sided transparent rings with axial tilts (Saturn 26.73°, Uranus 97.77°).
  * Sun: Emissive corona flare shader with point lighting.
- Smooth camera interpolation (lerp) when switching bodies via the top selector.

3. Interactive Surface Feature Pins & Info Cards:
- When a planet is clicked, display a floating summary card with diameter, gravity, orbital period, and quick facts (e.g., Mars: "Home to Olympus Mons — largest volcano in the Solar System").
- Add clickable 3D coordinate pins on surfaces:
  * Mars: Olympus Mons, Valles Marineris, Jezero Crater.
  * Moon: Apollo 11 Tranquility Base, Shackleton Crater.
  * Earth: Kennedy Space Center, Baikonur Cosmodrome.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/98f57a8e-1561-4d25-a86c-ee340b37b43d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
