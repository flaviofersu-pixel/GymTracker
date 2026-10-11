import { createContext, use } from 'react';

export const ToastContext = createContext<(message: string) => void>(() => undefined);

export const useToast = (): ((message: string) => void) => use(ToastContext);
