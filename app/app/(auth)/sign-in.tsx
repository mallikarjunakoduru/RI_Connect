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
import { Mail, Lock } from 'lucide-react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

import { Button, Input, StatusMessage } from '../../src/components/ui';
import { useAuth } from '../../src/hooks/useAuth';
import { colors, spacing, fontSize } from '../../src/constants';

type StatusState = {
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
} | null;
import { supabase } from '../../src/lib/supabase';

export default function SignInScreen() {
  const router = useRouter();
  const { signInWithEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [status, setStatus] = useState<StatusState>(null);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    setStatus(null);
    if (!validate()) return;

    setIsLoading(true);
    setStatus({
      type: 'info',
      message: 'Signing in...',
    });

    try {
      await signInWithEmail(email, password);
      setStatus({
        type: 'success',
        message: 'Welcome back!',
      });
    } catch (error: any) {
      let errorMessage = 'Please check your credentials and try again.';
      let errorTitle = 'Sign In Failed';

      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Incorrect email or password. Please try again.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorTitle = 'Email Not Verified';
        errorMessage = 'Please check your inbox and click the verification link before signing in.';
      } else if (error.message?.includes('rate limit') || error.status === 429) {
        errorTitle = 'Too Many Attempts';
        errorMessage = 'Please wait a minute before trying again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setStatus({
        type: 'error',
        title: errorTitle,
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setStatus(null);
    try {
      setStatus({
        type: 'info',
        message: 'Connecting to Apple...',
      });

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });

        if (error) throw error;
      }
    } catch (error: any) {
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        setStatus({
          type: 'error',
          title: 'Apple Sign In Failed',
          message: 'Please try again or use another sign in method.',
        });
      } else {
        setStatus(null);
      }
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
          <View style={styles.header}>
            <Text style={styles.logo}>🏘️</Text>
            <Text style={styles.title}>RI Connect</Text>
            <Text style={styles.subtitle}>Welcome back to your community</Text>
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
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
              leftIcon={<Mail size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              error={errors.password}
              leftIcon={<Lock size={20} color={colors.textSecondary} />}
            />

            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </Link>

            <Button
              onPress={handleSignIn}
              loading={isLoading}
              fullWidth
              size="lg"
            >
              Sign In
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {Platform.OS === 'ios' && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={12}
                style={styles.appleButton}
                onPress={handleAppleSignIn}
              />
            )}

            <Button
              variant="outline"
              onPress={() => setStatus({
                type: 'info',
                title: 'Coming Soon',
                message: 'Google Sign In will be available soon.',
              })}
              fullWidth
              size="lg"
            >
              Continue with Google
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign Up</Text>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 64,
    marginBottom: spacing.md,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  forgotPasswordText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  appleButton: {
    width: '100%',
    height: 56,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
