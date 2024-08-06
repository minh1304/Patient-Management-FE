// src/App.js

import React, { useState } from 'react';
import PatientList from './components/PatientList';
import './App.css';


function App() {
    const [showForm, setShowForm] = useState(false);

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div className="App">
            <header className="App-header">
                <PatientList />
            </header>
        </div>
    );
}

export default App;
