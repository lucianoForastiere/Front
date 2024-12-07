import React, { useState } from 'react';
import { actual } from '../../urls';
import FormularioProp from '../../componentes/FormularioPropiedad';
import './estilos.css';

function CreaPropiedad() {

    //tipo de propiedad
    const tipoProps = [
        'Casa', 'Departamento', 'PH', 'Oficina',
        'Local', 'Cochera', 'Galpón', 
        'Terreno', 'Quinta', 'Campo',
    ];
    const [data, setData] = useState({
        tituloPublicacion: '',
        descripcion: '',
        tipoPropiedad: '',
        expesnsas: '',       
        cantPisos: 0,
        ambientes: 0,
        dormitorios: 0,
        baños: 0,
        supCubierta: 0,
        supSemiCub: 0,
        supDescubierta: 0,
        supTotal: 0,
        estado: '',
        antiguedad: 0,
        cantCocheras: 0,
    }); 
    //estado tipos de operacion
    const [opVenta, setOpVenta] = useState(''); 
    const [opAlquiler, setOpAlquiler] = useState('');
    //estado moneda
    const [monedaVenta, setMonedaVenta] = useState('U$D');
    const [monedaAlq, setMonedaAlq] = useState('$');
    //estado precios
    const [precioVenta, setPrecioVenta] = useState();
    const [precioAlq, setPrecioAlq] = useState(); 
    //estado operacio
    const [operacion, setOperacion] = useState([]);
    //estado ubicacion
    //direc real, direc publi, prov, ciudad, barrio
    const [ubicacion, setUbicacion] = useState({
        direccionPublicacion: '',
        direccionReal: '',
        barrio: '',
        ciudad: '',
        provincia: '',
    });
    //estado imgs
    const [imagenes, setImagenes] = useState([]);
    const [vistaPrevia, setVistaPrevia] = useState([]);//vista previa
    //estado video
    const [video, setVideos] = useState();  
    const [vistaPreviaVideo, setVistaPreviaVideo] = useState([]);//vista previa
    //servicios
    const [servicios, setServicios] = useState([]);
    const [errors, setErrors] = useState({});
    const [errorsU, setErrorsU] = useState({});
    //estado para vistas
    const [vista1, setVista1] = useState(true);  
    const [vista2, setVista2] = useState(false);
    const [vista3, setVista3] = useState(false);
    const [vista4, setVista4] = useState(false);
    

    // Validación para habilitar/deshabilitar el botón "Siguiente" en la vista 1
    const validaDatosVista1 = () => {
        return data.tituloPublicacion && data.descripcion && data.tipoPropiedad;
    };
    //valida vista 2
    const validaDatosVista2 = () => {
        return ubicacion.direccionPublicacion 
            && ubicacion.direccionReal
            && ubicacion.barrio 
            && ubicacion.ciudad
            && ubicacion.provincia; 
    };
    //valida vista 3
    const validaDatosVista3 = () => {
        if(
            data.tipoPropiedad === 'Terreno' ||
            data.tipoPropiedad === 'Cochera' ||
            data.tipoPropiedad === 'Local' ||
            data.tipoPropiedad === 'Quinta' ||
            data.tipoPropiedad === 'Campo' ||
            data.tipoPropiedad === 'Galpón'
        ){
            return true;
        }
        return data.ambientes
            && data.dormitorios
            && data.baños
            && data.supCubierta
            && data.supTotal
            && data.cantCocheras;
    };
    //valida vista 4
    const validaDatosVista4 = () => {
        if(imagenes.length){
            return true
        }
        return false;
    };

    const handleOnChangeData = (e) => {
        const { id, value } = e.target;
        setData({...data, [id]: value});

        //quito msj de error
        if(value){
            const errores = {...errors};
            //elimino
            delete errores[id];
            //actualizo
            setErrors(errores);
        }
    };
    const handleOnChangeUbicacion = (e) => {
        const { id, value } = e.target;
        setUbicacion({...ubicacion, [id]: value});

        if(value){
            const erroresU = {...errorsU};
            delete erroresU[id];
            setErrorsU(erroresU);
        }
    };
    const handleOnChangeOpVenta = (e) => {
        const { value, checked } = e.target;
        if(checked){
            setOpVenta(value);
        }
    };
    const handleOnChangeOpAlquiler = (e) => {
        const { value, checked } = e.target;
        if(checked){
            setOpAlquiler(value);
            setOperacion([
                ...operacion, 
                {
                    tipoOperacion: value,
                    moneda: monedaAlq,
                    precio: precioAlq,
                }
            ]);
        }else{
            setOpAlquiler('');
            setPrecioAlq(0);
        }
    };
    const handleOnChangeMonedaVenta = (e) => {
        setMonedaVenta(e.target.value);
    };
    const handleOnChangeMonedaAlq = (e) => {
        setMonedaAlq(e.target.value);
    };
    const handleOnChangePrecioVenta = (e) => {
        setPrecioVenta(Number(e.target.value));
    };
    const handleOnChangePrecioAlq = (e) => {
        setPrecioAlq(Number(e.target.value));
    };
    const handleOnChangeImgs = (e) => {
        const filesArray = Array.from(e.target.files); //convierto e.target.files en un array
        setImagenes(filesArray);
        const files = Array.from(e.target.files);
        //para la vista previa
        const previews = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setVistaPrevia(previews);
    };
    const handleOnChangeVideos = (e) => {
        setVideos(e.target.files[0]);
        //para la vista previa
        const file = e.target.files[0];
        setVistaPreviaVideo(URL.createObjectURL(file));
    };
    const handleOnChangeServicios = (e) => {
        const {value, checked} = e.target;
        
        setServicios((prevServicios) => 
            checked ? [...prevServicios, value] : prevServicios.filter(s => s !== value)
        );
    };
    //btns vista 1 y actualizo operacion
    const onClickSgtVista1 = () => {
        setVista1(false);
        setVista2(true);

        //actualizo operacion
        if(opVenta){
            setOperacion([
                ...operacion, 
                {
                    tipoOperacion: opVenta,
                    moneda: monedaVenta,
                    precio: precioVenta,
                }
            ]);
        }
    };
    //btns vista 2
    const onClickAtrasVista2 = () => {
        setVista1(true);
        setVista2(false);
    };
    const onClickSgtVista2 = () => {
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
    //btns crea
    const handleOnSubmit = async(e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('data', JSON.stringify({
            ...data,
            operacion,
            ubicacion,
            servicios,
            video,
        }));

    imagenes.forEach((imagen, index) => {
        formData.append('imagenes', imagen);
    });

        try {
            const response = await fetch(`${actual}/propiedades`, {
                method: 'POST',
                body: formData,
            });
            
            if(response.ok){
                alert('Propiedad creada con éxito');
                //limpio
                setData({
                    tituloPublicacion: '',
                    descripcion: '',
                    tipoPropiedad: '',
                    expesnsas: '',       
                    cantPisos: 0,
                    ambientes: 0,
                    dormitorios: 0,
                    baños: 0,
                    supCubierta: 0,
                    supSemiCub: 0,
                    supDescubierta: 0,
                    supTotal: 0,
                    estado: '',
                    antiguedad: 0,
                    cantCocheras: 0,
                });
                setOpVenta('');
                setOpAlquiler('');
                setMonedaVenta('U$D');
                setMonedaAlq('$');
                setPrecioVenta(0);
                setPrecioAlq(0);
                setOperacion([]);
                setUbicacion({
                    direccionPublicacion: '',
                    direccionReal: '',
                    barrio: '',
                    ciudad: '',
                    provincia: '',
                });
                setImagenes([]);
                setVistaPrevia([]);
                setVideos();
                setVistaPreviaVideo([]);
                setServicios([]);
                //quitar la seleccion de los checkbox
                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach((checkbox) => {
                    checkbox.checked = false;
                });
                setVista1(true);
                setVista2(false);
                setVista3(false);
                setVista4(false);
            }else{
                alert('Error al crear la propiedad');
            }

        } catch (error) {
            console.log(error);
        }
    };
    //elimina img de vista previa
    const handleOnClickEliminaImg = (index) => {
        const previews = [...vistaPrevia];
        previews.splice(index, 1);
        setVistaPrevia(previews);
    };

    return (
        <div className='cont-page-crea-prop'>
            <FormularioProp 
                tipoOperacion={"creacion"}
                tipoProps={tipoProps}
                data={data}
                setData={setData}
                errors={errors}
                setErrors={setErrors}
                ubicacion={ubicacion}
                setUbicacion={setUbicacion}
                errorsU={errorsU}
                setErrorsU={setErrorsU}
                opVenta={opVenta}
                setOpVenta={setOpVenta}
                opAlquiler={opAlquiler}
                setOpAlquiler={setOpAlquiler}
                monedaVenta={monedaVenta}
                setMonedaVenta={setMonedaVenta}
                monedaAlq={monedaAlq}
                setMonedaAlq={setMonedaAlq}
                precioVenta={precioVenta}
                setPrecioVenta={setPrecioVenta}
                precioAlq={precioAlq}
                setPrecioAlq={setPrecioAlq}
                operacion={operacion}
                setOperacion={setOperacion}
                handleOnChangeData={handleOnChangeData}
                handleOnChangeUbicacion={handleOnChangeUbicacion}
                handleOnChangeOpVenta={handleOnChangeOpVenta}
                handleOnChangeOpAlquiler={handleOnChangeOpAlquiler}
                handleOnChangeMonedaVenta={handleOnChangeMonedaVenta}
                handleOnChangeMonedaAlq={handleOnChangeMonedaAlq}
                handleOnChangePrecioVenta={handleOnChangePrecioVenta}
                handleOnChangePrecioAlq={handleOnChangePrecioAlq}
                handleOnChangeImgs={handleOnChangeImgs}
                handleOnChangeVideos={handleOnChangeVideos}
                handleOnChangeServicios={handleOnChangeServicios}
                handleOnSubmit={handleOnSubmit}
                validaDatosVista1={validaDatosVista1}
                validaDatosVista2={validaDatosVista2}
                validaDatosVista3={validaDatosVista3}
                validaDatosVista4={validaDatosVista4}
                onClickSgtVista1={onClickSgtVista1}
                onClickAtrasVista2={onClickAtrasVista2}
                onClickSgtVista2={onClickSgtVista2}
                onClickAtrasVista3={onClickAtrasVista3}
                onClickSgtVista3={onClickSgtVista3}
                onClickAtrasVista4={onClickAtrasVista4}
                handleOnClickEliminaImg={handleOnClickEliminaImg}
                vista1={vista1}
                vista2={vista2}
                vista3={vista3}
                vista4={vista4}
                vistaPrevia={vistaPrevia}
                vistaPreviaVideo={vistaPreviaVideo}
            />
        </div>
    )
}

export default CreaPropiedad