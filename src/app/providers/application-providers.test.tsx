import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ApplicationProviders } from './application-providers.component';

describe('ApplicationProviders', () => {
  it('renders the index route', async () => {
    render(<ApplicationProviders />);

    expect(await screen.findByRole('heading', { name: 'Аукционы' })).toBeInTheDocument();
  });
});
