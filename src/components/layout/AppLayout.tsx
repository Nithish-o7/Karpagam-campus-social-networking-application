import type { ReactNode } from 'react';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AppLayout({ children, activeTab, onTabChange }: AppLayoutProps) {
  return (
    <>
      <AppHeader 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        onMenuToggle={() => {}} 
      />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </>
  );
}
