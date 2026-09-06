/**
 * Public CDN texture URLs for planetary surfaces and the sky background.
 * Served by jsDelivr (threex.planets image set) and the three.js example
 * textures — both are stable, CORS-enabled public endpoints.
 */
const PLANETS = "https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images";
const THREE_TEX = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets";

export const TEXTURES = {
  sun: `${PLANETS}/sunmap.jpg`,
  mercury: `${PLANETS}/mercurymap.jpg`,
  venus: `${PLANETS}/venusmap.jpg`,
  earthDay: `${PLANETS}/earthmap1k.jpg`,
  earthNight: `${THREE_TEX}/earth_lights_2048.png`,
  earthSpec: `${PLANETS}/earthspec1k.jpg`,
  earthClouds: `${PLANETS}/earthcloudmap.jpg`,
  moon: `${PLANETS}/moonmap1k.jpg`,
  moonBump: `${PLANETS}/moonbump1k.jpg`,
  mars: `${PLANETS}/marsmap1k.jpg`,
  marsBump: `${PLANETS}/marsbump1k.jpg`,
  jupiter: `${PLANETS}/jupitermap.jpg`,
  saturn: `${PLANETS}/saturnmap.jpg`,
  saturnRing: `${PLANETS}/saturnringcolor.jpg`,
  uranus: `${PLANETS}/uranusmap.jpg`,
  uranusRing: `${PLANETS}/uranusringcolour.jpg`,
  neptune: `${PLANETS}/neptunemap.jpg`,
  starfield: `${PLANETS}/galaxy_starfield.png`,
} as const;
