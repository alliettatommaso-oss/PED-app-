export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'warning';
}

interface ToastContainerProps {
  toasts: ToastItem[];
}

function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`px-4 py-3 rounded-sm border bg-paper text-sm font-medium shadow-md min-w-64 max-w-sm ${
            toast.type === 'success'
              ? 'border-green-600 text-green-700'
              : 'border-yellow-500 text-yellow-700'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
