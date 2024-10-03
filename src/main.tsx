import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {router} from './app/App.tsx'
import './styles/index.scss'
import {RouterProvider} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
)
