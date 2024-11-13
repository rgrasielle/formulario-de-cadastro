
import GoodForm from "../../Components/GoodForm";
import Navegacao from "../../Components/Navegacao";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import "./style.css";
import Usuarios from "../../Components/Usuarios";


const Home = () => {

  return (

    <Router>
      <Navegacao />
      <Routes>
        <Route path="/" element={<GoodForm />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Routes>
    </Router>
  )
};

export default Home;