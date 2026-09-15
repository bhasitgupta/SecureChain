import * as React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(({
  className = '',
  variant = 'default',
  size = 'default',
  children,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn('ui-btn', `ui-btn-${variant}`, `ui-btn-${size}`, className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
