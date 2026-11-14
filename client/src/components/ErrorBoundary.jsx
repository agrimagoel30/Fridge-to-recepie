import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
          <div className="max-w-lg w-full bg-white dark:bg-stone-800 rounded-2xl shadow-xl p-8 border border-red-200 dark:border-red-900/50 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Something broke in the kitchen</h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm mb-6">
              An unexpected component error occurred. The application caught it gracefully without terminating your session.
            </p>
            <div className="text-left bg-stone-100 dark:bg-stone-950 p-4 rounded-xl text-xs font-mono text-red-600 dark:text-red-400 overflow-x-auto mb-6">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Kitchen
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
