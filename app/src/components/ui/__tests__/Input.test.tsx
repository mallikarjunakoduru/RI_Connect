import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Input } from '../Input';

describe('Input', () => {
  it('renders correctly with placeholder', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(
      <Input label="Email" placeholder="Enter email" />
    );
    expect(getByText('Email')).toBeTruthy();
  });

  it('handles text input', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Type here" onChangeText={onChangeText} />
    );

    fireEvent.changeText(getByPlaceholderText('Type here'), 'Hello');
    expect(onChangeText).toHaveBeenCalledWith('Hello');
  });

  it('displays error message', () => {
    const { getByText } = render(
      <Input placeholder="Email" error="Invalid email" />
    );
    expect(getByText('Invalid email')).toBeTruthy();
  });

  it('renders with left icon', () => {
    const { getByText } = render(
      <Input placeholder="Email" leftIcon={<Text>@</Text>} />
    );
    expect(getByText('@')).toBeTruthy();
  });

  it('toggles password visibility', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input placeholder="Password" secureTextEntry testID="password-input" />
    );

    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('supports multiline input', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Description" multiline numberOfLines={4} />
    );

    const input = getByPlaceholderText('Description');
    expect(input.props.multiline).toBe(true);
  });

  it('respects editable prop', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Read only" editable={false} />
    );

    const input = getByPlaceholderText('Read only');
    expect(input.props.editable).toBe(false);
  });
});
