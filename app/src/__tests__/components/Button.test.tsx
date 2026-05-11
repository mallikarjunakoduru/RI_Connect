import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../components/ui/Button';

describe('Button', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(<Button onPress={() => {}}>Test Button</Button>);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Click Me</Button>);

    fireEvent.press(getByText('Click Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress} disabled>
        Disabled
      </Button>
    );

    fireEvent.press(getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows loading indicator when loading', () => {
    const { queryByText } = render(
      <Button onPress={() => {}} loading>
        Loading
      </Button>
    );

    // When loading, children text should not be visible
    expect(queryByText('Loading')).toBeNull();
  });

  it('renders different variants correctly', () => {
    const { rerender, getByText } = render(
      <Button onPress={() => {}} variant="primary">
        Primary
      </Button>
    );
    expect(getByText('Primary')).toBeTruthy();

    rerender(
      <Button onPress={() => {}} variant="secondary">
        Secondary
      </Button>
    );
    expect(getByText('Secondary')).toBeTruthy();

    rerender(
      <Button onPress={() => {}} variant="outline">
        Outline
      </Button>
    );
    expect(getByText('Outline')).toBeTruthy();
  });

  it('renders different sizes correctly', () => {
    const { rerender, getByText } = render(
      <Button onPress={() => {}} size="sm">
        Small
      </Button>
    );
    expect(getByText('Small')).toBeTruthy();

    rerender(
      <Button onPress={() => {}} size="md">
        Medium
      </Button>
    );
    expect(getByText('Medium')).toBeTruthy();

    rerender(
      <Button onPress={() => {}} size="lg">
        Large
      </Button>
    );
    expect(getByText('Large')).toBeTruthy();
  });

  it('renders full width when fullWidth prop is true', () => {
    const { getByText } = render(
      <Button onPress={() => {}} fullWidth>
        Full Width
      </Button>
    );
    expect(getByText('Full Width')).toBeTruthy();
  });

  it('renders with left icon', () => {
    const { getByText, getByTestId } = render(
      <Button onPress={() => {}} leftIcon={<div testID="left-icon" />}>
        With Icon
      </Button>
    );
    expect(getByText('With Icon')).toBeTruthy();
  });

  it('renders with right icon', () => {
    const { getByText } = render(
      <Button onPress={() => {}} rightIcon={<div testID="right-icon" />}>
        With Icon
      </Button>
    );
    expect(getByText('With Icon')).toBeTruthy();
  });
});
