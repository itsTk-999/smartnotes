import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { NotesProvider } from './context/NotesContext.jsx'
import { TaskProvider } from './context/TaskContext.jsx'
import { TimeTrackerProvider } from './context/TimeTrackerContext.jsx' 
import { ThemeProvider } from './context/ThemeContext.jsx'; // <--- Import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider> {/* <--- Add Here (Order doesn't matter much, but high up is good) */}
          <NotesProvider>
            <TaskProvider>
              <TimeTrackerProvider>
                <App />
              </TimeTrackerProvider>
            </TaskProvider>
          </NotesProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)