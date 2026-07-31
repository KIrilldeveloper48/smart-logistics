import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ApplicationProviders } from '@/app';

describe('AuctionsListPage', () => {
  it('renders the page heading inside application routing', async () => {
    render(<ApplicationProviders />);

    expect(await screen.findByRole('heading', { name: 'Аукционы' })).toBeInTheDocument();
  });
});
