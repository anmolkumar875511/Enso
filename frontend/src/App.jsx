import  { BrowserRouter,Route, Routes } from 'react-router-dom';
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import OAuthSuccess from './pages/OAuthSuccess.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/register' element = {<Register/>} />
        <Route path = '/login' element = {<Login/>} />
        <Route path = '/dashboard' element = {<Dashboard/>} />
        <Route path = '/oauth-success' element = {<OAuthSuccess/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
