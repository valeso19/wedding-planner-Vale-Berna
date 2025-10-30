import React from 'react';

function Home({ progress, data, onSectionClick, onAddCustomSection }) {
  const sections = ['Civil', 'Iglesia / Ceremonia', 'Salón / Recepción', 'Vestido de la novia', 'Traje del novio', 'Invitados', 'Fotografía / Video', 'Catering / Menú', 'Música / DJ / Animación', 'Decoración', 'Flores', 'Transporte', 'Luna de miel', 'Cotillón', 'Pagos y Presupuesto'];

  return (
    <>
      <svg className="progress-chart" viewBox="0 0 36 36">
        <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" fill="none" stroke="#e6e6e6" strokeWidth="2"/>
        <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" fill="none" stroke="#87B9E0" strokeWidth="2" strokeDasharray={`${progress}, 100`}/>
        <text x="18" y="20.35" textAnchor="middle" fontSize="5">{Math.round(progress)}%</text>
      </svg>
      <div className="section-grid">
        {sections.map(section => (
          <div key={section} className="section-card" onClick={() => {
            if (section === 'Invitados') setCurrentView('guests');
            else if (section === 'Pagos y Presupuesto') setCurrentView('budget');
            else onSectionClick(section);
          }}>
            {section}
          </div>
        ))}
        <button onClick={() => {
          const name = prompt('Nombre de la nueva sección:');
          if (name) onAddCustomSection(name);
        }}>Agregar nueva sección personalizada</button>
      </div>
      <p>Total Presupuestado: {data.budget.totalBudget} | Pagado: {data.budget.totalPaid} | Faltante: {data.budget.totalPending}</p>
    </>
  );
}

export default Home;
