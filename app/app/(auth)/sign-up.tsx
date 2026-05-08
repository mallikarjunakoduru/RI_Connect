import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react-native';

import { Button, Input, StatusMessage } from '../../src/components/ui';
import { useAuth } from '../../src/hooks/useAuth';
import { colors, spacing, fontSize } from '../../src/constants';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info';
    title?: string;
    message: string;
  } | null>(null);
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!displayName.trim()) {
      newErrors.displayName = 'Name is required';
    } else if (displayName.trim().length < 2) {
      newErrors.displayName = 'Name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    setStatus(null);
    if (!validate()) return;

    setIsLoading(true);
    setStatus({
      type: 'info',
      message: 'Creating your account...',
    });

    try {
      const result = await signUpWithEmail(email, password, displayName.trim());

      if (result.needsEmailConfirmation) {
        setStatus({
          type: 'success',
          title: 'Account Created! 🎉',
          message: `We sent a verification link to ${email}. Please check your inbox (and spam folder) and click the link to verify your account.`,
        });
      } else {
        setStatus({
          type: 'success',
          title: 'Account Created!',
          message: 'Your account is ready. Redirecting to sign in...',
        });
        setTimeout(() => {
          router.replace('/(auth)/sign-in');
        }, 2000);
      }
    } catch (error: any) {
      let errorMessage = 'Something went wrong. Please try again.';

      if (error.message?.includes('already registered')) {
        errorMessage = 'This email is already registered. Try signing in instead.';
      } else if (error.message?.includes('rate limit') || error.status === 429) {
        errorMessage = 'Too many attempts. Please wait a minute and try again.';
      } else if (error.message?.includes('password')) {
        errorMessage = 'Password must be at least 6 characters.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setStatus({
        type: 'error',
        title: 'Sign Up Failed',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join your neighborhood community
            </Text>
          </View>

          {status && (
            <StatusMessage
              type={status.type}
              title={status.title}
              message={status.message}
            />
          )}

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={displayName}
              onChangeText={(text) => {
                setDisplayName(text);
                setErrors((prev) => ({ ...prev, displayName: undefined }));
              }}
              autoCapitalize="words"
              autoComplete="name"
              error={errors.displayName}
              leftIcon={<User size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
              leftIcon={<Mail size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Password"
              placeholder="Create a password (6+ characters)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              secureTextEntry
              autoComplete="new-password"
              error={errors.password}
              leftIcon={<Lock size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              secureTextEntry
              autoComplete="new-password"
              error={errors.confirmPassword}
              leftIcon={<Lock size={20} color={colors.textSecondary} />}
            />

            <Button
              onPress={handleSignUp}
              loading={isLoading}
              disabled={isLoading || status?.type === 'success'}
              fullWidth
              size="lg"
              style={styles.signUpButton}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Text style={styles.terms}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: spacing.xl,
  },
  signUpButton: {
    marginTop: spacing.md,
  },
  terms: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: spacing.lg,
  },
  footerText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
  },
});
