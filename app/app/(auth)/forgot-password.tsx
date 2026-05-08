import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowLeft } from 'lucide-react-native';

import { Button, Input, StatusMessage } from '../../src/components/ui';
import { useAuth } from '../../src/hooks/useAuth';
import { colors, spacing, fontSize } from '../../src/constants';

type StatusState = {
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
} | null;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    setStatus(null);
    if (!validate()) return;

    setIsLoading(true);
    setStatus({
      type: 'info',
      message: 'Sending reset link...',
    });

    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (error: any) {
      let errorMessage = 'Failed to send reset email. Please try again.';

      if (error.message?.includes('rate limit') || error.status === 429) {
        errorMessage = 'Too many attempts. Please wait a minute before trying again.';
      } else if (error.message?.includes('not found') || error.message?.includes('no user')) {
        errorMessage = 'No account found with this email address.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setStatus({
        type: 'error',
        title: 'Unable to Send Reset Link',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>📧</Text>
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successText}>
            We've sent password reset instructions to{' '}
            <Text style={styles.email}>{email}</Text>
          </Text>
          <Button
            onPress={() => router.replace('/(auth)/sign-in')}
            fullWidth
            size="lg"
            style={styles.backToSignIn}
          >
            Back to Sign In
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              No worries! Enter your email and we'll send you reset instructions.
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
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={error}
              leftIcon={<Mail size={20} color={colors.textSecondary} />}
            />

            <Button
              onPress={handleResetPassword}
              loading={isLoading}
              fullWidth
              size="lg"
            >
              Send Reset Link
            </Button>
          </View>
        </View>
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
  content: {
    flex: 1,
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
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  form: {
    gap: spacing.lg,
  },
  successContainer: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  successText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  email: {
    color: colors.text,
    fontWeight: '600',
  },
  backToSignIn: {
    marginTop: spacing.lg,
  },
});
