import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../../components/ui/Input';

describe('Input', () => {
  it('renders correctly with placeholder', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" value="" onChangeText={() => {}} />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('displays the correct value', () => {
    const { getByDisplayValue } = render(
      <Input placeholder="Test" value="Hello World" onChangeText={() => {}} />
    );
    expect(getByDisplayValue('Hello World')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Type here" value="" onChangeText={onChangeText} />
    );

    fireEvent.changeText(getByPlaceholderText('Type here'), 'New text');
    expect(onChangeText).toHaveBeenCalledWith('New text');
  });

  it('renders label when provided', () => {
    const { getByText } = render(
      <Input label="Email" placeholder="email@example.com" value="" onChangeText={() => {}} />
    );
    expect(getByText('Email')).toBeTruthy();
  });

  it('renders error message when provided', () => {
    const { getByText } = render(
      <Input
        placeholder="Email"
        value=""
        onChangeText={() => {}}
        error="Invalid email address"
      />
    );
    expect(getByText('Invalid email address')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Disabled" value="" onChangeText={onChangeText} editable={false} />
    );

    const input = getByPlaceholderText('Disabled');
    expect(input.props.editable).toBe(false);
  });

  it('handles secureTextEntry for passwords', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Password" value="" onChangeText={() => {}} secureTextEntry />
    );

    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('handles multiline input', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Description" value="" onChangeText={() => {}} multiline numberOfLines={4} />
    );

    const input = getByPlaceholderText('Description');
    expect(input.props.multiline).toBe(true);
  });
});
