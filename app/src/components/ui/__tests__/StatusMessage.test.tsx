import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusMessage } from '../StatusMessage';

describe('StatusMessage', () => {
  it('renders success message', () => {
    const { getByText } = render(
      <StatusMessage type="success" message="Operation successful" />
    );
    expect(getByText('Operation successful')).toBeTruthy();
  });

  it('renders error message', () => {
    const { getByText } = render(
      <StatusMessage type="error" message="Something went wrong" />
    );
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('renders warning message', () => {
    const { getByText } = render(
      <StatusMessage type="warning" message="Please be careful" />
    );
    expect(getByText('Please be careful')).toBeTruthy();
  });

  it('renders info message', () => {
    const { getByText } = render(
      <StatusMessage type="info" message="Here is some information" />
    );
    expect(getByText('Here is some information')).toBeTruthy();
  });

  it('renders with title', () => {
    const { getByText } = render(
      <StatusMessage type="success" title="Success!" message="It worked" />
    );
    expect(getByText('Success!')).toBeTruthy();
    expect(getByText('It worked')).toBeTruthy();
  });

  it('does not render when visible is false', () => {
    const { queryByText } = render(
      <StatusMessage type="info" message="Hidden message" visible={false} />
    );
    expect(queryByText('Hidden message')).toBeNull();
  });

  it('renders when visible is true', () => {
    const { getByText } = render(
      <StatusMessage type="info" message="Visible message" visible={true} />
    );
    expect(getByText('Visible message')).toBeTruthy();
  });

  it('renders by default (visible undefined)', () => {
    const { getByText } = render(
      <StatusMessage type="info" message="Default visible" />
    );
    expect(getByText('Default visible')).toBeTruthy();
  });
});
