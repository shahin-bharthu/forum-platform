import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import AuthFormHeader from './AuthFormHeader';

describe('AuthFormHeader', () => {
  it('renders the avatar with the correct icon', () => {
    render(<AuthFormHeader authHeading="Sign In" authPara="sign in" />);
    const avatarElement = screen.getByTestId('LockOutlinedIcon');
    expect(avatarElement).toBeInTheDocument();
  });

  it('renders the correct heading', () => {
    render(<AuthFormHeader authHeading="Sign In" authPara="sign in" />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders the correct paragraph', () => {
    render(<AuthFormHeader authHeading="Sign In" authPara="sign in" />);
    expect(screen.getByText('Welcome user, please sign in to continue')).toBeInTheDocument();
  });
});