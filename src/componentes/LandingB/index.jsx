import React from 'react';
import { NavLink } from 'react-router-dom';
import './estilos.css';

function LandingB() {
    return (
        <div className='cont-landing-B'>
            <h2 className='texto-somos'>SOMOS</h2>
            <div className='separador-somos'>
                <span></span>
            </div>
            <p className='texto-inf-landingB'>
                Brindamos un servicio inmobiliario personalizado,
                <br />
                conocimiento local y compromiso en cada operación.
                <br />
                Acompañamos a nuestros clientes en todo el proceso
                <br />
                de compra, venta o alquiler, con seriedad,
                <br />
                confianza y cercanía.
            </p>
            <NavLink to={'/contacto'}>
                <button className='btn-contactanos-home'>CONTACTANOS</button>
            </NavLink>
        </div>
    );
}

export default LandingB;
