import React, { useState, useEffect, useRef } from 'react';
import './estilos.css';
import { obtenerOfertas, normalizarMoneda } from '../../Helps/ofertas';


function FormularioProp({propiedad, handleOnSubmit, op}) {
    const propiedadActual = propiedad || {};
    const nombreAlquiler = obtenerOfertas(propiedadActual).some(oferta => oferta.operacion === 'Alquiler temporario')
        ? 'Alquiler temporario' : 'Alquiler';
    const MONEDA_VENTA_DEFAULT = 'U$D';
    const MONEDA_ALQUILER_DEFAULT = '$';

    //tipo de propiedad
    const tipoProps = [
        'Casa', 'Departamento', 'PH', 'Oficina',
        'Local', 'Cochera', 'Galpón', 
        'Terreno', 'Quinta', 'Campo',
    ];
    const [tituloPublicacion, setTituloPublicacion] = useState('');
    //estado objeto tipo opeeracion
    const [operaciones, setOperaciones] = useState([]);
    const operacion = operaciones.join(' y ');
    //estado moneda
    const [monedaVenta, setMonedaVenta] = useState('');
    const [monedaAlq, setMonedaAlq] = useState('');
    //estado precios
    const [precioVenta, setPrecioVenta] = useState(null); 
    const [precioAlq, setPrecioAlq] = useState(null);
    const ofertas = [
        ...(operaciones.includes('Venta') ? [{ operacion: 'Venta', moneda: monedaVenta, precio: precioVenta }] : []),
        ...(operaciones.includes(nombreAlquiler) ? [{ operacion: nombreAlquiler, moneda: monedaAlq, precio: precioAlq }] : []),
    ];
    const erroresOfertas = () => {
        const errores = {};
        if (!ofertas.length) errores.operacion = 'Seleccioná al menos una operación';
        ofertas.forEach(oferta => {
            const sufijo = oferta.operacion === 'Venta' ? 'Venta' : 'Alq';
            if (!oferta.moneda) errores['moneda' + sufijo] = 'Seleccioná una moneda';
            if (!Number.isFinite(oferta.precio) || oferta.precio <= 0) errores['precio' + sufijo] = 'Ingresá un valor mayor a cero';
        });
        return errores;
    };
    //estados para ubicacion
    const [direccionPublicacion, setDireccionPublicacion] = useState('');
    const [direccionReal, setDireccionReal] = useState('');
    const [barrio, setBarrio] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [provincia, setProvincia] = useState(''); 
    //descrip
    const [descripcion, setDescripcion] = useState();
    const [tipoPropiedad, setTipoPropiedad] = useState();
    const [cantPisos, setCantPisos] = useState(null);
    const [ambientes, setAmbientes] = useState(null);
    const [dormitorios, setDormitorios] = useState(null);
    const [baños, setBaños] = useState(null);
    const [supCubierta, setSupCubierta] = useState(null);
    const [supSemiCub, setSupSemiCub] = useState(null);
    const [supDescubierta, setSupDescubierta] = useState(null);
    const [supTotal, setSupTotal] = useState(null);
    const [estado, setEstado] = useState('');
    const [antiguedad, setAntiguedad] = useState(null);
    const [expesnsas, setExpensas] = useState(null);
    const [cantCocheras, setCantCocheras] = useState(null);     
    //estado imgs
    const [vistaPrevia, setVistaPrevia] = useState([]);//vista previa
    const imagenes = vistaPrevia.map(img => img.file || img.url);
    const urlsLocales = useRef(new Set());
    const imagenArrastrada = useRef(null);
    const [destinoImagen, setDestinoImagen] = useState(null);
    const galeriaRef = useRef(null);
    const toqueEnCurso = useRef(false);
    const [arrastreTactil, setArrastreTactil] = useState(null);
    useEffect(() => {
        const urls = urlsLocales.current;
        return () => {
            urls.forEach(url => URL.revokeObjectURL(url));
            urls.clear();
        };
    }, []);
    //estado video
    const [video, setVideos] = useState([]);  
    const [vistaPreviaVideo, setVistaPreviaVideo] = useState([]);//vista previa
    //servicios
    const [servicios, setServicios] = useState([]);
    //vendida o alquilada
    const [estadoActual, setEstadoActual] = useState('');
    //estado para errores
    const [errors, setErrors] = useState({});
    //estado para errores ubicacion
    const [errorsU, setErrorsU] = useState({});
    //estado para vistas
    const [vista1, setVista1] = useState(true);  
    const [vista2, setVista2] = useState(false);
    const [vista3, setVista3] = useState(false);
    const [vista4, setVista4] = useState(false);
    
    const handleOnChangeTituloPublicacion = (e) => {
        setTituloPublicacion(e.target.value);
    };
    const handleOnChangeTipoPropiedad = (e) => {
        setTipoPropiedad(e.target.value);
    };
    const handleOnChangeOperacion = (nuevaOperacion, activa) => {
        setOperaciones(actuales => activa
            ? ['Venta', nombreAlquiler].filter(opcion => opcion === nuevaOperacion || actuales.includes(opcion))
            : actuales.filter(opcion => opcion !== nuevaOperacion));
        if (activa && nuevaOperacion === 'Venta') setMonedaVenta(actual => actual || MONEDA_VENTA_DEFAULT);
        if (activa && nuevaOperacion === nombreAlquiler) setMonedaAlq(actual => actual || MONEDA_ALQUILER_DEFAULT);
        setErrors({});
    };
    const handleOnChangeMonedaVenta = (e) => {
        setMonedaVenta(e.target.value);
    };
    const handleOnChangeMonedaAlq = (e) => {
        setMonedaAlq(e.target.value);
    };
    const handleOnChangePrecioVenta = (e) => {
        const value = e.target.value;
        setPrecioVenta(value === "" ? null : Number(value));
    };
    const handleOnChangePrecioAlq = (e) => {
        const value = e.target.value;
        setPrecioAlq(value === "" ? null : Number(e.target.value));
    };
    const handleOnChangeDescripcion = (e) => {
        setDescripcion(e.target.value);
    };    
    const handleOnChangeExpensas = (e) => {
        const { value } = e.target;
        setExpensas(value === '' ? null : Number(value));
    };
    const handleOnChangeCantPisos = (e) => {
        const { value } = e.target;
        setCantPisos(value === '' ? null : Number(value));
    };
    const handleOnChangeAmbientes = (e) => {
        const { value } = e.target;
        setAmbientes(value === '' ? null : Number(value));
    };
    const handleOnChangeDormitorios = (e) => {
        const { value } = e.target;
        setDormitorios(value === '' ? null : Number(value));
    };
    const handleOnChangeBaños = (e) => {
        const { value } = e.target;
        setBaños(value === '' ? null : Number(value));
    };
    const handleOnChangeSupCubierta = (e) => {
        const { value } = e.target;
        setSupCubierta(value === '' ? null : Number(value));
    };
    const handleOnChangeSupSemiCub = (e) => {
        const { value } = e.target;
        setSupSemiCub(value === '' ? null : Number(value));
    };
    const handleOnChangeSupDescubierta = (e) => {
        const { value } = e.target;
        setSupDescubierta(value === '' ? null : Number(value));
    };
    const handleOnChangeSupTotal = (e) => {
        const { value } = e.target;
        setSupTotal(value === '' ? null : Number(value));
    };
    const handleOnChangeEstado = (e) => {
        setEstado(e.target.value);
    };
    const handleOnChangeAntiguedad = (e) => {
        const { value } = e.target;
        setAntiguedad(value === '' ? null : Number(value));
    };
    const handleOnChangeCantCocheras = (e) => {
        const { value } = e.target;
        setCantCocheras(value === '' ? null : Number(value));
    };
    const handleOnChangeDireccionPublicacion = (e) => {
        setDireccionPublicacion(e.target.value);
    };
    const handleOnChangeDireccionReal = (e) => {
        setDireccionReal(e.target.value);
    };
    const handleOnChangeBarrio = (e) => {
        setBarrio(e.target.value);
    };
    const handleOnChangeCiudad = (e) => {
        setCiudad(e.target.value);
    };
    const handleOnChangeProvincia = (e) => {
        setProvincia(e.target.value);
    };
    const handleOnChangeImgs = (e) => {
        const previews = Array.from(e.target.files || []).map(file => {
            const url = URL.createObjectURL(file);
            urlsLocales.current.add(url);
            return { file, url };
        });
        setVistaPrevia(actuales => [...actuales, ...previews]);
        e.target.value = '';
    };
    const handleOnChangeVideos = (e) => {
        setVideos(e.target.files[0]);
        //para la vista previa
        const file = e.target.files[0];
        setVistaPreviaVideo(URL.createObjectURL(file));
    };
    const handleOnChangeServicios = (e) => {
        const { value, checked } = e.target;
        setServicios((prevServicios) =>
            checked ? [...prevServicios, value] : prevServicios.filter((s) => s !== value)
        );
    };
    const handleOnChangeEstadoActual = (e) => {
        setEstadoActual(e.target.value);
    };
    //funcion valida errores de los inputs
    const handleOnBlur = (e) => {
        const { id, value } = e.target;
        if(!value){
            setErrors({...errors, [id]: 'Campo requerido'});
        }else{
            setErrors({...errors, [id]: ''});
        }
    };
    // Validaciónes
    const validaDatosVista1 = () => {
        return tituloPublicacion 
        && tipoPropiedad
        && operacion
        && Object.keys(erroresOfertas()).length === 0
        && descripcion;        
    };
    //valida vista 2
    const validaDatosVista2 = () => {
        return direccionPublicacion 
            && direccionReal
            && barrio 
            && ciudad
            && provincia; 
    };
    //valida vista 3
    /* const validaDatosVista3 = () => {
        return ambientes
            && dormitorios
            && baños
            && supCubierta
            && supTotal;
    }; */
    //valida vista 4
    const validaDatosVista4 = () => {
        if(imagenes.length){
            return true
        }
        return false;
    };
    //btns vista 1
    const onClickSgtVista1 = () => {
        let hasErrors = false;
        const newErrors = {};

        if (!tituloPublicacion) {
            newErrors.tituloPublicacion = 'Campo requerido';
            hasErrors = true;
        }
        if (!descripcion) {
            newErrors.descripcion = 'Campo requerido';
            hasErrors = true;
        }
        if (!tipoPropiedad) {
            newErrors.tipoPropiedad = 'Campo requerido';
            hasErrors = true;
        }
        if (!operacion) {
            newErrors.operacion = 'Campo requerido';
            hasErrors = true;
        }

        Object.assign(newErrors, erroresOfertas());
        hasErrors = hasErrors || Object.keys(newErrors).length > 0;
        setErrors(newErrors);

        // Si hay errores, no avanzar
        if (hasErrors) {
            return;
        }

        // Si no hay errores, avanzar a la siguiente vista
        setVista1(false);
        setVista2(true);
    };
    //btns vista 2
    const onClickAtrasVista2 = () => {
        setVista1(true);
        setVista2(false);
    };
    const onClickSgtVista2 = () => {
        let hasErrors = false;
        const newErrors = {};

        if (!direccionPublicacion) {
            newErrors.direccionPublicacion = 'Campo requerido';
            hasErrors = true;
        }
        if (!direccionReal) {
            newErrors.direccionReal = 'Campo requerido';
            hasErrors = true;
        }
        if (!barrio) {
            newErrors.barrio = 'Campo requerido';
            hasErrors = true;
        }
        if (!ciudad) {
            newErrors.ciudad = 'Campo requerido';
            hasErrors = true;
        }
        if (!provincia) {
            newErrors.provincia = 'Campo requerido';
            hasErrors = true;
        }
        
        setErrorsU(newErrors);
        // Si hay errores, no avanzar
        if (hasErrors) {
            return;
        }
        //avanzo
        setVista1(false);
        setVista2(false);
        setVista3(true);
    };
    //btns vista 3
    const onClickAtrasVista3 = () => {
        setVista1(false);
        setVista2(true);
        setVista3(false);
    };
    const onClickSgtVista3 = () => {
        /* let hasErrors = false;
        const newErrors = {};

        if(!ambientes){
            newErrors.ambientes = 'Campo requerido';
            hasErrors = true;
        }
        if(!dormitorios){
            newErrors.dormitorios = 'Campo requerido';
            hasErrors = true;
        }
        if(!baños){
            newErrors.baños = 'Campo requerido';
            hasErrors = true;
        }
        if(!supCubierta){
            newErrors.supCubierta = 'Campo requerido';
            hasErrors = true;
        }
        if(!supTotal){
            newErrors.supTotal = 'Campo requerido';
            hasErrors = true;
        } */
        //setErrors(newErrors);
        // Si hay errores, no avanzar
        /* if (hasErrors) {
            return;
        } */
        setVista1(false);
        setVista2(false);
        setVista3(false);
        setVista4(true);
    };
    //btns vista 4
    const onClickAtrasVista4 = () => {
        setVista1(false);
        setVista2(false);
        setVista3(true);
        setVista4(false);
    };    
    //elimina img de vista previa
    const handleOnClickEliminaImg = (index) => {
        const img = vistaPrevia[index];
        if (img.file) {
            URL.revokeObjectURL(img.url);
            urlsLocales.current.delete(img.url);
        }
        setVistaPrevia(actuales => actuales.filter((_, posicion) => posicion !== index));
    };
    const moverImagen = (origen, destino) => {
        setVistaPrevia(actuales => {
            if (!Number.isInteger(origen) || origen < 0 || origen >= actuales.length || destino < 0 || destino >= actuales.length) return actuales;
            const ordenadas = [...actuales];
            const [imagen] = ordenadas.splice(origen, 1);
            ordenadas.splice(destino, 0, imagen);
            return ordenadas;
        });
    };

    useEffect(() => {
        const galeria = galeriaRef.current;
        let gesto = null;
        let temporizador;
        const cancelar = () => {
            clearTimeout(temporizador);
            gesto = null;
            toqueEnCurso.current = false;
            setArrastreTactil(null);
            setDestinoImagen(null);
        };
        const iniciar = e => {
            cancelar();
            if (e.touches.length !== 1 || e.target.closest('button, input, label')) return;
            const tarjeta = e.target.closest('[data-imagen-index]');
            if (!tarjeta) return;
            const dedo = e.touches[0];
            toqueEnCurso.current = true;
            gesto = { origen: Number(tarjeta.dataset.imagenIndex), x: dedo.clientX, y: dedo.clientY, activo: false, destino: null };
            temporizador = setTimeout(() => {
                if (!gesto) return;
                gesto.activo = true;
                setArrastreTactil({ url: vistaPrevia[gesto.origen].url, x: gesto.x, y: gesto.y });
            }, 350);
        };
        const mover = e => {
            if (!gesto) return;
            if (e.touches.length !== 1) { cancelar(); return; }
            const dedo = e.touches[0];
            if (!gesto.activo) {
                // Un deslizamiento antes de mantener pulsado sigue desplazando la página.
                if (Math.hypot(dedo.clientX - gesto.x, dedo.clientY - gesto.y) > 10) cancelar();
                return;
            }
            e.preventDefault();
            setArrastreTactil({ url: vistaPrevia[gesto.origen].url, x: dedo.clientX, y: dedo.clientY });
            const tarjeta = document.elementFromPoint(dedo.clientX, dedo.clientY)?.closest('[data-imagen-index]');
            gesto.destino = tarjeta && galeria.contains(tarjeta) ? Number(tarjeta.dataset.imagenIndex) : null;
            setDestinoImagen(gesto.destino);
            if (dedo.clientY < 70) window.scrollBy(0, -16);
            else if (dedo.clientY > window.innerHeight - 70) window.scrollBy(0, 16);
        };
        const terminar = () => {
            if (gesto?.activo && gesto.destino !== null) {
                const { origen, destino } = gesto;
                setVistaPrevia(actuales => {
                    const ordenadas = [...actuales];
                    const [imagen] = ordenadas.splice(origen, 1);
                    ordenadas.splice(destino, 0, imagen);
                    return ordenadas;
                });
            }
            cancelar();
        };
        galeria.addEventListener('touchstart', iniciar, { passive: true });
        // El listener nativo no pasivo permite detener el scroll sólo durante el arrastre.
        galeria.addEventListener('touchmove', mover, { passive: false });
        galeria.addEventListener('touchend', terminar);
        galeria.addEventListener('touchcancel', cancelar);
        return () => {
            clearTimeout(temporizador);
            galeria.removeEventListener('touchstart', iniciar);
            galeria.removeEventListener('touchmove', mover);
            galeria.removeEventListener('touchend', terminar);
            galeria.removeEventListener('touchcancel', cancelar);
        };
    }, [vistaPrevia]);
    
    //igualmente a pesar de que recibo del padre la función onsubmit, la vuelvo a definir acá
    const OnSubmit = (e) => {
        e.preventDefault();
        const erroresPrecio = erroresOfertas();
        if (Object.keys(erroresPrecio).length) {
            setErrors(erroresPrecio);
            setVista1(true);
            setVista2(false);
            setVista3(false);
            setVista4(false);
            return;
        }
        //valido
        if(!validaDatosVista1()){
            setErrors({...errors, tituloPublicacion: 'Campo requerido'});
        }
        if(!validaDatosVista2()){
            setErrorsU({...errorsU, direccionPublicacion: 'Campo requerido'});
        }
        /* if(!validaDatosVista3()){
            setErrors({...errors, ambientes: 'Campo requerido'});
        } */
        if(!validaDatosVista4()){
            alert('Debe cargar al menos una imagen');
            return;
        }
        // Construcción del objeto data
        const data = {
            tituloPublicacion,
            operacion: operacion,
            ofertas,
            moneda: ofertas[0]?.moneda,
            precio: ofertas[0]?.precio,
            tipoPropiedad,
            descripcion,
            ubicacion: {
                direccionPublicacion,
                direccionReal,
                barrio,
                ciudad,
                provincia,
            },
            cantPisos,
            ambientes,
            dormitorios,
            baños,
            supCubierta,
            supSemiCub,
            supDescubierta,
            supTotal,
            estado,
            antiguedad,
            expesnsas,
            cantCocheras,        
            imagenes,
            video,
            servicios,
            estadoActual
        };
        //envio
        handleOnSubmit(data);
    }


    //efecto para cargar los datos de la propiedad Si es editar
    useEffect(() => {
        if(propiedad?._id){
            setTituloPublicacion(propiedad.tituloPublicacion);
            setTipoPropiedad(propiedad.tipoPropiedad);
            const cargadas = obtenerOfertas(propiedad);
            setOperaciones(cargadas.map(oferta => oferta.operacion));
            const venta = cargadas.find(oferta => oferta.operacion === 'Venta');
            const alquiler = cargadas.find(oferta => oferta.operacion === 'Alquiler' || oferta.operacion === 'Alquiler temporario');
            setMonedaVenta(normalizarMoneda(venta?.moneda) || MONEDA_VENTA_DEFAULT);
            setPrecioVenta(venta?.precio ?? null);
            setMonedaAlq(normalizarMoneda(alquiler?.moneda) || MONEDA_ALQUILER_DEFAULT);
            setPrecioAlq(alquiler?.precio ?? null);
            setDescripcion(propiedad.descripcion);
            setCantPisos(propiedad.cantPisos);
            setAmbientes(propiedad.ambientes);
            setDormitorios(propiedad.dormitorios);
            setBaños(propiedad.baños);
            setSupCubierta(propiedad.supCubierta);
            setSupSemiCub(propiedad.supSemiCub);
            setSupDescubierta(propiedad.supDescubierta);
            setSupTotal(propiedad.supTotal);
            setEstado(propiedad.estado);
            setExpensas(propiedad.expesnsas);
            setAntiguedad(propiedad.antiguedad);
            setCantCocheras(propiedad.cantCocheras);
            //ubicacion
            setDireccionPublicacion(propiedad.ubicacion?.direccionPublicacion);
            setDireccionReal(propiedad.ubicacion?.direccionReal);
            setBarrio(propiedad.ubicacion?.barrio);
            setCiudad(propiedad.ubicacion?.ciudad);
            setProvincia(propiedad.ubicacion?.provincia);
            //imgs
            urlsLocales.current.forEach(url => URL.revokeObjectURL(url));
            urlsLocales.current.clear();
            setVistaPrevia((propiedad.imagenes || []).map((img) => ({ url: img })));
            //video
            setVideos(propiedad.video);
            setVistaPreviaVideo(propiedad.video);
            //servicios
            setServicios(propiedad.servicios);
            setEstadoActual(propiedad.estadoActual || '');
        }
    }
    , [propiedad]);


    return (
        <div className='cont-crea-prop'>
            <h1 className='titulo-crea-prop'>
            {
                op === 'editar' ? "Editar propiedad" : "Crear propiedad" 
            }
            </h1>
            <form onSubmit={OnSubmit} className='formulario-crea-prop'>
                {/* vista-1 */} {/* titulo, tipo Prop, Tipo Op, moneda, precio, Descrip */}
                <div className={vista1 ? 'vista-1' : 'notVista1'} id='vista-1'>
                    <div className='cont-data-vista-1'>
                        {/* titulo prop */}
                        <div className='cont-dato'>
                            <div style={{'display':'flex', 'justifyContent':'center', 'alignItems':'center'}}>
                                <label className='label-crea-prop'>Titulo publicación</label>
                                <p style={{ 'margin':'0', 'color':'red', 'fontSize':'23px'}}>*</p>
                                {errors.tituloPublicacion && (<p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.tituloPublicacion}</p>)}
                            </div>
                            <input 
                                type='text' 
                                id='tituloPublicacion' 
                                value={tituloPublicacion ?? ''}
                                onChange={(e) => { handleOnChangeTituloPublicacion(e) }} 
                                onBlur={handleOnBlur} 
                                className="input-tituloPublicacion" 
                            />
                        </div>
                        {/* tipo prop - estado Vendida/Alquilada */}
                        <div className='cont-tipo-prop-EstadoActual'>
                            <div className='cont-tipo-prop'>
                                <div style={{ 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center' }}>
                                    <label className='label-crea-prop'>Tipo propiedad</label>
                                    <p style={{ 'margin': '0', 'color': 'red', 'fontSize': '23px' }}>*</p>
                                </div>
                                <select
                                    id='tipoPropiedad'
                                    onChange={(e) => { handleOnChangeTipoPropiedad(e) }}
                                    onBlur={handleOnBlur}
                                    placeholder={propiedadActual.tipoPropiedad || ''}
                                    className='input-tituloPublicacion'
                                >
                                    <option value=''>{propiedad?.tipoPropiedad ? propiedad.tipoPropiedad : ''}</option>
                                    {
                                        tipoProps.map((tipo, index) => (
                                            <option key={index} value={tipo}>{tipo}</option>
                                        ))
                                    }
                                </select>
                                {errors.tipoPropiedad && (
                                    <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                        {errors.tipoPropiedad}
                                    </p>
                                )}
                            </div>
                            <div className='cont-estado-Vendida-Alquilada'>
                                <label className='label-crea-prop'>Vendida / Alquilada</label>
                                <select
                                    id='estadoActual'
                                    onChange={(e) => {handleOnChangeEstadoActual(e)}}
                                    onBlur={handleOnBlur}
                                    placeholder={propiedadActual.estadoActual || ''}
                                    className='input-tituloPublicacion'
                                >
                                    <option value=''>{propiedadActual.estadoActual || ''}</option>
                                    <option value={'Vendida'}>Vendida</option>
                                    <option value={'Alquilada'}>Alquilada</option>
                                    <option value={''}>Sin estado</option>
                                </select>
                            </div>
                        </div>
                        {/* operacion */}
                        <div className='cont-dato'>
                            <div style={{'display':'flex', 'justifyContent':'center', 'alignItems':'center'}}>
                                <label className='label-crea-prop'>Tipo operación</label>
                                <p style={{ 'margin':'0', 'color':'red', 'fontSize':'23px'}}>*</p>
                                {errors.operacion && (<p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.operacion}</p>)}
                            </div>
                            <p className='ayuda-operaciones'>Podés seleccionar una o ambas opciones. Cada operación tiene su moneda y valor.</p>
                            <div className='cont-operaciones operacion operacion-con-precios'>
                                {[
                                    { nombre: 'Venta', sufijo: 'Venta', moneda: monedaVenta, precio: precioVenta, cambiarMoneda: handleOnChangeMonedaVenta, cambiarPrecio: handleOnChangePrecioVenta },
                                    { nombre: nombreAlquiler, sufijo: 'Alq', moneda: monedaAlq, precio: precioAlq, cambiarMoneda: handleOnChangeMonedaAlq, cambiarPrecio: handleOnChangePrecioAlq },
                                ].map(opcion => {
                                    const activa = operaciones.includes(opcion.nombre);
                                    return (
                                        <div key={opcion.nombre} className={`tarjeta-operacion${activa ? ' seleccionada' : ''}`}>
                                            <label className='selector-operacion'>
                                                <input
                                                    type='checkbox'
                                                    checked={activa}
                                                    onChange={e => handleOnChangeOperacion(opcion.nombre, e.target.checked)}
                                                    aria-controls={`campos-${opcion.sufijo}`}
                                                />
                                                Publicar en {opcion.nombre.toLowerCase()}
                                            </label>
                                            {activa && (
                                                <div id={`campos-${opcion.sufijo}`} className='cont-precio-venta'>
                                                    <div className='campo-moneda'>
                                                        <label htmlFor={`moneda${opcion.sufijo}`}>Moneda</label>
                                                        <select
                                                            id={`moneda${opcion.sufijo}`}
                                                            aria-label={`Moneda de ${opcion.nombre.toLowerCase()}`}
                                                            value={opcion.moneda}
                                                            onChange={opcion.cambiarMoneda}
                                                        >
                                                            <option value='U$D'>U$D</option>
                                                            <option value='$'>$</option>
                                                        </select>
                                                        {errors[`moneda${opcion.sufijo}`] && <span className='error-oferta'>{errors[`moneda${opcion.sufijo}`]}</span>}
                                                    </div>
                                                    <div className='campo-valor'>
                                                        <label htmlFor={`precio${opcion.sufijo}`}>Valor</label>
                                                        <input
                                                            type='number'
                                                            min='0.01'
                                                            step='0.01'
                                                            placeholder='Ingresá el valor'
                                                            id={`precio${opcion.sufijo}`}
                                                            aria-label={`Valor de ${opcion.nombre.toLowerCase()}`}
                                                            value={opcion.precio ?? ''}
                                                            onChange={opcion.cambiarPrecio}
                                                            onBlur={handleOnBlur}
                                                            className='input-precio-venta'
                                                        />
                                                        {errors[`precio${opcion.sufijo}`] && <span className='error-oferta'>{errors[`precio${opcion.sufijo}`]}</span>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Descrip */}
                        <div className='cont-dato'>
                            <div style={{'display':'flex', 'justifyContent':'center', 'alignItems':'center'}}>
                                <label className='label-crea-prop'>Descripción</label>
                                <p style={{ 'margin':'0', 'color':'red', 'fontSize':'23px'}}>*</p>
                                {errors.descripcion && (
                                <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                    {errors.descripcion}
                                </p>
                            )}
                            </div>
                            <textarea 
                                id='descripcion' 
                                value={descripcion ?? ''}
                                onBlur={handleOnBlur}
                                onChange={(e) => { handleOnChangeDescripcion(e) }}  
                                rows="8" 
                                className='input-descripcion-prop' 
                            />
                        </div>
                        {/* btns Sgt-Atras */}
                        <div className='cont-campReq-botones'>
                                <div className='cont-campo-requerido'>
                                    <p>Campo requerido</p>
                                    <p style={{'color':'red', 'marginLeft':'3px'}}>*</p>
                                </div>
                                <div className='cont-botones-sgt-atras'>
                                    <button
                                        type='button' //sino se recarga la pag pensando q es el submit
                                        className='btn-sgt-vista1'
                                        onClick={() => onClickSgtVista1()}
                                    >
                                        Siguiente
                                    </button>
                                </div>                            
                        </div>                
                    </div>
                </div>
                {/* vista-2 */} {/* direcc real y publicacion, barrio, ciudad, provincia */}
                <div className={vista2 ? 'vista-2' : 'notVista2'} id='vista-2'>
                    <div className='cont-data-vista-2'>
                        {/* direccPubli y direccReal */}
                        <div className='cont-ubicacion'>
                            <div className='cont-ubicacion-direcc'>
                                <div style={{ 'display': 'flex', 'justifyContent': 'start', 'alignItems': 'center' }}>
                                    <label className='label-crea-prop'>Dirección Publicación</label>
                                    <p style={{ 'margin': '0', 'color': 'red', 'fontSize': '23px' }}>*</p>
                                </div>
                                <input 
                                    type='text' 
                                    id='direccionPublicacion' 
                                    value={direccionPublicacion ?? ''}
                                    onBlur={handleOnBlur} 
                                    onChange={(e) => { handleOnChangeDireccionPublicacion(e) }}
                                    placeholder='Lavalle 2500'
                                    className='input-tituloPublicacion' 
                                />
                                {errorsU.direccionPublicacion && (
                                    <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                        {errorsU.direccionPublicacion}
                                    </p>
                                )}
                            </div>
                            <div className='cont-ubicacion-barrio'>
                                <div style={{ 'display': 'flex', 'justifyContent': 'start', 'alignItems': 'center' }}>
                                    <label className='label-crea-prop'>Dirección Real</label>
                                    <p style={{ 'margin': '0', 'color': 'red', 'fontSize': '23px' }}>*</p>
                                </div>
                                <input 
                                    type='text' 
                                    id='direccionReal' 
                                    value={direccionReal ?? ''}
                                    onBlur={handleOnBlur}
                                    onChange={(e) => { handleOnChangeDireccionReal(e) }}
                                    placeholder='Lavalle 2570'
                                    className='input-tituloPublicacion' 
                                />
                                {errorsU.direccionReal && (
                                    <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                        {errorsU.direccionReal}
                                    </p>
                                )}
                            </div>
                        </div>                        
                        {/* barrio y ciudad */}
                        <div className='cont-ubicacion'>
                            <div className='cont-ubicacion-direcc'>
                                <div style={{ 'display': 'flex', 'justifyContent': 'start', 'alignItems': 'center' }}>
                                    <label className='label-crea-prop'>Barrio</label>
                                    <p style={{ 'margin': '0', 'color': 'red', 'fontSize': '23px' }}>*</p>
                                </div>
                                <input 
                                    type='text' 
                                    id='barrio' 
                                    value={barrio ?? ''}
                                    onBlur={handleOnBlur} 
                                    onChange={(e) => { handleOnChangeBarrio(e) }}
                                    placeholder='Centro'
                                    className='input-tituloPublicacion' 
                                />
                                {errorsU.barrio && (
                                    <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                        {errorsU.barrio}
                                    </p>
                                )}
                            </div>
                            <div className='cont-ubicacion-barrio'>
                                <div style={{ 'display': 'flex', 'justifyContent': 'start', 'alignItems': 'center' }}>
                                    <label className='label-crea-prop'>Ciudad</label>
                                    <p style={{ 'margin': '0', 'color': 'red', 'fontSize': '23px' }}>*</p>
                                </div>
                                <input 
                                    type='text' 
                                    id='ciudad' 
                                    value={ciudad ?? ''}
                                    onBlur={handleOnBlur}
                                    onChange={(e) => { handleOnChangeCiudad(e) }} 
                                    placeholder='Mar del Plata'
                                    className='input-tituloPublicacion' 
                                />
                                {errorsU.ciudad && (
                                    <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                        {errorsU.ciudad}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* provincia */}
                        <div className='cont-ubicacion'>
                            <label className='label-crea-prop'>Provincia</label>
                            <input
                                type='text'
                                id='provincia'
                                value={provincia ?? ''}
                                onBlur={handleOnBlur}
                                onChange={(e) => { handleOnChangeProvincia(e) }}
                                placeholder='Buenos Aires'
                                className='input-tituloPublicacion'
                            />
                            {errorsU.provincia && (
                                <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                    {errorsU.provincia}
                                </p>
                            )}
                        </div>
                        {/* btns Sgt-Atras */}
                        <div className='cont-campReq-botones'>
                            <div className='cont-campo-requerido'>
                                <p>Campo requerido</p>
                                <p style={{ 'color': 'red', 'marginLeft': '3px' }}>*</p>
                            </div>
                            <div className='cont-botones-sgt-atras-vista-2'>
                                <button 
                                    type='button' 
                                    className='btn-atras-vista-2' 
                                    onClick={()=>onClickAtrasVista2()}
                                >
                                    Atrás
                                </button>
                                <button 
                                    type='button' 
                                    className='btn-sgt-vista-2' 
                                    onClick={()=>onClickSgtVista2()}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* vista-3 */}
                <div className={vista3 ? 'vista-3' : 'notVista3'} id='vista-3'>
                    <div className='cont-data-vista-3'>
                        {/* amb, dorm, baño,  */}
                        {
                            tipoPropiedad !== 'Terreno' &&
                            <div className='cont-ambts'>
                                {/* amb */}
                                <div className='cont-amb'>
                                    <div style={{ 'display': 'flex', 'justifyContent': 'start', 'alignItems': 'center' }}>
                                        <label className='label-crea-prop'>Ambientes</label>
                                        {/* <p style={{ 'margin': '0', 'color': 'red', 'fontSize': '23px' }}>*</p> */}
                                    </div>
                                    <input
                                        type='number'
                                        id='ambientes'
                                        value={ambientes ?? ''}
                                        //onBlur={handleOnBlur}
                                        onChange={(e) => { handleOnChangeAmbientes(e) }}
                                        className='input-amb'
                                    />
                                    {errors.ambientes && (
                                        <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                            {errors.ambientes}
                                        </p>
                                    )}
                                </div>
                                {/* dormitorios */}
                                <div className='cont-amb'>
                                    <div style={{ 'display': 'flex', 'justifyContent': 'start', 'alignItems': 'center' }}>
                                        <label className='label-crea-prop'>Dormitorios</label>
                                        {/* <p style={{ 'margin': '0', 'color': 'red', 'fontSize': '23px' }}>*</p> */}
                                    </div>
                                    <input
                                        type='number'
                                        id='dormitorios'
                                        value={dormitorios ?? ''}
                                        //onBlur={handleOnBlur} 
                                        onChange={(e) => { handleOnChangeDormitorios(e) }}
                                        className='input-amb'
                                    />
                                    {errors.dormitorios && (
                                        <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                            {errors.dormitorios}
                                        </p>
                                    )}
                                </div>
                                {/* baños */}
                                <div className='cont-amb'>
                                    <div style={{ 'display': 'flex', 'justifyContent': 'start', 'alignItems': 'center' }}>
                                        <label className='label-crea-prop'>Baños</label>
                                        {/* <p style={{ 'margin': '0', 'color': 'red', 'fontSize': '23px' }}>*</p> */}
                                    </div>
                                    <input
                                        type='number'
                                        id='baños'
                                        value={baños ?? ''}
                                        //onBlur={handleOnBlur} 
                                        onChange={(e) => { handleOnChangeBaños(e) }}
                                        className='input-amb'
                                    />
                                    {errors.baños && (
                                        <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                            {errors.baños}
                                        </p>
                                    )}
                                </div>
                                <div className='cont-amb'>
                                    <label className='label-crea-prop'>Cant. pisos</label>
                                    <input
                                        type='number'
                                        id='cantPisos'
                                        value={cantPisos ?? ''}
                                        onChange={(e) => { handleOnChangeCantPisos(e) }}
                                        className='input-amb'
                                    />
                                </div>
                            </div>
                        }
                        {/* superficies*/}
                        <div className='cont-ambts'>
                            <div className='cont-amb'>
                                <div style={{ 'display': 'flex', 'justifyContent': 'start', 'alignItems': 'center' }}>
                                    <label className='label-crea-prop'>Sup cubierta</label>
                                    {/* <p style={{ 'margin': '0', 'color': 'red', 'fontSize': '23px' }}>*</p> */}
                                </div>
                                <input 
                                    type='number' 
                                    id='supCubierta' 
                                    value={supCubierta ?? ''}
                                    //onBlur={handleOnBlur}
                                    onChange={(e) => { handleOnChangeSupCubierta(e) }} 
                                    className='input-tituloPublicacion' 
                                />
                                {errors.supCubierta && (
                                    <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                        {errors.supCubierta}
                                    </p>
                                )}
                            </div>
                            <div className='cont-amb'>
                                <div style={{ 'display': 'flex', 'justifyContent': 'start', 'alignItems': 'center' }}>
                                    <label className='label-crea-prop'>Sup semicub</label>
                                </div>
                                <input 
                                    type='number' 
                                    id='supSemiCub' 
                                    value={supSemiCub ?? ''}
                                    onChange={(e) => { handleOnChangeSupSemiCub(e) }} 
                                    className='input-tituloPublicacion' 
                                />
                            </div>
                            <div className='cont-amb'>
                                <div style={{ 'display': 'flex', 'justifyContent': 'start', 'alignItems': 'center' }}>
                                    <label className='label-crea-prop'>Sup decubierta</label>
                                </div>
                                <input 
                                    type='number' 
                                    id='supDescubierta' 
                                    value={supDescubierta ?? ''}
                                    onChange={(e) => { handleOnChangeSupDescubierta(e) }} 
                                    className='input-tituloPublicacion' 
                                />
                            </div>
                            <div className='cont-amb'>
                                <div style={{ 'display': 'flex', 'justifyContent': 'start', 'alignItems': 'center' }}>
                                    <label className='label-crea-prop'>Sup Total</label>
                                    {/* <p style={{ 'margin': '0', 'color': 'red', 'fontSize': '23px' }}>*</p> */}
                                </div>
                                <input 
                                    type='number' 
                                    id='supTotal' 
                                    value={supTotal ?? ''}
                                    //onBlur={handleOnBlur} 
                                    onChange={(e) => { handleOnChangeSupTotal(e) }} 
                                    className='input-tituloPublicacion' 
                                />
                                {errors.supTotal && (
                                    <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                        {errors.supTotal}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* estado, antiguedad, cant cocheras */}
                        {
                            tipoPropiedad !== 'Terreno' &&
                            <div className='cont-ambts'>
                                <div className='cont-amb'>
                                    <label className='label-crea-prop'>Estado</label>
                                    <input
                                        type='text'
                                        id='estado'
                                        value={estado ?? ''}
                                        onChange={(e) => { handleOnChangeEstado(e) }}
                                        className='input-tituloPublicacion'
                                    />
                                </div>
                                <div className='cont-amb'>
                                    <label className='label-crea-prop'>Antiguedad</label>
                                    <input
                                        type='number'
                                        id='antiguedad'
                                        value={antiguedad ?? ''}
                                        onChange={(e) => { handleOnChangeAntiguedad(e) }}
                                        className='input-tituloPublicacion'
                                    />
                                </div>
                                {
                                    tipoPropiedad === "Departamento" && (
                                        <div className='cont-amb'>
                                            <label className='label-crea-prop'>Expensas</label>
                                            <input type='number' id='expensas' value={expesnsas ?? ''} onChange={(e) => { handleOnChangeExpensas(e) }} className='input-tituloPublicacion' />
                                        </div>
                                    )
                                }
                                <div className='cont-amb'>
                                    <div style={{ 'display': 'flex', 'justifyContent': 'start', 'alignItems': 'center' }}>
                                        <label className='label-crea-prop'>Cant cocheras</label>
                                    </div>
                                    <input
                                        type='number'
                                        id='cantCocheras'
                                        value={cantCocheras ?? ''}
                                        onChange={(e) => { handleOnChangeCantCocheras(e) }}
                                        className='input-tituloPublicacion'
                                    />
                                    {errors.cantCocheras && (
                                        <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                            {errors.cantCocheras}
                                        </p>
                                    )}
                                </div>
                            </div>
                        }
                        {/* btns Sgt-Atras */}
                        <div className='cont-campReq-botones'>
                            {/* <div className='cont-campo-requerido'>
                                <p>Campo requerido</p>
                                <p style={{ 'color': 'red', 'marginLeft': '3px' }}>*</p>
                            </div> */}
                            <div className='cont-botones-sgt-atras-vista-2'>
                                <button 
                                    type='button' 
                                    className='btn-atras-vista-2' 
                                    onClick={()=>onClickAtrasVista3()}>Atrás</button>
                                <button 
                                    type='button' 
                                    className='btn-sgt-vista-2' 
                                    onClick={()=>onClickSgtVista3()}
                                    /* disabled={!validaDatosVista3()} */
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* vista-4*/}
                <div className={vista4 ? 'vista-4' : 'notVista4'} id='vista-4'>
                    <div className='cont-data-vista-2'>
                        {/* servicios */}
                        <div className='cont-servicios'>
                            <p className='titulo-servicio'>Servicios</p>
                            <div className='sub-cont-servicios'>
                                <div className='cont-servicio'>
                                    <label className='label-crea-prop'>Luz eléctrica</label>
                                    <input 
                                        type='checkbox' 
                                        id='luz' 
                                        value={"luz"} 
                                        checked={servicios?.includes('luz')}
                                        onChange={(e) => { handleOnChangeServicios(e) }} 
                                        className='check-luz' 
                                    />
                                </div>
                                <div className='cont-servicio'>
                                    <label className='label-crea-prop'>Gas</label>
                                    <input 
                                        type='checkbox' 
                                        id='gas' 
                                        value={"gas"}
                                        checked={servicios?.includes('gas')} 
                                        onChange={(e) => { handleOnChangeServicios(e) }} 
                                        className='check-luz' 
                                    />
                                </div>
                                <div className='cont-servicio'>
                                    <label className='label-crea-prop'>Cloaca</label>
                                    <input 
                                        type='checkbox' 
                                        id='cloaca' 
                                        value={"cloaca"}
                                        checked={servicios?.includes('cloaca')} 
                                        onChange={(e) => { handleOnChangeServicios(e) }} 
                                        className='check-luz' 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* carga de img */}
                        <div className="img-cloudinary">
                            <div style={{ 'display': 'flex', 'justifyContent': 'start', 'alignItems': 'center' }}>
                                <label className='label-crea-prop'>Imágenes</label>
                                <p style={{ 'margin': '0', 'color': 'red', 'fontSize': '23px' }}>*</p>
                            </div>
                            <input type="file" aria-label="Agregar imágenes" accept="image/*" multiple onChange={handleOnChangeImgs}/>
                            <p className="ayuda-imagenes">Podés agregar varias fotos en distintas tandas. Arrastralas para ordenarlas; en el celular, mantené el dedo sobre una foto y movela. Marcá Portada para elegir la foto principal, que irá primero.</p>
                        </div>
                        {/* muestra ims miniatura */}
                        <div className="image-preview galeria-ordenable" ref={galeriaRef}>
                            {
                                vistaPrevia?.map((img, index) => (
                                    <div key={img.url} className={`cont-img-miniatura tarjeta-imagen ${destinoImagen === index ? 'destino-imagen' : ''}`}
                                        data-imagen-index={index}
                                        tabIndex={0}
                                        aria-label={`Foto ${index + 1}. Usá las flechas del teclado para moverla.`}
                                        onKeyDown={e => {
                                            if (e.target !== e.currentTarget) return;
                                            if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
                                                e.preventDefault();
                                                moverImagen(index, index + (['ArrowLeft', 'ArrowUp'].includes(e.key) ? -1 : 1));
                                            }
                                        }}
                                        onContextMenu={e => e.preventDefault()}
                                        draggable
                                        onDragStart={e => {
                                            if (toqueEnCurso.current) { e.preventDefault(); return; }
                                            imagenArrastrada.current = index;
                                            e.dataTransfer.effectAllowed = 'move';
                                            e.dataTransfer.setData('text/plain', String(index));
                                        }}
                                        onDragOver={e => {
                                            if (imagenArrastrada.current === null) return;
                                            e.preventDefault();
                                            e.dataTransfer.dropEffect = 'move';
                                            setDestinoImagen(index);
                                        }}
                                        onDrop={e => {
                                            e.preventDefault();
                                            moverImagen(imagenArrastrada.current, index);
                                            imagenArrastrada.current = null;
                                            setDestinoImagen(null);
                                        }}
                                        onDragEnd={() => { imagenArrastrada.current = null; setDestinoImagen(null); }}
                                    >
                                        <span className="posicion-imagen">{index === 0 ? '1 · Portada' : `Foto ${index + 1}`}</span>
                                        <img src={img.url} alt={`Foto ${index + 1}`} draggable={false} className='img-miniatura'/>
                                        <button 
                                            type='button'
                                            className='btn-elimina-img'
                                            aria-label={`Eliminar foto ${index + 1}`}
                                            onClick={()=>{handleOnClickEliminaImg(index)}}
                                        >
                                            X
                                        </button>
                                        <label className="selector-portada">
                                            <input type="checkbox" aria-label={`Portada: foto ${index + 1}`} checked={index === 0} onChange={() => moverImagen(index, 0)} />
                                            Portada
                                        </label>
                                    </div>
                                ))
                            }
                        </div>

                        {/* carga video */}
                        {arrastreTactil && <img className="imagen-en-arrastre" src={arrastreTactil.url} alt="" aria-hidden="true" style={{ left: arrastreTactil.x, top: arrastreTactil.y }} />}
                        <div className="video-cloudinary">
                            <label className='label-crea-prop'>Video</label>
                            <input type="file" accept="video/*" onChange={(e)=>{handleOnChangeVideos(e)}} />
                        </div>
                        {/* muestra video */}
                        <div className="video-preview">
                            {
                                vistaPreviaVideo && (
                                    <video src={vistaPreviaVideo} /* controls */ className='video-miniatura'></video>
                                )
                            }
                            
                        </div>

                        {/* btns Sgt-Atras */}
                        <div className='cont-campReq-botones'>
                            <div className='cont-campo-requerido'>
                                <p>Campo requerido</p>
                                <p style={{ 'color': 'red', 'marginLeft': '3px' }}>*</p>
                            </div>
                            <div className='cont-botones-sgt-atras-vista-2'>
                                <button 
                                    type='button' 
                                    className='btn-atras-vista-2' 
                                    onClick={()=>onClickAtrasVista4()}
                                >
                                    Atrás
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* btns crea */}
                <div 
                    className={
                        validaDatosVista1() && 
                        validaDatosVista2() && 
                        //validaDatosVista3() &&
                        validaDatosVista4()
                        ? 'cont-botones-crea-prop' 
                        : 'cont-botones-crea-prop-Disable'
                    }
                >
                    <button type='submit' className='btn-crea'>
                        {
                            op === 'creacion' ? 'Crear propiedad' : 'Editar propiedad'
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormularioProp;

/*



*/
