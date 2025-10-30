import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Section from './components/Section';
import Guests from './components/Guests';
import Budget from './components/Budget';
import './styles.css';

function App() {
  // Estado global: datos de secciones, invitados, presupuesto
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('berna-vale-data');
    return saved ? JSON.parse(saved) : {
      sections: {
        'Civil': [],
        'Iglesia / Ceremonia': [],
        // ... inicializa otras secciones con arrays vacíos
      },
      customSections: {},
      guests: [],
      budget: { providers: [], totalBudget: 0, totalPaid: 0, totalPending: 0 }
    };
  });

  // Guardado automático en LocalStorage
  useEffect(() => {
    localStorage.setItem('berna-vale-data', JSON.stringify(data));
  }, [data]);

  // Navegación simple (sin router para simplicidad)
  const [currentView, setCurrentView] = useState('home');
  const [currentSection, setCurrentSection] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle modo oscuro
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Calcular progreso total
  const calculateProgress = () => {
    const allTasks = Object.values(data.sections).concat(Object.values(data.customSections)).flat();
    const completed = allTasks.filter(task => task.completed).length;
    return allTasks.length > 0 ? (completed / allTasks.length) * 100 : 0;
  };

  // Buscador
  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = searchQuery ? {
    ...data,
    sections: Object.fromEntries(
      Object.entries(data.sections).map(([key, tasks]) => [
        key,
        tasks.filter(task => task.text.toLowerCase().includes(searchQuery.toLowerCase()))
      ])
    ),
    guests: data.guests.filter(guest => guest.name.toLowerCase().includes(searchQuery.toLowerCase())),
    budget: {
      ...data.budget,
      providers: data.budget.providers.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }
  } : data;

  // Exportar/Importar JSON
  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'berna-vale-data.json';
    a.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setData(imported);
        } catch (err) {
          alert('Error al importar: archivo inválido');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container">
      <header>
        Organizador de Boda – Berna & Vale
        <button onClick={() => setDarkMode(!darkMode)}>Modo Oscuro</button>
        <input type="file" accept=".json" onChange={importData} />
        <button onClick={exportData}>Exportar JSON</button>
      </header>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      {currentView === 'home' && (
        <Home
          progress={calculateProgress()}
          data={filteredData}
          onSectionClick={(section) => {
            setCurrentSection(section);
            setCurrentView('section');
          }}
          onAddCustomSection={(name) => {
            setData(prev => ({
              ...prev,
              customSections: { ...prev.customSections, [name]: [] }
            }));
          }}
        />
      )}
      {currentView === 'section' && (
        <Section
          section={currentSection}
          tasks={filteredData.sections[currentSection] || filteredData.customSections[currentSection]}
          onUpdateTasks={(updatedTasks) => {
            setData(prev => ({
              ...prev,
              [prev.sections[currentSection] ? 'sections' : 'customSections']: {
                ...prev[prev.sections[currentSection] ? 'sections' : 'customSections'],
                [currentSection]: updatedTasks
              }
            }));
          }}
          onBack={() => setCurrentView('home')}
        />
      )}
      {currentView === 'guests' && (
        <Guests
          guests={filteredData.guests}
          onUpdateGuests={(updatedGuests) => setData(prev => ({ ...prev, guests: updatedGuests }))}
          onBack={() => setCurrentView('home')}
        />
      )}
      {currentView === 'budget' && (
        <Budget
          budget={filteredData.budget}
          onUpdateBudget={(updatedBudget) => setData(prev => ({ ...prev, budget: updatedBudget }))}
          onBack={() => setCurrentView('home')}
        />
      )}
    </div>
  );
}

export default App;
