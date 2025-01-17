import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ButtonComponent from './Button';
import { describe, it, expect } from 'vitest';

describe('ButtonComponent', () => {
  it('renders with the correct label', () => {
    render(<ButtonComponent type="button" label="Click Me" disabled={false} />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('is disabled when the disabled prop is true', () => {
    render(<ButtonComponent type="button" label="Click Me" disabled={true} />);
    expect(screen.getByText('Click Me')).toBeDisabled();
  });
});
