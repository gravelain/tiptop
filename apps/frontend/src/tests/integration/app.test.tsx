import React from 'react'; // 👈 Obligatoire pour Vitest avec JSX/TSX
import { render, screen } from '@testing-library/react';
import Home from '@/app/page'; // ou '../../app/page'
import '@testing-library/jest-dom';

describe('Home Page', () => {
  it('should render correctly', () => {
    render(<Home />);

    expect(
      screen.getByText(/Ma page de test/i)
    ).toBeInTheDocument();
  });
});
