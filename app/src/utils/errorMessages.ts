/**
 * Converts technical error messages to user-friendly messages
 */

type ErrorMessageMap = {
  [key: string]: string;
};

const errorMessages: ErrorMessageMap = {
  // Auth errors
  'Invalid login credentials': 'Incorrect email or password. Please try again.',
  'Email not confirmed': 'Please check your inbox and click the verification link to verify your email.',
  'User already registered': 'This email is already registered. Try signing in instead.',
  'already registered': 'This email is already registered. Try signing in instead.',
  'Password should be at least 6 characters': 'Password must be at least 6 characters.',
  'rate limit': 'Too many attempts. Please wait a moment and try again.',
  'over_email_send_rate_limit': 'Too many emails sent. Please wait a few minutes before trying again.',

  // Network errors
  'Failed to fetch': 'Unable to connect. Please check your internet connection.',
  'Network request failed': 'Unable to connect. Please check your internet connection.',
  'TypeError: Network request failed': 'Unable to connect. Please check your internet connection.',
  'timeout': 'Request timed out. Please try again.',

  // Database errors
  'duplicate key value': 'This already exists. Please try something different.',
  'unique constraint': 'This already exists. Please try something different.',
  'foreign key violation': 'Something went wrong. Please try again.',
  'violates row-level security': 'You don\'t have permission to do this.',
  'JWT expired': 'Your session has expired. Please sign in again.',
  'invalid JWT': 'Your session has expired. Please sign in again.',

  // Storage errors
  'Payload too large': 'The file is too large. Please choose a smaller file.',
  'Invalid file type': 'This file type is not supported.',

  // Generic
  'Something went wrong': 'Something went wrong. Please try again.',
};

/**
 * Get a user-friendly error message from a technical error
 */
export function getUserFriendlyError(error: any): string {
  // Handle null/undefined
  if (!error) {
    return 'Something went wrong. Please try again.';
  }

  // Get the error message string
  const errorMessage = typeof error === 'string'
    ? error
    : error.message || error.error_description || error.msg || '';

  // Check for rate limiting via status code
  if (error.status === 429 || error.statusCode === 429) {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  // Check for unauthorized
  if (error.status === 401 || error.statusCode === 401) {
    return 'Your session has expired. Please sign in again.';
  }

  // Check for forbidden
  if (error.status === 403 || error.statusCode === 403) {
    return 'You don\'t have permission to do this.';
  }

  // Check for not found
  if (error.status === 404 || error.statusCode === 404) {
    return 'This item could not be found.';
  }

  // Check for server error
  if (error.status >= 500 || error.statusCode >= 500) {
    return 'Our servers are having trouble. Please try again in a moment.';
  }

  // Look for matching error messages
  const lowerMessage = errorMessage.toLowerCase();

  for (const [key, friendlyMessage] of Object.entries(errorMessages)) {
    if (lowerMessage.includes(key.toLowerCase())) {
      return friendlyMessage;
    }
  }

  // If the message is already user-friendly (doesn't contain technical terms), return it
  const technicalTerms = [
    'pgrst', 'sql', 'json', 'uuid', 'null', 'undefined', 'error:',
    'exception', 'stack', 'trace', 'function', 'column', 'table',
    'constraint', 'violation', 'jwt', 'token', 'auth.', 'supabase'
  ];

  const hasTechnicalTerms = technicalTerms.some(term =>
    lowerMessage.includes(term.toLowerCase())
  );

  if (!hasTechnicalTerms && errorMessage.length > 0 && errorMessage.length < 200) {
    // Capitalize first letter
    return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
  }

  // Default fallback
  return 'Something went wrong. Please try again.';
}

/**
 * Get error title based on context
 */
export function getErrorTitle(context: string): string {
  const titles: { [key: string]: string } = {
    'sign-in': 'Sign In Failed',
    'sign-up': 'Sign Up Failed',
    'forgot-password': 'Password Reset Failed',
    'create-post': 'Failed to Post',
    'create-listing': 'Failed to Create Listing',
    'send-message': 'Failed to Send',
    'add-comment': 'Failed to Comment',
    'update-profile': 'Failed to Update Profile',
    'upload-image': 'Failed to Upload Image',
    'load-data': 'Failed to Load',
    'default': 'Something Went Wrong',
  };

  return titles[context] || titles['default'];
}
