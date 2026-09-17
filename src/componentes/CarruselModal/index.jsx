import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { isOpenModalPicture } from '../../redux/actions';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './styles.css';

function CarruselModal({imagenes, initialIndex = 0}) {


    const [indexImgActual, setIndexImgActual] = useState(initialIndex);
    const dispatch = useDispatch();

    const handleOnclickClose = () =>{
        dispatch(isOpenModalPicture());
    };
    const handleClickPrev = () => {
        if(indexImgActual === 0){ return }
        else{
            setIndexImgActual(indexImgActual - 1);
        }
    };
    const handleClickNext = () => {
        if(indexImgActual === imagenes.length -1){ return }
        else{
            setIndexImgActual(indexImgActual + 1);
        }
    };
    
    
    return (
        <div className='contGralCarruselM'>
            <div className='cont-img-btns'>
                {/* btn atrás */}
                <button type='button' aria-label='Foto anterior ampliada' disabled={indexImgActual === 0} className='btn-carrusel-prev' onClick={() => handleClickPrev()}>
                    <ArrowBackIosNewIcon />
                </button>

                {/* imagen a ostrar */}
                <div className='cont-img-carruselM-btnCierraModal'>
                    <div className='cont-btn-cierra-modal'>
                        <button
                            className='btn-close-modal'
                            type='button'
                            aria-label='Cerrar fotografía'
                            onClick={() => handleOnclickClose()}
                        >
                            <b>X</b>
                        </button>
                    </div>
                    <img src={imagenes[indexImgActual]} alt={`Fotografía ampliada ${indexImgActual + 1}`} className='img-carruselM' />
                </div>

                {/* btn prox */}
                <button type='button' aria-label='Foto siguiente ampliada' disabled={indexImgActual === imagenes.length - 1} className='btn-carrusel-next' onClick={() => handleClickNext()}>
                    <ArrowForwardIosIcon />
                </button>
            </div>
        </div>
    )
}

export default CarruselModal
