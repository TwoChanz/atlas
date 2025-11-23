import { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

interface LayoutComposition {
  Sidebar: React.FC<{ children: ReactNode }>;
  Main: React.FC<{ children: ReactNode }>;
  RightPanel: React.FC<{ children: ReactNode }>;
  FullWidth: React.FC<{ children: ReactNode }>;
}

export const Layout: React.FC<LayoutProps> & LayoutComposition = ({ children }) => {
  return <div className="layout">{children}</div>;
};

Layout.Sidebar = ({ children }) => {
  return <aside className="layout-sidebar">{children}</aside>;
};

Layout.Main = ({ children }) => {
  return <main className="layout-main">{children}</main>;
};

Layout.RightPanel = ({ children }) => {
  return <aside className="layout-right-panel">{children}</aside>;
};

Layout.FullWidth = ({ children }) => {
  return <div className="layout-full-width">{children}</div>;
};
