import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class NetworkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error('Network Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Force a re-render by reloading the page component
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isNetworkError = this.state.error?.message.includes('timeout') ||
                           this.state.error?.message.includes('Network') ||
                           this.state.error?.message.includes('fetch') ||
                           this.state.error?.message.includes('connection');

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <Card className="max-w-md w-full shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {isNetworkError ? (
                  <WifiOff className="h-16 w-16 text-red-500 mx-auto" />
                ) : (
                  <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto" />
                )}
              </div>
              <CardTitle className="text-xl">
                {isNetworkError ? 'Connection Problem' : 'Something went wrong'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {isNetworkError ? (
                    "We're having trouble connecting to our servers. This might be due to a slow internet connection or temporary service issues."
                  ) : (
                    this.state.error?.message || "An unexpected error occurred while loading the page."
                  )}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h4 className="font-medium">What you can try:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Refresh the page</li>
                  <li>• Try again in a few moments</li>
                  {isNetworkError && <li>• Switch to a different network if available</li>}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={this.handleRetry}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  Go Home
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4">
                  <summary className="text-sm text-muted-foreground cursor-pointer">
                    Technical Details (Development)
                  </summary>
                  <pre className="text-xs mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto">
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default NetworkErrorBoundary;
