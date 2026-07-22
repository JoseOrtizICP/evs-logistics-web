// ============================================================
//  VENDEDORES DE EVS  —  Tarjetas digitales (estilo Tapni)
// ============================================================
//
//  Cada vendedor tiene su propia tarjeta en:
//      www.evslogist.com/<slug>
//  Ejemplo:  www.evslogist.com/jose-ortiz
//
//  PARA AGREGAR UN VENDEDOR NUEVO:
//  Copia un bloque de abajo, cambia el "slug" (lo que va después
//  de la "/") y rellena sus datos. Deja en '' lo que no aplique.
//
//  - slug:      texto de la URL (minúsculas, sin espacios ni tildes,
//               usa guiones). Ej: 'maria-lopez'
//  - foto:      ruta de la foto en /public/vendedores/  (opcional).
//               Si la dejas vacía se muestran sus iniciales.
//  - whatsapp:  número con código de país, SOLO dígitos. Ej: '573001234567'
//               (déjalo en '' si aún no lo tienes)
// ============================================================

// Redes de la EMPRESA (iguales en todas las tarjetas).
export const empresaRedes = {
  linkedin: 'https://www.linkedin.com/company/evs-logistic/',
  facebook: 'https://www.facebook.com/profile.php?id=100080143248684',
  instagram: 'https://www.instagram.com/evslogistic',
}

export const vendedores = {
  'jose-ortiz': {
    nombre: 'Jose Ortiz',
    cargo: 'Director General',
    empresa: 'EVS Logistics',
    foto: '',
    whatsapp: '525615529993',     // +52 56 1552 9993
    email: 'jose_ortiz@evslogist.com',
    sitioWeb: 'https://www.evslogist.com',
    ciudad: 'Ciudad de México, México',
  },

  // ----- Copia desde aquí para un vendedor nuevo -----
  // 'nombre-apellido': {
  //   nombre: 'Nombre Apellido',
  //   cargo: 'Ejecutivo Comercial',
  //   empresa: 'EVS Logistics',
  //   foto: '',                       // ej: '/vendedores/nombre-apellido.jpg'
  //   whatsapp: '573000000000',       // solo dígitos, con código de país
  //   email: 'nombre@evslogist.com',
  //   sitioWeb: 'https://www.evslogist.com',
  //   ciudad: 'Bogotá, Colombia',
  // },
  // ---------------------------------------------------
}

export const getVendedor = (slug) =>
  slug ? vendedores[slug.toLowerCase()] : undefined
