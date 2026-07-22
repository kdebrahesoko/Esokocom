import { createContext, useContext, useState, type ReactNode } from 'react';

interface BookDemoContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const BookDemoContext = createContext<BookDemoContextValue | null>(null);

export function BookDemoProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BookDemoContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </BookDemoContext.Provider>
  );
}

export function useBookDemo() {
  const ctx = useContext(BookDemoContext);
  if (!ctx) throw new Error('useBookDemo must be used inside BookDemoProvider');
  return ctx;
}
