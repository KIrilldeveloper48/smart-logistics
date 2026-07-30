import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AuctionsListPage } from './auctions-list-page.component';

describe('AuctionsListPage', () => {
  it('renders the page heading', () => {
    render(<AuctionsListPage />);

    expect(screen.getByRole('heading', { name: 'Аукционы' })).toBeInTheDocument();
  });
});
