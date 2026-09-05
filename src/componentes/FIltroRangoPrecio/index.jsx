import React from 'react';
import './styles.css';

const FiltraPrecio = ({precioMin, precioMax, setPrecioMin, setPrecioMax, setCurrentPage }) => {

    const handleMinPriceChange = (event) => {
        if (event.target.value === '') {
            setPrecioMin('');
            if (typeof setCurrentPage === 'function') {
                setCurrentPage(1);
            }
            return;
        }

        const numericValue = Number(event.target.value);
        const value = precioMax === '' ? Math.max(0, numericValue) : Math.max(0, Math.min(numericValue, precioMax));
        setPrecioMin(value);
        if (typeof setCurrentPage === 'function') {
            setCurrentPage(1);
        }
    };

    const handleMaxPriceChange = (event) => {
        if (event.target.value === '') {
            setPrecioMax('');
            if (typeof setCurrentPage === 'function') {
                setCurrentPage(1);
            }
            return;
        }

        const numericValue = Number(event.target.value);
        const value = precioMin === '' ? numericValue : Math.max(numericValue, precioMin);
        setPrecioMax(value);
        if (typeof setCurrentPage === 'function') {
            setCurrentPage(1);
        }
    };


    return (
        <div className="price-range-filter">
            <div className="price-filter-header">
                <p className="subtitulo-filtro">Rango de precio</p>
            </div>
            <div className="price-inputs">
                <label className="price-input-field">
                    <span>Minimo</span>
                    <input
                        type="number"
                        min="0"
                        step="1000"
                        value={precioMin}
                        onChange={handleMinPriceChange}
                    />
                </label>
                <label className="price-input-field">
                    <span>Maximo</span>
                    <input
                        type="number"
                        min={precioMin || 0}
                        step="1000"
                        value={precioMax}
                        onChange={handleMaxPriceChange}
                    />
                </label>
            </div>
        </div>
    );
};

export default FiltraPrecio;
