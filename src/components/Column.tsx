import type { ReactNode } from 'react';

interface ColumnProps {
  title: string;
  children: ReactNode;
}

export default function Column({ title, children }: ColumnProps) {
  return (
    <div className="relative flex flex-col p-6 bg-white/10 shadow-lg rounded-2xl border border-white/10  transition-all duration-300 backdrop-blur-lg h-full text-white bg-gradient-to-b from-white/10 to-transparent items-center">
      {title && <h1 className="mb-4 text-lg font-semibold">{title}</h1>}
      {children}
    </div>
  );
}
