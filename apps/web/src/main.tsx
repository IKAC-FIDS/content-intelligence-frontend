import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/app.css'
import { ThemeProvider } from './components/theme-provider'
document.documentElement.dir='rtl'
document.documentElement.lang='fa'
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><ThemeProvider defaultTheme="system" storageKey="content-intelligence-theme"><BrowserRouter><App/></BrowserRouter></ThemeProvider></React.StrictMode>)
