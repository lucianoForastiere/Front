import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormularioProp from './index';

beforeEach(() => jest.spyOn(window, 'alert').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());
const venta = { operacion: 'Venta', moneda: 'U$D', precio: 120000 };
const alquiler = { operacion: 'Alquiler', moneda: '$', precio: 650000 };
const propiedad = {
    _id: '123', tituloPublicacion: 'Casa', tipoPropiedad: 'Casa', descripcion: 'Casa amplia',
    ubicacion: { direccionPublicacion: 'Centro', direccionReal: 'Centro 123', barrio: 'Centro', ciudad: 'Olavarria', provincia: 'Buenos Aires' },
    imagenes: ['casa.jpg'], servicios: [], ...venta,
};

test('permite crear con ambas operaciones y sus precios independientes', () => {
    const submit = jest.fn();
    const { container } = render(<FormularioProp op='creacion' handleOnSubmit={submit} />);
    for (const [id, value] of Object.entries({ tituloPublicacion: 'Casa', tipoPropiedad: 'Casa', descripcion: 'Casa amplia', ...propiedad.ubicacion })) {
        fireEvent.change(container.querySelector(`#${id}`), { target: { value } });
    }
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = jest.fn(() => 'blob:foto');
    fireEvent.change(container.querySelector('input[type="file"]'), { target: { files: [new File(['foto'], 'casa.jpg', { type: 'image/jpeg' })] } });
    URL.createObjectURL = originalCreateObjectURL;
    expect(screen.queryByLabelText('Moneda de venta')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Publicar en venta'));
    fireEvent.change(screen.getByLabelText('Valor de venta'), { target: { value: '120000' } });
    fireEvent.click(screen.getByLabelText('Publicar en alquiler'));
    fireEvent.change(screen.getByLabelText('Valor de alquiler'), { target: { value: '650000' } });
    expect(screen.getByLabelText('Publicar en venta')).toBeChecked();
    expect(screen.getByLabelText('Publicar en alquiler')).toBeChecked();
    fireEvent.submit(container.querySelector('form'));
    expect(submit).toHaveBeenLastCalledWith(expect.objectContaining({ operacion: 'Venta y Alquiler', ofertas: [venta, alquiler] }));
});

test('edita ambas ofertas y excluye del guardado la desmarcada sin perder valores al alternar', () => {
    const submit = jest.fn();
    const { container } = render(<FormularioProp propiedad={{ ...propiedad, ofertas: [venta, alquiler] }} op='editar' handleOnSubmit={submit} />);
    expect(screen.getByLabelText('Valor de venta')).toHaveValue(120000);
    expect(screen.getByLabelText('Valor de alquiler')).toHaveValue(650000);
    fireEvent.change(screen.getByLabelText('Moneda de alquiler'), { target: { value: 'U$D' } });
    fireEvent.change(screen.getByLabelText('Valor de alquiler'), { target: { value: '500' } });
    fireEvent.click(screen.getByLabelText('Publicar en venta'));
    fireEvent.submit(container.querySelector('form'));
    expect(submit).toHaveBeenLastCalledWith(expect.objectContaining({ operacion: 'Alquiler', ofertas: [{ ...alquiler, moneda: 'U$D', precio: 500 }] }));
    fireEvent.click(screen.getByLabelText('Publicar en venta'));
    expect(screen.getByLabelText('Valor de venta')).toHaveValue(120000);
    expect(screen.getByLabelText('Valor de alquiler')).toHaveValue(500);
});

test.each(['', '0', '-1'])('impide guardar una oferta activa con valor invalido: %s', valor => {
    const submit = jest.fn();
    const { container } = render(<FormularioProp propiedad={propiedad} op='editar' handleOnSubmit={submit} />);
    fireEvent.change(screen.getByLabelText('Valor de venta'), { target: { value: valor } });
    fireEvent.submit(container.querySelector('form'));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByText(/un valor mayor a cero/)).toBeInTheDocument();
});

test('exige una operacion y recupera moneda y precio historicos', () => {
    const submit = jest.fn();
    const { container } = render(<FormularioProp propiedad={{ ...propiedad, moneda: 'USD' }} op='editar' handleOnSubmit={submit} />);
    expect(screen.getByLabelText('Moneda de venta')).toHaveValue('U$D');
    expect(screen.getByLabelText('Valor de venta')).toHaveValue(120000);
    fireEvent.click(screen.getByLabelText('Publicar en venta'));
    fireEvent.submit(container.querySelector('form'));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByText(/al menos una/)).toBeInTheDocument();
});

test('conserva la operación de un alquiler temporario histórico al editar', () => {
    const submit = jest.fn();
    const { container } = render(<FormularioProp propiedad={{ ...propiedad, operacion: 'Alquiler temporario' }} op='editar' handleOnSubmit={submit} />);
    expect(screen.getByLabelText('Publicar en alquiler temporario')).toBeChecked();
    fireEvent.submit(container.querySelector('form'));
    expect(submit).toHaveBeenLastCalledWith(expect.objectContaining({ ofertas: [{ ...venta, operacion: 'Alquiler temporario' }] }));
});
