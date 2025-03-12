import '@testing-library/jest-dom'

// src/tests/jest.setup.js
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => <img {...props} />, // Remplace Image par une simple balise <img>
  }));
  