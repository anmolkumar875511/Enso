import  { BrowserRouter,Route, Routes } from 'react-router-dom';
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/register' element = {<Register/>} />
        <Route path = '/login' element = {<Login/>} />
        <Route path = '/dashboard' element = {<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
