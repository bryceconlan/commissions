import React from 'react';
import { createRoot } from 'react-dom/client';
import CommissionCalculator from '../components/CommissionCalculator';
import '../index.css';

declare global {
  interface Window {
    createCommissionCalculator: (containerId: string) => void;
  }
}

window.createCommissionCalculator = (containerId: string) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <CommissionCalculator />
    </React.StrictMode>
  );
};