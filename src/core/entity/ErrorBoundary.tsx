import { Component, type ErrorInfo, type ReactNode } from "react";
export class ErrorBoundary extends Component<
  { children: ReactNode; onError?: (error: Error, info: ErrorInfo) => void },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }
  render() {
    return this.state.error ? (
      <div role="alert" className="p-6">
        <p>نمایش این بخش با خطا مواجه شد.</p>
        <button type="button" onClick={() => this.setState({ error: null })}>
          تلاش دوباره
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
