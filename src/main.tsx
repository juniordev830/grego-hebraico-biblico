import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <a className="skip" href="#conteudo">Ir para o conteúdo</a>
    <header className="masthead">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">α</span>
        <span>Grego e hebraico bíblico</span>
      </div>
      <span className="collection">Coleção de estudo bíblico</span>
    </header>
    <main id="conteudo" tabIndex={-1}>
      <div className="intro">
        <h1>Grego e hebraico bíblico</h1>
        <nav className="atalhos" aria-label="Seções desta página">
          <a href="#pratica">Praticar</a>
          <a href="#desempenho">Desempenho</a>
        </nav>
      </div>
      <App />
    </main>
  </StrictMode>,
);
