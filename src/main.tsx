import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import Workspace from '../app/workspace';
import '../app/globals.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('GGCDC Platform Application Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f7f6',
          padding: '24px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{
            maxWidth: '600px',
            background: '#fff',
            borderRadius: '12px',
            border: '1.5px solid #fecdca',
            padding: '32px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚠️</div>
            <h1 style={{ font: '700 24px Georgia, serif', color: '#b42318', margin: '0 0 10px' }}>
              Application Render Notice
            </h1>
            <p style={{ color: '#526a5c', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
              The platform encountered a cache or local storage synchronization issue. Please clear your temporary browser cache or click the button below to reload cleanly.
            </p>
            {this.state.error && (
              <pre style={{
                background: '#fef3f2',
                color: '#b42318',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '12px',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '20px'
              }}>
                {this.state.error.message}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('ggcdc_records_v2');
                    localStorage.removeItem('ggcdc_links_v2');
                    sessionStorage.clear();
                  } catch {}
                  window.location.reload();
                }}
                style={{
                  background: '#14493e',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Reset Cache &amp; Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function mount() {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <Workspace user="GGCDC Civic Delegate (Monrovia / Zwedru)" />
        </ErrorBoundary>
      </React.StrictMode>
    );
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}

