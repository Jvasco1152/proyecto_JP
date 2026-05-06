import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="bg-white rounded-2xl border border-red-200 p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-bold text-red-700 mb-2">Ocurrió un error inesperado</h2>
            <p className="text-sm text-slate-600 mb-1">La aplicación encontró un problema al mostrar esta pantalla.</p>
            {this.state.message && (
              <p className="text-xs text-red-600 bg-red-50 rounded p-2 mt-2 break-words font-mono">{this.state.message}</p>
            )}
            <button
              onClick={this.handleReload}
              className="mt-4 w-full bg-primary-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Volver a intentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
