// Coordenadas [longitud, latitud] de ciudades y puertos, para dibujar la ruta
// de cada envío. Si una ciudad no está en la lista se usa el país; si tampoco
// se reconoce el país, simplemente no se dibuja el mapa.

export const CIUDADES = {
  // México
  'ciudad de mexico': [-99.13, 19.43], 'cdmx': [-99.13, 19.43], 'mexico df': [-99.13, 19.43],
  'guadalajara': [-103.35, 20.67], 'monterrey': [-100.31, 25.69], 'manzanillo': [-104.34, 19.05],
  'lazaro cardenas': [-102.20, 17.96], 'veracruz': [-96.13, 19.19], 'altamira': [-97.88, 22.39],
  'tampico': [-97.86, 22.25], 'queretaro': [-100.39, 20.59], 'puebla': [-98.21, 19.04],
  'tijuana': [-117.02, 32.51], 'ciudad juarez': [-106.49, 31.74], 'nuevo laredo': [-99.51, 27.48],
  'merida': [-89.62, 20.97], 'cancun': [-86.85, 21.16], 'leon': [-101.68, 21.12],
  'aguascalientes': [-102.30, 21.88], 'san luis potosi': [-100.99, 22.15], 'toluca': [-99.66, 19.29],
  'hermosillo': [-110.96, 29.07], 'culiacan': [-107.39, 24.80], 'mazatlan': [-106.42, 23.25],
  'ensenada': [-116.60, 31.87], 'progreso': [-89.66, 21.28], 'coatzacoalcos': [-94.43, 18.13],
  'salina cruz': [-95.19, 16.16], 'celaya': [-100.82, 20.52], 'irapuato': [-101.35, 20.68],
  'saltillo': [-101.00, 25.42], 'chihuahua': [-106.07, 28.63], 'torreon': [-103.41, 25.54],
  'durango': [-104.65, 24.02], 'morelia': [-101.19, 19.71], 'villahermosa': [-92.93, 17.99],
  'oaxaca': [-96.72, 17.06], 'acapulco': [-99.88, 16.86], 'reynosa': [-98.28, 26.08],
  'matamoros': [-97.50, 25.87], 'mexicali': [-115.45, 32.63], 'los mochis': [-108.99, 25.79],
  'la paz': [-110.31, 24.14], 'zacatecas': [-102.58, 22.77], 'tepic': [-104.89, 21.51],
  'colima': [-103.72, 19.24], 'xalapa': [-96.92, 19.54], 'pachuca': [-98.73, 20.12],
  'cuernavaca': [-99.22, 18.92], 'tuxtla gutierrez': [-93.12, 16.75], 'piedras negras': [-100.52, 28.70],

  // China y Asia oriental
  'shanghai': [121.47, 31.23], 'shenzhen': [114.06, 22.54], 'ningbo': [121.55, 29.87],
  'guangzhou': [113.26, 23.13], 'canton': [113.26, 23.13], 'qingdao': [120.38, 36.07],
  'tianjin': [117.20, 39.13], 'xiamen': [118.09, 24.48], 'dalian': [121.61, 38.91],
  'hong kong': [114.17, 22.32], 'beijing': [116.41, 39.90], 'pekin': [116.41, 39.90],
  'yiwu': [120.07, 29.31], 'foshan': [113.12, 23.02], 'dongguan': [113.75, 23.02],
  'wuhan': [114.30, 30.59], 'chongqing': [106.55, 29.56], 'shantou': [116.68, 23.35],
  'busan': [129.08, 35.18], 'seul': [126.98, 37.57], 'tokio': [139.69, 35.69],
  'yokohama': [139.64, 35.44], 'kobe': [135.20, 34.69], 'nagoya': [136.91, 35.18],
  'taipei': [121.56, 25.03], 'kaohsiung': [120.30, 22.63], 'singapur': [103.82, 1.35],
  'ho chi minh': [106.63, 10.82], 'haiphong': [106.68, 20.86], 'hanoi': [105.83, 21.03],
  'bangkok': [100.50, 13.75], 'laem chabang': [100.88, 13.08], 'port klang': [101.39, 3.00],
  'yakarta': [106.85, -6.21], 'yakarta norte': [106.88, -6.11], 'manila': [120.98, 14.60],
  'mumbai': [72.88, 19.08], 'nhava sheva': [72.95, 18.95], 'chennai': [80.27, 13.08],
  'colombo': [79.86, 6.93], 'karachi': [67.01, 24.86], 'dubai': [55.27, 25.20],
  'jebel ali': [55.06, 25.01],

  // Estados Unidos y Canadá
  'los angeles': [-118.24, 34.05], 'long beach': [-118.19, 33.77], 'miami': [-80.19, 25.76],
  'houston': [-95.37, 29.76], 'nueva york': [-74.01, 40.71], 'new york': [-74.01, 40.71],
  'newark': [-74.17, 40.74], 'savannah': [-81.09, 32.08], 'seattle': [-122.33, 47.61],
  'oakland': [-122.27, 37.80], 'charleston': [-79.93, 32.78], 'laredo': [-99.51, 27.51],
  'el paso': [-106.49, 31.76], 'chicago': [-87.63, 41.88], 'dallas': [-96.80, 32.78],
  'atlanta': [-84.39, 33.75], 'norfolk': [-76.29, 36.85], 'san diego': [-117.16, 32.72],
  'toronto': [-79.38, 43.65], 'vancouver': [-123.12, 49.28], 'montreal': [-73.57, 45.50],

  // Latinoamérica y Caribe
  'bogota': [-74.07, 4.71], 'cartagena': [-75.51, 10.39], 'buenaventura': [-77.03, 3.88],
  'barranquilla': [-74.80, 10.96], 'medellin': [-75.56, 6.24], 'cali': [-76.52, 3.45],
  'santo domingo': [-69.89, 18.47], 'haina': [-70.03, 18.42], 'puerto plata': [-70.69, 19.79],
  'caucedo': [-69.63, 18.42], 'guayaquil': [-79.89, -2.19], 'quito': [-78.47, -0.18],
  'manta': [-80.73, -0.95], 'lima': [-77.04, -12.05], 'callao': [-77.13, -12.05],
  'santiago': [-70.65, -33.44], 'valparaiso': [-71.62, -33.05], 'san antonio': [-71.61, -33.59],
  'buenos aires': [-58.38, -34.60], 'montevideo': [-56.16, -34.90], 'santos': [-46.33, -23.96],
  'sao paulo': [-46.63, -23.55], 'rio de janeiro': [-43.17, -22.91], 'panama': [-79.52, 8.98],
  'colon': [-79.90, 9.36], 'san jose': [-84.09, 9.93], 'puerto limon': [-83.03, 10.00],
  'guatemala': [-90.51, 14.63], 'puerto quetzal': [-90.79, 13.92], 'san salvador': [-89.19, 13.69],
  'tegucigalpa': [-87.19, 14.08], 'puerto cortes': [-87.93, 15.83], 'managua': [-86.25, 12.11],
  'la habana': [-82.37, 23.11], 'san juan': [-66.11, 18.47], 'kingston': [-76.79, 17.97],
  'caracas': [-66.90, 10.49], 'la guaira': [-66.93, 10.60], 'asuncion': [-57.58, -25.26],

  // Europa
  'rotterdam': [4.48, 51.92], 'hamburgo': [9.99, 53.55], 'amberes': [4.40, 51.22],
  'antwerp': [4.40, 51.22], 'valencia': [-0.38, 39.47], 'barcelona': [2.17, 41.39],
  'algeciras': [-5.45, 36.13], 'bilbao': [-2.93, 43.26], 'madrid': [-3.70, 40.42],
  'le havre': [0.11, 49.49], 'marsella': [5.37, 43.30], 'genova': [8.95, 44.41],
  'la spezia': [9.83, 44.10], 'livorno': [10.31, 43.55], 'gioia tauro': [15.90, 38.43],
  'pireo': [23.64, 37.94], 'felixstowe': [1.35, 51.96], 'londres': [-0.13, 51.51],
  'southampton': [-1.40, 50.91], 'bremerhaven': [8.58, 53.54], 'gdansk': [18.65, 54.35],
  'lisboa': [-9.14, 38.72], 'sines': [-8.87, 37.96], 'estambul': [28.98, 41.01],
  'paris': [2.35, 48.86], 'berlin': [13.40, 52.52], 'roma': [12.50, 41.90]
}

export const PAISES = {
  'mexico': [-102.55, 23.63], 'china': [104.20, 35.86], 'estados unidos': [-98.58, 39.83],
  'usa': [-98.58, 39.83], 'eeuu': [-98.58, 39.83], 'colombia': [-74.30, 4.57],
  'ecuador': [-78.18, -1.83], 'republica dominicana': [-70.16, 18.74], 'peru': [-75.02, -9.19],
  'chile': [-71.54, -35.68], 'brasil': [-51.93, -14.24], 'argentina': [-63.62, -38.42],
  'panama': [-80.78, 8.54], 'espana': [-3.75, 40.46], 'alemania': [10.45, 51.17],
  'paises bajos': [5.29, 52.13], 'holanda': [5.29, 52.13], 'belgica': [4.47, 50.50],
  'italia': [12.57, 41.87], 'francia': [2.21, 46.23], 'reino unido': [-3.44, 55.38],
  'japon': [138.25, 36.20], 'corea del sur': [127.77, 35.91], 'taiwan': [120.96, 23.70],
  'vietnam': [108.28, 14.06], 'tailandia': [100.99, 15.87], 'malasia': [101.98, 4.21],
  'singapur': [103.82, 1.35], 'indonesia': [113.92, -0.79], 'india': [78.96, 20.59],
  'emiratos arabes unidos': [53.85, 23.42], 'turquia': [35.24, 38.96], 'guatemala': [-90.23, 15.78],
  'honduras': [-86.24, 15.20], 'el salvador': [-88.90, 13.79], 'costa rica': [-83.75, 9.75],
  'nicaragua': [-85.21, 12.87], 'cuba': [-77.78, 21.52], 'puerto rico': [-66.59, 18.22],
  'venezuela': [-66.59, 6.42], 'uruguay': [-55.77, -32.52], 'paraguay': [-58.44, -23.44],
  'bolivia': [-63.59, -16.29], 'canada': [-106.35, 56.13], 'portugal': [-8.22, 39.40],
  'polonia': [19.15, 51.92], 'grecia': [21.82, 39.07], 'hong kong': [114.17, 22.32]
}

// Quita acentos y signos para que "Shanghái" y "shanghai" sean lo mismo.
const normalizar = (texto) =>
  String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

// Busca las coordenadas de un texto tipo "Shanghái, China".
// Primero intenta por ciudad y, si no la encuentra, por país.
export const ubicar = (texto) => {
  const limpio = normalizar(texto)
  if (!limpio) return null

  const trozos = normalizar(texto).includes(',')
    ? texto.split(',').map(normalizar)
    : [limpio]

  for (const trozo of trozos) {
    if (CIUDADES[trozo]) return CIUDADES[trozo]
  }
  for (const trozo of trozos) {
    if (PAISES[trozo]) return PAISES[trozo]
  }

  // Último intento: alguna ciudad conocida contenida en el texto.
  const ciudad = Object.keys(CIUDADES).find(nombre => limpio.includes(nombre))
  if (ciudad) return CIUDADES[ciudad]

  const pais = Object.keys(PAISES).find(nombre => limpio.includes(nombre))
  return pais ? PAISES[pais] : null
}
