import React, { useState } from 'react';
import FiltraPrecio from '../FIltroRangoPrecio';
import './estilos.css'; 

const BarraLateral = ({ muestraVentaAlq, soloAlq, setCurrentPage, setOperacion, setTipoPropiedad, precioMin, setPrecioMin, precioMax, setPrecioMax }) => {

    //array con los nombres de los botones
    const botones = ['Departamento', 'Casa', 'PH', 'Local', 'Terreno', 'Oficina', 'Cochera', 'Todas'];
    const [operacionLocal, setOperacioLocal] = useState(''); //estado para ver el tilde en los checkbox
    const [tipoLocal, setTipoLocal] = useState('');
    

    // Asegurarse de que `setOperacion` en Home sea invocado cada vez que cambia el checkbox
    const handleFilterChange = (event) => {
        const { value } = event.target;
        const nuevaOperacion = value === operacionLocal ? '' : value;
        setOperacioLocal(nuevaOperacion);
        setOperacion(nuevaOperacion);
    };

    // Actualizar `tipoPropiedad` en Home y `tipoP` en BarraLateral
    const handleClick = (e) => {
        const { id } = e.target;
        setTipoPropiedad(id);
        setTipoLocal(id);
        if (typeof setCurrentPage === 'function') {
            setCurrentPage(1);
        }
    };

    return (
        <div className='cont-barra'>
            <div className={muestraVentaAlq === 'true' ? 'cont-titulo-filtro' : 'cont-titulo-filtro-Sin-muestrVentaAlq'}>
                <span className='filtros-eyebrow'>Busqueda</span>
                <p className='titulo-filtros'>Filtros Propiedades</p>
            </div>

            {(muestraVentaAlq === 'true' || soloAlq === 'true') && (
                <div className='opc-venta-alq'>
                    <p className='subtitulo-filtro'>Operacion</p>
                        <div className='cont-venta-alq'>
                            {
                                muestraVentaAlq === 'true' && (
                                <label className={`label-filtro-tipo-operacion ${operacionLocal === 'Venta' ? 'operacion-activa' : ''}`}>
                                    <input
                                        id='Venta'
                                        type="checkbox"
                                        value="Venta"
                                        checked={operacionLocal === 'Venta'}
                                        onChange={handleFilterChange}
                                        className='input-check-alq'
                                    />
                                    <span>Venta</span>
                                </label>
                                )
                            }
                            {
                                soloAlq === 'true' && (
                                <label className={`label-filtro-tipo-operacion ${operacionLocal === 'Alquiler' ? 'operacion-activa' : ''}`}>
                                    <input
                                        id='Alquiler'
                                        type="checkbox"
                                        value="Alquiler"
                                        checked={operacionLocal === 'Alquiler'}
                                        onChange={handleFilterChange}
                                        className='input-check-alq'
                                    />
                                    <span>Alquiler</span>
                                </label>
                                )
                            }
                        </div>

                        {/* {
                            soloAlq === 'true' && (
                                <div className='cont-venta-alq'>
                                    <label className='label-filtro-tipo-ope-Alq-Temp'>ALQUILER TEMPORAL</label>
                                    <input
                                        id='Alquiler temporario'
                                        type="checkbox"
                                        value="Alquiler temporario"
                                        checked={operacionLocal === "Alquiler temporario"}
                                        onChange={handleFilterChange}
                                        className='input-check-alq'
                                    />
                                </div>
                            )
                        } */}
                </div>
            )}

            <div className='cont-btn-filtros'>
                <p className='subtitulo-filtro'>Tipo de propiedad</p>
                {
                    botones.map((boton, index) => (
                        <button
                            key={index}
                            id={boton === 'Todas' ? '' : boton}
                            onClick={handleClick}
                            className={`boton-filtros ${tipoLocal === (boton === 'Todas' ? '' : boton) ? 'boton-filtros-activo' : ''}`}
                        >
                            {boton}
                        </button>
                    ))
                }
            </div>

            <div>
                <FiltraPrecio 
                    precioMin={precioMin}
                    setPrecioMin={setPrecioMin} 
                    precioMax={precioMax}
                    setPrecioMax={setPrecioMax}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default BarraLateral;
