import { Route, Routes } from 'react-router-dom';
import { InmobiliariaProvider } from './context';
import Navbar from './componentes/Navbar';
import Home from './paginas/Home';
import LoginPage from './paginas/Login';
import Footbar from './componentes/Footbar';
import PropsVenta from './paginas/PropsVenta';
import PropsAlquiler from './paginas/PropsAlquiler';
import NosotrosPage from './paginas/Nosotros';
import DetalleProp from './paginas/DetallePropiedad';
import FavoritosPage from './paginas/Favoritos';
import CreaPropiedad from './paginas/CreaPropiedad';
import ListaPropsAdminPage from './paginas/ListaProspAdminPage';
import './App.css';
import EditaPropiedad from './paginas/EditaPropiedad';


function App() {
  return (
    <InmobiliariaProvider>
      <div className="App">
        {/*--------- navbar------ */}
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/venta' element={<PropsVenta/>} />
          <Route path='/alquiler' element={<PropsAlquiler />} />
          <Route path='/nosotros' element={<NosotrosPage/>} />
          <Route path='/detalle/:id' element={<DetalleProp/>} />
          <Route path='/favoritos' element={<FavoritosPage/>} />
          <Route path='/admin/creaPropiedad' element={<CreaPropiedad/>} />
          <Route path='/admin/listaPropsAdmin' element={<ListaPropsAdminPage/>} />
          <Route path='admin/editaProp/:_id' element={<EditaPropiedad/>} />
        </Routes>

        <Footbar />
      </div>
    </InmobiliariaProvider>
  );
}

export default App;

