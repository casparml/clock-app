import React from 'react';
import { SettingsProvider } from './contexts/SettingsContext';
import Settings from './components/Settings';

const App: React.FC = () => {
    return (
        <SettingsProvider>
            <Settings />
        </SettingsProvider>
    );
};

export default App;