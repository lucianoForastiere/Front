import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Card from './index';
import { formatMoney } from '../../Helps';

test('muestra ambos precios y los conserva al agregar la propiedad a favoritos', () => {
    localStorage.clear();
    const ofertas = [
        { operacion: 'Venta', moneda: 'U$D', precio: 120000 },
        { operacion: 'Alquiler', moneda: '$', precio: 650000 },
    ];
    render(<MemoryRouter><Card id='123' operacion='Venta y Alquiler' ofertas={ofertas} imagenes={['casa.jpg']} /></MemoryRouter>);
    expect(screen.getByText(`U$D ${formatMoney(120000)}`)).toBeInTheDocument();
    expect(screen.getByText(`$ ${formatMoney(650000)}`)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(JSON.parse(localStorage.getItem('favorites'))[0].ofertas).toEqual(ofertas);
    localStorage.clear();
});
