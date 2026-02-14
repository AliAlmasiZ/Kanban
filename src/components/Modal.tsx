import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!isInDialog) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      onClick={handleBackdropClick}
      className="
        p-0 rounded-xl shadow-2xl w-full max-w-md 
        backdrop:bg-black/50 backdrop:backdrop-blur-sm
        open:animate-in open:fade-in open:zoom-in-95 duration-200
        bg-white text-gray-900 m-auto
      "
    >
      <header className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold">{title}</h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </header>

      <main className="p-4">
        {children}
      </main>
    </dialog>
  );
}