import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from './app.component';

describe('App', () => {
  it('renders the starter heading', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Get started' })).toBeInTheDocument();
  });
});
