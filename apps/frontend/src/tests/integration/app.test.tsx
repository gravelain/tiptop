// src/tests/integration/app.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page'; 
import '@testing-library/jest-dom'; 

describe('Home Page', () => {
  it('should render correctly', () => {
    render(<Home />);
    expect(screen.getByText(/Ma page de test metier/i)).toBeInTheDocument();
  });
});
