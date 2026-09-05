import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../imagenes/Logos/logo-circular.png';
import './estilos.css';

const iconos = {
    comprar: (
        <svg className='btn-landing-icon' viewBox='0 0 64 64' aria-hidden='true'>
            <path d='M11 31.5 32 13l21 18.5' />
            <path d='M17 29v24h30V29' />
            <path d='M28 53V39h8v14' />
        </svg>
    ),
    alquilar: (
        <svg className='btn-landing-icon' viewBox='0 0 64 64' aria-hidden='true'>
            <circle cx='23' cy='24' r='12' />
            <circle cx='20' cy='21' r='2.3' />
            <path d='M32 33 51 52' />
            <path d='M43 44 49 38' />
            <path d='M48 49 54 43' />
        </svg>
    ),
    vender: (
        <svg className='btn-landing-icon' viewBox='0 0 64 64' aria-hidden='true'>
            <path d='M12 28 32 8h18l6 6v18L36 52 12 28Z' />
            <circle cx='44' cy='18' r='3.4' />
        </svg>
    ),
};

function LandingPage2() {
    const acciones = [
        {
            texto: 'COMPRAR',
            prefijo: 'QUIERO',
            path: '/venta',
            icono: iconos.comprar,
        },
        {
            texto: 'ALQUILAR',
            prefijo: 'QUIERO',
            path: '/alquiler',
            icono: iconos.alquilar,
        },
        {
            texto: 'VENDER',
            prefijo: 'QUIERO',
            path: '/contacto',
            icono: iconos.vender,
        },
    ];

    return (
        <div className='contGralLanding'>
            <div className='cont-logo-landing'>
                <div className='sub-cont-logo-landing sub-cont-sup left-slide'>
                    <img src={logo} alt='' className='logo-landing' />
                </div>
            </div>

            <div className='cont-inf'>
                <div className='sub-cont-infe right-slide'>
                    {acciones.map(({ texto, prefijo, path, icono }) => (
                        <Link to={path} className='btn-landing' key={texto}>
                            {icono}
                            <span className='btn-landing-prefijo'>{prefijo}</span>
                            <span className='btn-landing-texto'>{texto}</span>
                            <span className='btn-landing-linea'></span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LandingPage2;
