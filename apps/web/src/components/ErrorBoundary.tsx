/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Application render error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center mc-bg p-6">
          <div className="mc-card max-w-lg w-full p-8 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--mc-danger)]/10 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-lg font-bold mc-ink-strong">Terjadi Kesalahan Aplikasi</h1>
            <p className="text-xs mc-muted leading-relaxed">
              Aplikasi mengalami gangguan saat memuat tampilan. Silakan muat ulang halaman.
            </p>
            {this.state.error && (
              <pre className="text-left text-[10px] mc-muted bg-[var(--mc-surface-2)] border mc-border rounded-lg p-3 overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              className="mc-btn-primary px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
