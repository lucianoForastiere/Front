import React from 'react';
import Nosotros from '../../componentes/Nosotros';
import SEO from '../../componentes/SEO';
import './estilos.css';


function NosotrosPage() {
  return (
    <div className='cont-principal-nosotros'>
      <SEO
        title="Nosotros"
        description="Conoce a Forastieri Propiedades, inmobiliaria dedicada a la venta y alquiler de propiedades en Olavarria."
        path="/nosotros"
      />
      <Nosotros />
    </div>
  )
}

export default NosotrosPage;
