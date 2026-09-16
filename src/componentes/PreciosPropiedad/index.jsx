import React from 'react';
import { obtenerOfertas } from '../../Helps/ofertas';
import { formatMoney } from '../../Helps';
import './estilos.css';

export default function PreciosPropiedad({ propiedad }) {
    return (
        <div className='precios-operaciones'>
            {obtenerOfertas(propiedad).map(oferta => (
                <span key={oferta.operacion} className='precio-operacion'>
                    <span>{oferta.operacion}</span>
                    <strong>{oferta.precio != null ? `${oferta.moneda || ''} ${formatMoney(oferta.precio)}` : 'Consultar'}</strong>
                </span>
            ))}
        </div>
    );
}
