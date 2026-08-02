export type TToastVariant = 'success' | 'error';

export type TToastProps = Readonly<{
  isOpen: boolean;
  message: string;
  variant: TToastVariant;
  onOpenChange: (isOpen: boolean) => void;
  duration?: number;
}>;
