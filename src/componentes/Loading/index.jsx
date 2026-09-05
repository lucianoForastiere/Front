import React from 'react';
import logo from '../../imagenes/Logos/logo-circular.png';
import './estilos.css';

function Loading() {
    return (
        <div className='cont-loading'>
            <img src={logo} alt='not found' className='logo-loading'/>            
            <p>Cargando props ...</p>
        </div>
    )
}

export default Loading
