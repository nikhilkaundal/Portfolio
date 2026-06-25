import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock components that use WebGL/Three.js or Canvas 2D to avoid JSDOM compatibility issues
jest.mock('./components/sections/Hero', () => () => <div data-testid="mock-hero">Hero Component</div>);
jest.mock('./components/sections/About', () => () => <div data-testid="mock-about">About Component</div>);
jest.mock('./components/sections/Projects', () => () => <div data-testid="mock-projects">Projects Component</div>);
jest.mock('./components/sections/Contact', () => () => <div data-testid="mock-contact">Contact Component</div>);
jest.mock('./components/ui/Cursor', () => () => <div data-testid="mock-cursor">Cursor Component</div>);

// Mock hooks that dynamically import ESM packages which Jest cannot transform by default
jest.mock('./hooks/useLenis', () => ({
  useLenis: jest.fn(),
}));
jest.mock('./hooks/useScrollReveal', () => ({
  useScrollReveal: jest.fn(),
}));

test('renders main portfolio components', () => {
  render(<App />);
  const logoElements = screen.getAllByText(/NK/i);
  expect(logoElements.length).toBeGreaterThan(0);
});
