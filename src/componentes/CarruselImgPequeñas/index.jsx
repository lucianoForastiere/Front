import React, { useRef, useEffect } from 'react';
import './styles.css';

function CarruselImgPequeñas({ imagenes, indexImgActual, handleClick }) {
    const imgRefs = useRef([]);

    useEffect(() => {
        if (imgRefs.current[indexImgActual]) {
            imgRefs.current[indexImgActual].scrollIntoView({
                behavior: 'auto', // 'auto' para el primer render
                inline: 'nearest',
                block: 'nearest'
            });
        }
    }, [indexImgActual]);


    return (
        <div className="miniaturas-container">
            {imagenes?.map((img, index) => (
                <img
                    key={index}
                    ref={element => { imgRefs.current[index] = element; }}
                    src={img}
                    alt={`Miniatura ${index + 1}`}
                    className={`miniatura ${index === indexImgActual ? 'active' : ''}`}
                    onClick={() => handleClick(index)}
                    role='button'
                    tabIndex={0}
                    aria-label={`Ver foto ${index + 1}`}
                    aria-pressed={index === indexImgActual}
                    onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(index); }
                    }}
                />
            ))}
        </div>
    );
}

export default CarruselImgPequeñas;
