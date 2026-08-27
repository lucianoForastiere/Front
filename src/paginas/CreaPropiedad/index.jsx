import React, { useContext } from 'react';
import { actual } from '../../urls';
import { InmobiliariaContext } from '../../context';
import FormularioProp from '../../componentes/FormularioPropiedad';
import Swal from 'sweetalert2';
import './estilos.css';

function CreaPropiedad() {

    const context = useContext(InmobiliariaContext);

    const handleOnSubmit = async(data) => {

        const formData = new FormData();
        formData.append('data', JSON.stringify({
            tituloPublicacion: data.tituloPublicacion,
            tipoPropiedad: data.tipoPropiedad,
            operacion: data.operacion,
            moneda: data.moneda,
            precio: data.precio,
            descripcion: data.descripcion,
            ubicacion: data.ubicacion,
            cantPisos: data.cantPisos,
            ambientes: data.ambientes,
            dormitorios: data.dormitorios,
            baños: data.baños,
            supCubierta: data.supCubierta,
            supSemiCub: data.supSemiCub,
            supDescubierta: data.supDescubierta,
            supTotal: data.supTotal,
            estado: data.estado,
            antiguedad: data.antiguedad,
            cantCocheras: data.cantCocheras,
            expensas: data.expensas,
            servicios: data.servicios,
            imagenes: data.imagenes,
            video: data.video,
            estadoActual: data.estadoActual
        }));

        data.imagenes?.forEach((imagen, index) => {
            formData.append('imagenes', imagen);
        });

        try {
            const response = await fetch(`${actual}/propiedades`, {
                method: 'POST',
                body: formData,
            });
            if(response.ok){
                Swal.fire({
                    title: 'Propiedad creada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3f51b5',
                });
                //redirijo a la lista de propiedades
                window.location.href = '/admin/listaPropsAdmin';
            }else{
                Swal.fire({
                    title: 'Error al crear la propiedad',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3f51b5',
                });
            }           
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="contenedor-crea-prop">
            {
            context.isAuthenticated ? (                
                    <FormularioProp handleOnSubmit={handleOnSubmit} op='creacion'/>
            ) : (
                <h1>No tienes permisos para acceder a esta página</h1>
            )
        }
        </div>
    )
}

export default CreaPropiedad;


/*

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

*/

/*
‼️Departamento en la ciudad de mar del plata, zona centro.
🔹Posee cocina/comedor, habitación, baño, balcón.
🔹Todos sus ambientes dan a Avenida Independencia.
🔹Muy luminoso.
🔹Todo eléctrico.
🔹Torre de categoría.
🔹Quincho equipado para 15/20 pers.
🔹Cochera propia.
*/
