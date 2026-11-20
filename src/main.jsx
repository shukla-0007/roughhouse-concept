import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './styles.css'
import App from './App'

// always start the broadcast from the top
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(<App />)

console.log('%cROUGH HOUSE MEDIA — sample redesign concept by Ayush Shukla', 'font: 600 13px Archivo, sans-serif; padding: 6px 0;')
