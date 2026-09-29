import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.append(modalRoot);
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  document.body.style.overflow = '';
  vi.restoreAllMocks();
});
