import type { ReactNode } from 'react';

export type TDetailItemProps = Readonly<{
  term: string;
  value: ReactNode;
  icon?: ReactNode;
}>;
