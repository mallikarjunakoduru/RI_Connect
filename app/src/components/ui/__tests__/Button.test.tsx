import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, ActivityIndicator } from 'react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly with default props', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Press</Button>);

    fireEvent.press(getByText('Press'));
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
    const onPress = jest.fn();
    const { queryByText, UNSAFE_getByType } = render(
      <Button onPress={onPress} loading>
        Submit
      </Button>
    );

    expect(queryByText('Submit')).toBeNull();
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders with different variants', () => {
    const onPress = jest.fn();
    const { rerender, getByText } = render(
      <Button onPress={onPress} variant="primary">Primary</Button>
    );
    expect(getByText('Primary')).toBeTruthy();

    rerender(<Button onPress={onPress} variant="secondary">Secondary</Button>);
    expect(getByText('Secondary')).toBeTruthy();

    rerender(<Button onPress={onPress} variant="outline">Outline</Button>);
    expect(getByText('Outline')).toBeTruthy();

    rerender(<Button onPress={onPress} variant="ghost">Ghost</Button>);
    expect(getByText('Ghost')).toBeTruthy();

    rerender(<Button onPress={onPress} variant="danger">Danger</Button>);
    expect(getByText('Danger')).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const onPress = jest.fn();
    const { rerender, getByText } = render(<Button onPress={onPress} size="sm">Small</Button>);
    expect(getByText('Small')).toBeTruthy();

    rerender(<Button onPress={onPress} size="md">Medium</Button>);
    expect(getByText('Medium')).toBeTruthy();

    rerender(<Button onPress={onPress} size="lg">Large</Button>);
    expect(getByText('Large')).toBeTruthy();
  });

  it('renders with left icon', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress} leftIcon={<Text>Icon</Text>}>With Icon</Button>
    );

    expect(getByText('Icon')).toBeTruthy();
    expect(getByText('With Icon')).toBeTruthy();
  });

  it('applies fullWidth style', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress} fullWidth>Full Width</Button>);
    expect(getByText('Full Width')).toBeTruthy();
  });
});
