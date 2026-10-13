import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { en } from '../../i18n/en';
import { MealsView } from './MealsView';

describe('MealsView', () => {
  it('shows how to make a meal when it is tapped, and hides it again', () => {
    render(<MealsView />);
    const toggle = screen.getByRole('button', {
      name: new RegExp(`^${en.mealIdeas.eggsOnToast.name}`),
    });
    const firstStep = en.mealSteps.eggsOnToast[0] ?? '';

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByText(firstStep).closest('[hidden]')).not.toBeNull();

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText(firstStep).closest('[hidden]')).toBeNull();

    fireEvent.click(toggle);
    expect(screen.getByText(firstStep).closest('[hidden]')).not.toBeNull();
  });
});
