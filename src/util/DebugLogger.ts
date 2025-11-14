/**
 * Debug logger utility for tracking app actions and state changes
 */

const DEBUG_ENABLED = __DEV__;

type LogLevel = 'log' | 'warn' | 'error' | 'info';

interface LogContext {
  component?: string;
  action?: string;
  payload?: unknown;
  state?: unknown;
  [key: string]: unknown;
}

class DebugLogger {
  private enabled: boolean;

  constructor(enabled: boolean = DEBUG_ENABLED) {
    this.enabled = enabled;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext,
  ) {
    const timestamp = new Date().toISOString();
    const contextStr = context ?? '';
    return [`[${timestamp}] [${level.toUpperCase()}] ${message}`, contextStr];
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.enabled) return;

    const formattedMessage = this.formatMessage(level, message, context);

    switch (level) {
      case 'error':
        console.error(...formattedMessage);
        break;
      case 'warn':
        console.warn(...formattedMessage);
        break;
      case 'info':
        console.info(...formattedMessage);
        break;
      default:
        console.log(...formattedMessage);
    }
  }

  /**
   * Log a Redux action dispatch
   */
  action(actionType: string, payload?: unknown, state?: unknown): void {
    this.log('log', `[REDUX ACTION] ${actionType}`, {
      action: actionType,
      payload,
      state,
    });
  }

  /**
   * Log a Redux reducer state change
   */
  reducer(
    reducerName: string,
    actionType: string,
    prevState: unknown,
    nextState: unknown,
  ): void {
    this.log('log', `[REDUX REDUCER] ${reducerName}`, {
      reducer: reducerName,
      action: actionType,
      prevState,
      nextState,
    });
  }

  /**
   * Log a component lifecycle event
   */
  component(componentName: string, event: string, data?: unknown): void {
    this.log('log', `[COMPONENT] ${componentName}`, {
      component: componentName,
      event,
      data,
    });
  }

  /**
   * Log a hook execution
   */
  hook(hookName: string, event: string, data?: unknown): void {
    this.log('log', `[HOOK] ${hookName}`, {
      hook: hookName,
      event,
      data,
    });
  }

  /**
   * Log an effect execution
   */
  effect(
    componentName: string,
    effectName: string,
    dependencies?: unknown,
  ): void {
    this.log('log', `[EFFECT] ${componentName}.${effectName}`, {
      component: componentName,
      effect: effectName,
      dependencies,
    });
  }

  /**
   * Log a callback execution
   */
  callback(componentName: string, callbackName: string, args?: unknown): void {
    this.log('log', `[CALLBACK] ${componentName}.${callbackName}`, {
      component: componentName,
      callback: callbackName,
      args,
    });
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  /**
   * Log an error
   */
  error(message: string, error?: Error, context?: LogContext): void {
    this.log('error', message, {
      ...context,
      error: error?.message,
      stack: error?.stack,
    });
  }

  /**
   * Log info
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  /**
   * Enable/disable logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

export const logger = new DebugLogger();

export default logger;
