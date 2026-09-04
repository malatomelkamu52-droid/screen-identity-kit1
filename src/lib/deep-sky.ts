/**
 * Deep-sky catalogue: bright named stars, Messier deep-space objects and
 * constellation stick figures.
 *
 * All values are real published figures (SIMBAD / Hipparcos / Messier
 * catalogue). Positions are J2000 right ascension (hours) and declination
 * (degrees). Nothing here is invented — where a value is not well defined for
 * an object type (e.g. spectral class of a galaxy) the field is simply absent.
 */

export type SkyKind = "star" | "nebula" | "galaxy" | "cluster";

export interface SkyObject {
  id: string;
  name: string;
  designation: string;
  catalog?: string;
  kind: SkyKind;
  /** Right ascension, hours (J2000) */
  ra: number;
  /** Declination, degrees (J2000) */
  dec: number;
  /** Apparent visual magnitude */
  mag: number;
  distance: string;
  constellation: string;
  spectralType?: string;
  temperatureK?: number;
  radiusSolar?: number;
  massSolar?: number;
  color: string;
  blurb: string;
  description: string;
}

export const SKY_OBJECTS: SkyObject[] = [
  {
    id: "sirius",
    name: "Sirius",
    designation: "Alpha Canis Majoris",
    catalog: "HIP 32349",
    kind: "star",
    ra: 6.7525,
    dec: -16.7161,
    mag: -1.46,
    distance: "8.60 light-years",
    constellation: "Canis Major",
    spectralType: "A1V",
    temperatureK: 9940,
    radiusSolar: 1.71,
    massSolar: 2.06,
    color: "#cfe4ff",
    blurb: "Brightest star in Earth's night sky",
    description:
      "Sirius is the brightest star in Earth's night sky and is a binary system consisting of the main-sequence star Sirius A and the white dwarf companion Sirius B.",
  },
  {
    id: "canopus",
    name: "Canopus",
    designation: "Alpha Carinae",
    catalog: "HIP 30438",
    kind: "star",
    ra: 6.3992,
    dec: -52.6957,
    mag: -0.74,
    distance: "310 light-years",
    constellation: "Carina",
    spectralType: "A9II",
    temperatureK: 7400,
    radiusSolar: 71,
    massSolar: 8,
    color: "#fff3e0",
    blurb: "Second-brightest star in the night sky",
    description:
      "Canopus is a bright giant used for decades as an attitude-reference star by interplanetary spacecraft star trackers.",
  },
  {
    id: "alpha-centauri",
    name: "Alpha Centauri",
    designation: "Alpha Centauri A/B",
    catalog: "HIP 71683",
    kind: "star",
    ra: 14.6601,
    dec: -60.8339,
    mag: -0.27,
    distance: "4.37 light-years",
    constellation: "Centaurus",
    spectralType: "G2V + K1V",
    temperatureK: 5790,
    radiusSolar: 1.22,
    massSolar: 1.1,
    color: "#fff0cf",
    blurb: "Closest stellar system to the Sun",
    description:
      "Alpha Centauri is the closest stellar system to the Sun, a triple system whose faint companion Proxima Centauri lies 4.24 light-years away.",
  },
  {
    id: "arcturus",
    name: "Arcturus",
    designation: "Alpha Bootis",
    catalog: "HIP 69673",
    kind: "star",
    ra: 14.2610,
    dec: 19.1825,
    mag: -0.05,
    distance: "36.7 light-years",
    constellation: "Bootes",
    spectralType: "K0III",
    temperatureK: 4286,
    radiusSolar: 25.4,
    massSolar: 1.08,
    color: "#ffc98d",
    blurb: "Red giant, brightest star of the northern sky",
    description:
      "Arcturus is an orange giant and the brightest star in the northern celestial hemisphere.",
  },
  {
    id: "vega",
    name: "Vega",
    designation: "Alpha Lyrae",
    catalog: "HIP 91262",
    kind: "star",
    ra: 18.6156,
    dec: 38.7837,
    mag: 0.03,
    distance: "25.0 light-years",
    constellation: "Lyra",
    spectralType: "A0V",
    temperatureK: 9602,
    radiusSolar: 2.36,
    massSolar: 2.14,
    color: "#e6f0ff",
    blurb: "Historic zero point of the magnitude scale",
    description:
      "Vega was the northern pole star around 12,000 BCE and long served as the zero point for the visual magnitude scale.",
  },
  {
    id: "capella",
    name: "Capella",
    designation: "Alpha Aurigae",
    catalog: "HIP 24608",
    kind: "star",
    ra: 5.2782,
    dec: 45.9980,
    mag: 0.08,
    distance: "42.9 light-years",
    constellation: "Auriga",
    spectralType: "G8III + G0III",
    temperatureK: 4970,
    radiusSolar: 11.98,
    massSolar: 2.57,
    color: "#ffe9bd",
    blurb: "Close pair of yellow giants",
    description:
      "Capella is a spectroscopic binary of two yellow giant stars orbiting each other in about 104 days.",
  },
  {
    id: "rigel",
    name: "Rigel",
    designation: "Beta Orionis",
    catalog: "HIP 24436",
    kind: "star",
    ra: 5.2423,
    dec: -8.2016,
    mag: 0.13,
    distance: "863 light-years",
    constellation: "Orion",
    spectralType: "B8Ia",
    temperatureK: 12100,
    radiusSolar: 78.9,
    massSolar: 21,
    color: "#bcd6ff",
    blurb: "Blue supergiant in Orion",
    description:
      "Rigel is a blue supergiant roughly 120,000 times more luminous than the Sun and the brightest star in Orion.",
  },
  {
    id: "procyon",
    name: "Procyon",
    designation: "Alpha Canis Minoris",
    catalog: "HIP 37279",
    kind: "star",
    ra: 7.6551,
    dec: 5.2250,
    mag: 0.34,
    distance: "11.46 light-years",
    constellation: "Canis Minor",
    spectralType: "F5IV-V",
    temperatureK: 6530,
    radiusSolar: 2.05,
    massSolar: 1.5,
    color: "#f6f4ff",
    blurb: "Nearby subgiant with a white dwarf companion",
    description:
      "Procyon is a bright subgiant in a binary system with the faint white dwarf Procyon B.",
  },
  {
    id: "betelgeuse",
    name: "Betelgeuse",
    designation: "Alpha Orionis",
    catalog: "HIP 27989",
    kind: "star",
    ra: 5.9195,
    dec: 7.4071,
    mag: 0.42,
    distance: "~550 light-years",
    constellation: "Orion",
    spectralType: "M1-2Ia-ab",
    temperatureK: 3600,
    radiusSolar: 764,
    massSolar: 16.5,
    color: "#ffb27a",
    blurb: "Red supergiant, a future supernova",
    description:
      "Betelgeuse is a semiregular variable red supergiant expected to end its life as a core-collapse supernova.",
  },
  {
    id: "altair",
    name: "Altair",
    designation: "Alpha Aquilae",
    catalog: "HIP 97649",
    kind: "star",
    ra: 19.8464,
    dec: 8.8683,
    mag: 0.77,
    distance: "16.7 light-years",
    constellation: "Aquila",
    spectralType: "A7V",
    temperatureK: 7550,
    radiusSolar: 1.79,
    massSolar: 1.79,
    color: "#eaf1ff",
    blurb: "Rapid rotator flattened by its own spin",
    description:
      "Altair rotates so fast that its equatorial diameter is over 20 percent larger than its polar diameter.",
  },
  {
    id: "aldebaran",
    name: "Aldebaran",
    designation: "Alpha Tauri",
    catalog: "HIP 21421",
    kind: "star",
    ra: 4.5987,
    dec: 16.5093,
    mag: 0.85,
    distance: "65.3 light-years",
    constellation: "Taurus",
    spectralType: "K5III",
    temperatureK: 3900,
    radiusSolar: 44.1,
    massSolar: 1.16,
    color: "#ffc08a",
    blurb: "Orange giant marking the eye of the bull",
    description:
      "Aldebaran is an orange giant that appears to lie among the Hyades cluster but is in fact much closer to us.",
  },
  {
    id: "antares",
    name: "Antares",
    designation: "Alpha Scorpii",
    catalog: "HIP 80763",
    kind: "star",
    ra: 16.4901,
    dec: -26.4320,
    mag: 1.06,
    distance: "~550 light-years",
    constellation: "Scorpius",
    spectralType: "M1.5Iab",
    temperatureK: 3660,
    radiusSolar: 680,
    massSolar: 12,
    color: "#ff9c6d",
    blurb: "Red supergiant heart of Scorpius",
    description:
      "Antares is a red supergiant whose name means 'rival of Mars' for its similar reddish colour.",
  },
  {
    id: "polaris",
    name: "Polaris",
    designation: "Alpha Ursae Minoris",
    catalog: "HIP 11767",
    kind: "star",
    ra: 2.5303,
    dec: 89.2641,
    mag: 1.98,
    distance: "~448 light-years",
    constellation: "Ursa Minor",
    spectralType: "F7Ib",
    temperatureK: 6015,
    radiusSolar: 37.5,
    massSolar: 5.4,
    color: "#fff4e2",
    blurb: "The current northern pole star",
    description:
      "Polaris is a Cepheid variable supergiant that currently sits within one degree of the north celestial pole.",
  },
  {
    id: "m31",
    name: "Andromeda Galaxy",
    designation: "Messier 31",
    catalog: "M31 / NGC 224",
    kind: "galaxy",
    ra: 0.7123,
    dec: 41.2687,
    mag: 3.44,
    distance: "2.54 million light-years",
    constellation: "Andromeda",
    color: "#cdd6ff",
    blurb: "Nearest major galaxy to the Milky Way",
    description:
      "M31 is a barred spiral galaxy and the nearest major galaxy to the Milky Way, on a collision course with it in about 4.5 billion years.",
  },
  {
    id: "m42",
    name: "Orion Nebula",
    designation: "Messier 42",
    catalog: "M42 / NGC 1976",
    kind: "nebula",
    ra: 5.5881,
    dec: -5.3911,
    mag: 4.0,
    distance: "1,344 light-years",
    constellation: "Orion",
    color: "#9fd6ff",
    blurb: "Closest region of massive star formation",
    description:
      "M42 is a diffuse emission nebula and the nearest region of massive star formation to Earth, visible to the unaided eye in Orion's sword.",
  },
  {
    id: "m45",
    name: "Pleiades",
    designation: "Messier 45",
    catalog: "M45",
    kind: "cluster",
    ra: 3.7911,
    dec: 24.1051,
    mag: 1.6,
    distance: "444 light-years",
    constellation: "Taurus",
    color: "#bcd9ff",
    blurb: "Young open cluster wrapped in reflection nebulosity",
    description:
      "The Pleiades is a young open star cluster dominated by hot blue B-type stars that light up surrounding dust.",
  },
  {
    id: "m1",
    name: "Crab Nebula",
    designation: "Messier 1",
    catalog: "M1 / NGC 1952",
    kind: "nebula",
    ra: 5.5755,
    dec: 22.0145,
    mag: 8.4,
    distance: "~6,500 light-years",
    constellation: "Taurus",
    color: "#ffb1c8",
    blurb: "Remnant of the supernova recorded in 1054 CE",
    description:
      "M1 is the expanding remnant of a supernova observed by Chinese astronomers in 1054 CE, powered by a central pulsar spinning about 30 times per second.",
  },
  {
    id: "m87",
    name: "Virgo A",
    designation: "Messier 87",
    catalog: "M87 / NGC 4486",
    kind: "galaxy",
    ra: 12.5137,
    dec: 12.3911,
    mag: 8.6,
    distance: "53.5 million light-years",
    constellation: "Virgo",
    color: "#e2d7ff",
    blurb: "Home of the first imaged black hole shadow",
    description:
      "M87 is a supergiant elliptical galaxy whose central supermassive black hole was the first to be directly imaged, by the Event Horizon Telescope in 2019.",
  },
];

export const SKY_BY_ID = Object.fromEntries(SKY_OBJECTS.map((o) => [o.id, o])) as Record<
  string,
  SkyObject
>;

/** Constellation stick figures — vertices are J2000 [ra hours, dec deg]. */
export interface Constellation {
  id: string;
  name: string;
  description: string;
  lines: [number, number][][];
}

export const CONSTELLATIONS: Constellation[] = [
  {
    id: "orion",
    name: "Orion",
    description: "The hunter; hosts Betelgeuse, Rigel and the Orion Nebula.",
    lines: [
      [
        [5.919, 7.407],
        [5.679, -1.943],
        [5.603, -1.201],
        [5.533, -0.299],
        [5.242, -8.202],
      ],
      [
        [5.919, 7.407],
        [5.418, 6.35],
        [5.242, -8.202],
      ],
      [
        [5.603, -1.201],
        [5.588, -5.391],
      ],
    ],
  },
  {
    id: "ursa-major",
    name: "Ursa Major",
    description: "The great bear; its seven brightest stars form the Plough.",
    lines: [
      [
        [11.062, 61.751],
        [11.031, 56.382],
        [11.897, 53.695],
        [12.257, 57.033],
        [12.9, 55.96],
        [13.399, 54.925],
        [13.792, 49.313],
      ],
      [
        [12.257, 57.033],
        [11.062, 61.751],
      ],
    ],
  },
  {
    id: "cassiopeia",
    name: "Cassiopeia",
    description: "The queen; a distinctive W of five bright stars near the pole.",
    lines: [
      [
        [0.153, 59.15],
        [0.675, 56.537],
        [0.945, 60.717],
        [1.43, 60.235],
        [1.906, 63.67],
      ],
    ],
  },
  {
    id: "scorpius",
    name: "Scorpius",
    description: "The scorpion; Antares marks its heart.",
    lines: [
      [
        [15.981, -26.114],
        [16.005, -22.622],
        [16.09, -19.805],
      ],
      [
        [15.981, -26.114],
        [16.49, -26.432],
        [16.836, -34.293],
        [17.622, -42.998],
        [17.56, -37.104],
        [17.708, -39.03],
      ],
    ],
  },
  {
    id: "cygnus",
    name: "Cygnus",
    description: "The swan; the Northern Cross flying along the Milky Way.",
    lines: [
      [
        [20.69, 45.28],
        [20.371, 40.257],
        [19.938, 35.083],
        [19.512, 27.96],
      ],
      [
        [19.749, 45.131],
        [20.371, 40.257],
        [20.77, 33.97],
      ],
    ],
  },
  {
    id: "lyra",
    name: "Lyra",
    description: "The lyre; a small parallelogram anchored by Vega.",
    lines: [
      [
        [18.615, 38.784],
        [18.746, 37.605],
        [18.834, 36.899],
        [18.911, 32.69],
        [18.746, 33.363],
        [18.746, 37.605],
      ],
    ],
  },
  {
    id: "canis-major",
    name: "Canis Major",
    description: "The greater dog; contains Sirius, the brightest night-sky star.",
    lines: [
      [
        [6.752, -16.716],
        [6.978, -28.972],
        [7.14, -26.393],
        [7.05, -23.833],
        [6.752, -16.716],
      ],
      [
        [6.978, -28.972],
        [6.378, -17.956],
      ],
    ],
  },
];

export const UNIVERSE_FACTS = [
  "The Milky Way contains hundreds of billions of stars.",
  "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.",
  "Light from the Andromeda Galaxy takes roughly 2.5 million years to reach us.",
  "Neutron stars are among the densest objects known in the universe.",
  "The observable universe spans about 93 billion light-years across.",
  "Betelgeuse is so large that it would swallow the orbit of Jupiter.",
  "A teaspoon of white dwarf material would weigh several tonnes on Earth.",
  "Voyager 1 crossed the heliopause into interstellar space in August 2012.",
];
