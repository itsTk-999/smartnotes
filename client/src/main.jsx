import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// CHANGE 1: Import HashRouter instead of BrowserRouter
import { HashRouter } from 'react-router-dom' 
import { AuthProvider } from './context/AuthContext.jsx'
import { NotesProvider } from './context/NotesContext.jsx'
import { TaskProvider } from './context/TaskContext.jsx'
import { TimeTrackerProvider } from './context/TimeTrackerContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* CHANGE 2: Use HashRouter here */}
    <HashRouter>
      <AuthProvider>
        <ThemeProvider>
          <NotesProvider>
            <TaskProvider>
              <TimeTrackerProvider>
                <App />
              </TimeTrackerProvider>
            </TaskProvider>
          </NotesProvider>
        </ThemeProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
)