import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning";
  duration?: number;
  action?: React.ReactNode;
  onDismiss?: () => void;
};

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void;
  dismiss: (id: string) => void;
  toasts: ToastProps[];
}>({
  toast: () => {},
  dismiss: () => {},
  toasts: [],
});

const toastVariants = cva(
  "group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
        success: "bg-green-50 border-green-200 text-green-800",
        warning: "bg-amber-50 border-amber-200 text-amber-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast: React.FC<ToastProps & { onDismiss: () => void }> = ({
  title,
  description,
  variant = "default",
  action,
  onDismiss,
}) => {
  return (
    <div className={cn(toastVariants({ variant }))}>
      <div className="flex-1">
        {title && <div className="font-medium">{title}</div>}
        {description && <div className="text-sm">{description}</div>}
      </div>
      {action}
      <button
        onClick={onDismiss}
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((toasts) => [...toasts, { ...props, id }]);
    
    if (props.duration !== 0) {
      setTimeout(() => {
        dismiss(id);
      }, props.duration || 5000);
    }
  };

  const dismiss = (id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col p-4 space-y-2 sm:items-end">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onDismiss={() => {
              toast.onDismiss?.();
              dismiss(toast.id!);
            }}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  return React.useContext(ToastContext);
};

export { ToastProvider, useToast };


const toastVariants = cva(
  "w-full flex items-center p-4 rounded-lg shadow-lg max-w-sm",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900 border border-gray-200",
        destructive: "bg-red-50 text-red-900 border border-red-200",
        success: "bg-green-50 text-green-900 border border-green-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ToastProps extends VariantProps<typeof toastVariants> {
  id?: string;
  title?: string;
  description?: string;
  duration?: number;
  onDismiss?: () => void;
  action?: React.ReactNode;
}

const Toast: React.FC<ToastProps & { onDismiss: () => void }> = ({
  title,
  description,
  variant,
  onDismiss,
  action,
}) => {
  return (
    <div className={cn(toastVariants({ variant }))}>
      <div className="flex-1">
        {title && <div className="font-medium">{title}</div>}
        {description && <div className="text-sm">{description}</div>}
      </div>
      {action}
      <button
        onClick={onDismiss}
        className="ml-4 text-gray-400 hover:text-gray-500"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export { ToastProvider, useToast, toastVariants };
export type { ToastProps };
