import '@testing-library/jest-native/extend-expect';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }) => children,
}));

// Mock Supabase
jest.mock('./src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
    })),
    removeChannel: jest.fn(),
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true }),
  MediaTypeOptions: { Images: 'Images' },
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const mockIcon = (name) => {
    return function MockIcon(props) {
      return React.createElement('View', { testID: `icon-${name}`, ...props });
    };
  };

  return {
    Heart: mockIcon('heart'),
    MessageCircle: mockIcon('message-circle'),
    Share2: mockIcon('share'),
    MoreHorizontal: mockIcon('more'),
    MapPin: mockIcon('map-pin'),
    Mail: mockIcon('mail'),
    Lock: mockIcon('lock'),
    User: mockIcon('user'),
    Camera: mockIcon('camera'),
    X: mockIcon('x'),
    ChevronDown: mockIcon('chevron-down'),
    CheckCircle: mockIcon('check-circle'),
    AlertCircle: mockIcon('alert-circle'),
    Info: mockIcon('info'),
    XCircle: mockIcon('x-circle'),
    Eye: mockIcon('eye'),
    EyeOff: mockIcon('eye-off'),
    Bell: mockIcon('bell'),
    Search: mockIcon('search'),
    Plus: mockIcon('plus'),
    DollarSign: mockIcon('dollar-sign'),
    ArrowLeft: mockIcon('arrow-left'),
    Send: mockIcon('send'),
    Trash2: mockIcon('trash'),
    Home: mockIcon('home'),
    Store: mockIcon('store'),
    Image: mockIcon('image'),
    Bookmark: mockIcon('bookmark'),
    Settings: mockIcon('settings'),
    LogOut: mockIcon('logout'),
    Edit: mockIcon('edit'),
    ChevronRight: mockIcon('chevron-right'),
  };
});

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
