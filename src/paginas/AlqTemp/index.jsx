import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProps } from '../../redux/actions';
import BarraLateral from '../../componentes/Barra-Lateral';
import ListaPropiedades from '../../componentes/ListaPropiedades';
import WhatsAppButton from '../../componentes/BotonWhastApp';
import Paginacion from '../../componentes/Paginacion';


function PropsAlqTemp() {

    const [operacion, setOperacion] = useState('Alquiler temporario');
    const [tipoPropiedad, setTipoPropiedad] = useState('');
    const [precioMin, setPrecioMin] = useState(10000);
    const [precioMax, setPrecioMax] = useState(1000000);
    const [currentPage, setCurrentPage] = useState(1);
    const allProps = useSelector(state => state.propiedades);
    const totalPropiedades = useSelector(state => state.totPropiedades);
    const dispatch = useDispatch();
    const propiedadesPorPagina = 12;
    const limit = propiedadesPorPagina;
    const offset = (currentPage - 1) * limit;

    //efecto para iniciar la Pag desd la parte SUPERIOR
    useEffect(() => {
        // Desplaza la página hacia la parte superior cuando el componente se monta
        window.scrollTo(0, 0);
    }, []); // El array vacío asegura que se ejecute solo al montar el componente
    
    useEffect(()=>{
        dispatch(getProps(limit, offset, operacion, tipoPropiedad, precioMin, precioMax));
    },[dispatch, limit, offset, operacion, precioMax, precioMin, tipoPropiedad]);

    return (

        <div className='cont-Venta'>
            {/* contenedor filtros y lista props */}
            <div className='cont-titulo-y-props-venta'>
                {/* titulo */}
                <div className='cont-titulo-venta'>
                    <p className='titulo-props-venta'>Propiedades en Alquiler</p>
                </div>

                {/* barra lat */}
                <div className='cont-barraLateral-Y-listaProps-venta'>
                    <div className='cont-barraLateral-venta' >
                        <BarraLateral
                            muestraVentaAlq={'false'}
                            soloAlq={'false'}
                            setCurrentPage={setCurrentPage}
                            setOperacion={setOperacion}
                            setTipoPropiedad={setTipoPropiedad}
                            precioMin={precioMin}
                            setPrecioMin={setPrecioMin}
                            precioMax={precioMax}
                            setPrecioMax={setPrecioMax}
                        />
                    </div>
                    {/* lista props y pag */}
                    <div className='cont-listaProps-Y-paginacion-venta'>
                        <ListaPropiedades allProps={allProps} id='listaProps' />
                        {/* Paginación */}
                        {
                            allProps[0] &&
                            <Paginacion
                                allProps={allProps}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                                totalPropiedades={totalPropiedades}
                                propiedadesPorPagina={propiedadesPorPagina}
                            />
                        }
                    </div>
                </div>
            </div>

            {/* botón WhatsApp */}
            <WhatsAppButton />
        </div>

    )
}

export default PropsAlqTemp;