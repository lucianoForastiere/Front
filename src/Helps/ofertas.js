export const normalizarMoneda = moneda => ['USD', 'U$S'].includes(moneda) ? 'U$D' : moneda === 'ARS' ? '$' : moneda;

export function obtenerOfertas(propiedad = {}) {
    if (propiedad.ofertas?.length) return propiedad.ofertas;
    if (!propiedad.operacion) return [];
    return [{ operacion: propiedad.operacion, moneda: normalizarMoneda(propiedad.moneda), precio: propiedad.precio }];
}

export function coincideOferta(propiedad, operacion, precioMin, precioMax) {
    return obtenerOfertas(propiedad).some(oferta =>
        (!operacion || operacion === 'todas' || oferta.operacion === operacion) &&
        (precioMin === '' || precioMin == null || oferta.precio >= Number(precioMin)) &&
        (precioMax === '' || precioMax == null || oferta.precio <= Number(precioMax))
    );
}
