import { coincideOferta, obtenerOfertas } from './ofertas';

const venta = { operacion: 'Venta', moneda: 'U$D', precio: 120000 };
const alquiler = { operacion: 'Alquiler', moneda: '$', precio: 650000 };
const propiedad = { ...venta, ofertas: [venta, alquiler] };

test('favoritos: filtra por el precio de la operación seleccionada', () => {
    expect(coincideOferta(propiedad, 'Alquiler', '', 200000)).toBe(false);
    expect(coincideOferta(propiedad, 'Alquiler', 600000, 700000)).toBe(true);
    expect(coincideOferta(propiedad, 'Venta', '', 200000)).toBe(true);
    expect(coincideOferta(propiedad, '', '', '')).toBe(true);
    expect(coincideOferta(propiedad, '', 600000, '')).toBe(true);
    expect(coincideOferta(venta, 'Alquiler', '', '')).toBe(false);
});

test('interpreta favoritos históricos y prioriza las ofertas actualizadas', () => {
    expect(obtenerOfertas({ ...venta, moneda: 'USD' })).toEqual([venta]);
    expect(obtenerOfertas(propiedad)).toEqual([venta, alquiler]);
    expect(obtenerOfertas({})).toEqual([]);
});
