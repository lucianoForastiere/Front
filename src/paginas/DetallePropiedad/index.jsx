import { obtenerOfertas } from '../../Helps/ofertas';
import PreciosPropiedad from '../../componentes/PreciosPropiedad';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {  getPropiedad, resetProperty } from '../../redux/actions';
import { formatMoney } from '../../Helps';
import { InmobiliariaContext } from '../../context';
import Carrusel from '../../componentes/Carrusel';
import MapProp from '../../componentes/MapaProp';
import ModalVideo from '../../componentes/ModalVideo';
import SEO, { siteUrl } from '../../componentes/SEO';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BotonWhatsApp from '../../componentes/BotonWhastApp';
import './estilos.css';

function formatearDescripcion(texto) {
    if (!texto || typeof texto !== 'string') return 'Consultanos para conocer más sobre esta propiedad.';
    let enLista = false;
    return texto.split(/(?<=[.:])\s*|\n+/).map(parte => parte.trim()).filter(Boolean).map((linea, index) => {
        if (linea.endsWith(':')) {
            enLista = true;
            return <p key={index}>{linea}</p>;
        }
        const tieneViñeta = /^(?:[•🔹▪●]|-\s)/u.test(linea);
        return <p key={index} className={enLista || tieneViñeta ? 'detalle-vineta' : undefined}>
            {tieneViñeta ? linea.replace(/^(?:[•🔹▪●]|-\s)\s*/u, '') : linea}
        </p>;
    });
}

function DetalleProp(){

    const { id } = useParams();  //let id = props.match.params.id 
    const propiedad = useSelector(state => state.propiedad);    
    const navigate = useNavigate();
    const dispatch = useDispatch();    
    const contexto = useContext(InmobiliariaContext); 
    const ubicacionPublica = propiedad.ubicacion?.direccionPublicacion || propiedad.ubicacion?.ciudad || 'Olavarria';
    const ofertas = obtenerOfertas(propiedad);
    const precioTexto = ofertas.map(oferta => `${oferta.operacion}: ${oferta.moneda || ''} ${oferta.precio != null ? formatMoney(oferta.precio) : 'Consultar'}`).join(' / ');
    const seoTitle = propiedad.tituloPublicacion
        ? `${propiedad.tituloPublicacion} en ${propiedad.operacion || 'propiedad'}`
        : 'Detalle de propiedad';
    const seoDescription = propiedad.tituloPublicacion
        ? `${propiedad.tipoPropiedad || 'Propiedad'} en ${propiedad.operacion || 'operacion'} ubicada en ${ubicacionPublica}${precioTexto ? `. Precio: ${precioTexto}` : ''}.`
        : 'Detalle de propiedad disponible en Forastieri Propiedades.';
    const imagenPrincipal = propiedad.imagenes?.[0]?.startsWith('http')
        ? propiedad.imagenes[0]
        : undefined;
    const propertyJsonLd = propiedad._id ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: propiedad.tituloPublicacion,
        description: propiedad.descripcion || seoDescription,
        url: `${siteUrl}/detalle/${id}`,
        image: propiedad.imagenes || [],
        category: `${propiedad.tipoPropiedad || 'Propiedad'} en ${propiedad.operacion || 'operacion'}`,
        brand: {
            '@type': 'RealEstateAgent',
            name: 'Forastieri Propiedades',
            url: siteUrl,
        },
        offers: ofertas.filter(oferta => oferta.precio != null).map(oferta => ({
            '@type': 'Offer',
            name: oferta.operacion,
            price: oferta.precio,
            priceCurrency: ['USD', 'U$S', 'U$D'].includes(oferta.moneda) ? 'USD' : 'ARS',
            availability: propiedad.estadoActual ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
            url: `${siteUrl}/detalle/${id}`,
        })),
    } : undefined;
    const direccion = [propiedad.ubicacion?.direccionPublicacion, propiedad.ubicacion?.ciudad, propiedad.ubicacion?.provincia].filter(Boolean).join(', ');
    const direccionMapa = [propiedad.ubicacion?.direccionReal, propiedad.ubicacion?.ciudad, propiedad.ubicacion?.provincia].filter(Boolean).join(', ');
    const superficie = valor => valor != null ? `${valor} m²` : 'Consultar';
    const caracteristicas = [
        ['Superficie total', superficie(propiedad.supTotal)],
        ...(propiedad.tipoPropiedad !== 'Terreno' ? [
            ['Superficie cubierta', superficie(propiedad.supCubierta)],
            ['Ambientes', propiedad.ambientes ?? 'Consultar'],
            ['Dormitorios', propiedad.dormitorios ?? 'Consultar'],
            ['Baños', propiedad.baños ?? 'Consultar'],
            ['Cocheras', propiedad.cantCocheras ?? 'Consultar'],
        ] : []),
    ];

    useEffect(() => {
        dispatch(getPropiedad(id));
        window.scrollTo(0, 0);
        return () => { dispatch(resetProperty()); };
    }, [dispatch, id]);

    return (
        <main className='contGralDetalle'>
            <SEO title={seoTitle} description={seoDescription} path={`/detalle/${id}`} image={imagenPrincipal} type='article' jsonLd={propertyJsonLd} />
            <div className='cont-detail'>
                <nav className='detalle-toolbar' aria-label='Acciones de la propiedad'>
                    <button type='button' onClick={() => navigate(-1)} className='detalle-accion'><ArrowBackIcon fontSize='small' /> Volver</button>
                    {propiedad.codigoReferencia != null && <span className='detalle-referencia'>Referencia {propiedad.codigoReferencia}</span>}
                </nav>

                <header className='detalle-cabecera'>
                    <div className='detalle-etiquetas'>
                        {propiedad.tipoPropiedad && <span>{propiedad.tipoPropiedad}</span>}
                        {ofertas.map(oferta => <span key={oferta.operacion}>{oferta.operacion}</span>)}
                        {propiedad.estadoActual && <span className='detalle-estado'>{propiedad.estadoActual}</span>}
                    </div>
                    <h1 className='detalle-titulo-prop'>{propiedad.tituloPublicacion || 'Detalle de la propiedad'}</h1>
                    {direccion && <p className='detalle-direccion'><LocationOnIcon fontSize='small' />{direccion}</p>}
                </header>

                <div className='detalle-principal'>
                    <div className='detalle-galeria-encabezado'>
                            <h2>Conocé la propiedad</h2>
                            {propiedad.video && typeof propiedad.video === 'string' && <button type='button' className='detalle-accion' onClick={() => contexto.handleIsOpen()}><OndemandVideoIcon fontSize='small' /> Ver video</button>}
                    </div>
                    <section className='detalle-galeria' aria-label='Fotografías de la propiedad'>
                        {propiedad.imagenes?.length > 0
                            ? <Carrusel key={id} imagenes={propiedad.imagenes} altBase={`${propiedad.tipoPropiedad || 'Propiedad'} en ${propiedad.operacion || 'operación'} - ${ubicacionPublica}`} />
                            : <div className='detalle-sin-imagen'>Fotografías no disponibles</div>}
                    </section>

                    <aside className='detalle-ficha' aria-label='Precio y características'>
                        <div className='detalle-precios'>
                            <p className='detalle-sobretitulo'>Precio de la propiedad</p>
                            <PreciosPropiedad propiedad={propiedad} />
                        </div>
                        <div className='detalle-caracteristicas'>
                            <h2>Características</h2>
                            <dl>{caracteristicas.map(([nombre, valor]) => <div key={nombre}><dt>{nombre}</dt><dd>{valor}</dd></div>)}</dl>
                        </div>
                    </aside>
                </div>

                <section className='detalle-descripcion' aria-labelledby='titulo-descripcion'>
                    <p className='detalle-sobretitulo'>Sobre esta propiedad</p>
                    <h2 id='titulo-descripcion'>Descripción</h2>
                    <div className='detalle-texto'>{formatearDescripcion(propiedad.descripcion)}</div>
                </section>

                {direccionMapa && <section className='detalle-ubicacion' aria-labelledby='titulo-ubicacion'>
                    <div className='detalle-ubicacion-encabezado'>
                        <div><p className='detalle-sobretitulo'>El entorno</p><h2 id='titulo-ubicacion'>Ubicación</h2></div>
                        <p className='detalle-direccion'><LocationOnIcon fontSize='small' />{direccion}</p>
                    </div>
                    <MapProp address={direccionMapa} />
                </section>}
                {contexto.isOpenModalVideo && <ModalVideo video={propiedad.video} />}
                <BotonWhatsApp />
            </div>
        </main>
    );
}

export default DetalleProp;
