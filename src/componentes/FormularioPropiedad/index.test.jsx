import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormularioProp from './index';

beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    URL.createObjectURL = jest.fn(file => `blob:${file.name}`);
    URL.revokeObjectURL = jest.fn();
});
afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });
const venta = { operacion: 'Venta', moneda: 'U$D', precio: 120000 };
const alquiler = { operacion: 'Alquiler', moneda: '$', precio: 650000 };
const propiedad = {
    _id: '123', tituloPublicacion: 'Casa', tipoPropiedad: 'Casa', descripcion: 'Casa amplia',
    ubicacion: { direccionPublicacion: 'Centro', direccionReal: 'Centro 123', barrio: 'Centro', ciudad: 'Olavarria', provincia: 'Buenos Aires' },
    imagenes: ['casa.jpg'], servicios: [], ...venta,
};

test('agrega tandas, reordena fotos existentes y nuevas y guarda el orden visible', () => {
    const submit = jest.fn();
    const { container, unmount } = render(<FormularioProp propiedad={propiedad} op='editar' handleOnSubmit={submit} />);
    const entrada = screen.getByLabelText('Agregar imágenes');
    const patio = new File(['patio'], 'patio.jpg', { type: 'image/jpeg' });
    const cocina = new File(['cocina'], 'cocina.jpg', { type: 'image/jpeg' });
    const frente = new File(['frente'], 'frente.jpg', { type: 'image/jpeg' });
    fireEvent.change(entrada, { target: { files: [patio, cocina] } });
    fireEvent.change(entrada, { target: { files: [frente] } });
    expect(container.querySelectorAll('.tarjeta-imagen')).toHaveLength(4);
    fireEvent.click(screen.getByLabelText('Portada: foto 2'));
    expect(screen.getByAltText('Foto 1')).toHaveAttribute('src', 'blob:patio.jpg');
    fireEvent.click(screen.getByLabelText('Eliminar foto 3'));
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:cocina.jpg');
    fireEvent.submit(container.querySelector('form'));
    expect(submit).toHaveBeenLastCalledWith(expect.objectContaining({ imagenes: [patio, 'casa.jpg', frente] }));
    unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:patio.jpg');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:frente.jpg');
    expect(URL.revokeObjectURL).not.toHaveBeenCalledWith('casa.jpg');
});

test('arrastra una foto a portada y conserva el orden al guardar', () => {
    const submit = jest.fn();
    const { container } = render(<FormularioProp propiedad={{ ...propiedad, imagenes: ['a.jpg', 'b.jpg', 'c.jpg'] }} op='editar' handleOnSubmit={submit} />);
    const tarjetas = container.querySelectorAll('.tarjeta-imagen');
    const dataTransfer = { setData: jest.fn() };
    fireEvent.dragStart(tarjetas[2], { dataTransfer });
    fireEvent.dragOver(tarjetas[0], { dataTransfer });
    fireEvent.drop(tarjetas[0], { dataTransfer });
    expect(screen.getByAltText('Foto 1')).toHaveAttribute('src', 'c.jpg');
    expect(screen.getByLabelText('Portada: foto 1')).toBeChecked();
    expect(screen.getByLabelText('Portada: foto 3')).not.toBeChecked();
    fireEvent.submit(container.querySelector('form'));
    expect(submit).toHaveBeenLastCalledWith(expect.objectContaining({ imagenes: ['c.jpg', 'a.jpg', 'b.jpg'] }));
});

test('mantener pulsado y arrastrar con el dedo cambia el orden guardado', () => {
    jest.useFakeTimers();
    const submit = jest.fn();
    const { container } = render(<FormularioProp propiedad={{ ...propiedad, imagenes: ['a.jpg', 'b.jpg', 'c.jpg'] }} op='editar' handleOnSubmit={submit} />);
    const tarjetas = container.querySelectorAll('.tarjeta-imagen');
    const original = document.elementFromPoint;
    document.elementFromPoint = jest.fn(() => tarjetas[0]);
    try {
        fireEvent.touchStart(tarjetas[2], { touches: [{ clientX: 200, clientY: 200 }] });
        act(() => jest.advanceTimersByTime(350));
        expect(container.querySelector('.imagen-en-arrastre')).toBeInTheDocument();
        fireEvent.touchMove(tarjetas[2], { touches: [{ clientX: 100, clientY: 200 }] });
        expect(tarjetas[0]).toHaveClass('destino-imagen');
        fireEvent.touchEnd(tarjetas[2], { touches: [] });
        expect(container.querySelector('.imagen-en-arrastre')).not.toBeInTheDocument();
        expect(screen.getByAltText('Foto 1')).toHaveAttribute('src', 'c.jpg');
        fireEvent.submit(container.querySelector('form'));
        expect(submit).toHaveBeenLastCalledWith(expect.objectContaining({ imagenes: ['c.jpg', 'a.jpg', 'b.jpg'] }));
    } finally {
        document.elementFromPoint = original;
    }
});

test('un deslizamiento rápido o un gesto cancelado no reordena las fotos', () => {
    jest.useFakeTimers();
    const { container } = render(<FormularioProp propiedad={propiedad} op='editar' handleOnSubmit={jest.fn()} />);
    const tarjeta = container.querySelector('.tarjeta-imagen');
    fireEvent.touchStart(tarjeta, { touches: [{ clientX: 100, clientY: 200 }] });
    fireEvent.touchMove(tarjeta, { touches: [{ clientX: 100, clientY: 240 }] });
    act(() => jest.advanceTimersByTime(350));
    expect(container.querySelector('.imagen-en-arrastre')).not.toBeInTheDocument();
    fireEvent.touchStart(tarjeta, { touches: [{ clientX: 100, clientY: 200 }] });
    act(() => jest.advanceTimersByTime(350));
    fireEvent.touchCancel(tarjeta);
    expect(container.querySelector('.imagen-en-arrastre')).not.toBeInTheDocument();
    expect(screen.getByAltText('Foto 1')).toHaveAttribute('src', 'casa.jpg');
});

test('elegir portada mantiene un único check y permite reordenar con teclado sin botones', () => {
    const { container } = render(<FormularioProp propiedad={{ ...propiedad, imagenes: ['a.jpg', 'b.jpg'] }} op='editar' handleOnSubmit={jest.fn()} />);
    fireEvent.click(screen.getByLabelText('Portada: foto 2'));
    expect(screen.getByAltText('Foto 1')).toHaveAttribute('src', 'b.jpg');
    fireEvent.click(screen.getByLabelText('Portada: foto 1'));
    expect(screen.getByLabelText('Portada: foto 1')).toBeChecked();
    expect(screen.getByLabelText('Portada: foto 2')).not.toBeChecked();
    fireEvent.keyDown(container.querySelector('.tarjeta-imagen'), { key: 'ArrowRight' });
    expect(screen.getByAltText('Foto 1')).toHaveAttribute('src', 'a.jpg');
    expect(screen.queryByRole('button', { name: /Mover foto/ })).not.toBeInTheDocument();
});

test('impide guardar después de eliminar todas las imágenes', () => {
    const submit = jest.fn();
    const { container } = render(<FormularioProp propiedad={propiedad} op='editar' handleOnSubmit={submit} />);
    fireEvent.click(screen.getByLabelText('Eliminar foto 1'));
    fireEvent.submit(container.querySelector('form'));
    expect(submit).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Debe cargar al menos una imagen');
});

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
