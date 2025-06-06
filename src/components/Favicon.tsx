import { useEffect } from 'react';
import BugReportIcon from '@mui/icons-material/BugReport';

const Favicon = () => {
  useEffect(() => {
    // Crear un enlace para el favicon dinámico
    const link = document.createElement('link');
    link.rel = 'icon';
    
    // Crear un SVG para el favicon
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#00FF00">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.2 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/>
      </svg>
    `;
    
    // Crear un blob a partir del SVG
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    link.href = URL.createObjectURL(blob);
    
    // Agregar el favicon al head
    document.head.appendChild(link);
    
    // Limpiar al desmontar
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
    };
  }, []);
  
  return null; // Este componente no renderiza nada en el DOM
};

export default Favicon;
