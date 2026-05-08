import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';

import { colors, spacing, fontSize, NEIGHBORHOODS } from '../src/constants';
import { Button, Input, Avatar } from '../src/components/ui';
import { useAuth } from '../src/hooks/useAuth';

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, createProfile, setHasCompletedOnboarding } = useAuth();

  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.display_name || ''
  );
  const [neighborhood, setNeighborhood] = useState('');
  const [streetName, setStreetName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleComplete = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }

    // Combine neighborhood and street name
    let locationInfo = neighborhood;
    if (streetName.trim()) {
      locationInfo = neighborhood
        ? `${neighborhood} - ${streetName.trim()}`
        : streetName.trim();
    }

    setIsLoading(true);
    try {
      await createProfile({
        display_name: displayName.trim(),
        neighborhood: locationInfo || undefined,
        bio: bio.trim() || undefined,
      });

      setHasCompletedOnboarding(true);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to create profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>Welcome to RI Connect!</Text>
      <Text style={styles.stepSubtitle}>
        Let's set up your profile so neighbors can recognize you.
      </Text>

      <TouchableOpacity style={styles.avatarPicker} onPress={pickAvatar}>
        {avatarUri ? (
          <Avatar source={avatarUri} size="xl" />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Camera size={32} color={colors.textSecondary} />
            <Text style={styles.avatarPlaceholderText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Input
        label="Your Name"
        placeholder="How should neighbors know you?"
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="words"
        containerStyle={styles.input}
      />

      <Button
        onPress={() => setStep(2)}
        disabled={!displayName.trim()}
        fullWidth
        size="lg"
      >
        Continue
      </Button>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>Where do you live?</Text>
      <Text style={styles.stepSubtitle}>
        This helps connect you with nearby neighbors. (Optional)
      </Text>

      <Text style={styles.sectionLabel}>Select your neighborhood:</Text>
      <View style={styles.neighborhoodOptions}>
        {NEIGHBORHOODS.map((n) => (
          <TouchableOpacity
            key={n}
            style={[
              styles.neighborhoodOption,
              neighborhood === n && styles.neighborhoodOptionSelected,
            ]}
            onPress={() => setNeighborhood(n)}
          >
            <Text
              style={[
                styles.neighborhoodOptionText,
                neighborhood === n && styles.neighborhoodOptionTextSelected,
              ]}
            >
              {n}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Street Name (Optional)"
        placeholder="E.g., River Run Drive, Lakeside Blvd"
        value={streetName}
        onChangeText={setStreetName}
        autoCapitalize="words"
        containerStyle={styles.streetInput}
      />

      <View style={styles.stepButtons}>
        <Button
          variant="ghost"
          onPress={() => setStep(1)}
          style={styles.backButton}
        >
          Back
        </Button>
        <Button onPress={() => setStep(3)} style={styles.nextButton}>
          Continue
        </Button>
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.stepTitle}>Tell us about yourself</Text>
      <Text style={styles.stepSubtitle}>
        A short bio helps neighbors get to know you. (Optional)
      </Text>

      <Input
        placeholder="E.g., Parent of two, love gardening and local events!"
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
        containerStyle={styles.bioInput}
      />

      <View style={styles.stepButtons}>
        <Button
          variant="ghost"
          onPress={() => setStep(2)}
          style={styles.backButton}
        >
          Back
        </Button>
        <Button
          onPress={handleComplete}
          loading={isLoading}
          style={styles.nextButton}
        >
          Get Started
        </Button>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.progress}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                s <= step && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  stepTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  avatarPicker: {
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  avatarPlaceholderText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  input: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  neighborhoodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  streetInput: {
    marginBottom: spacing.xl,
  },
  neighborhoodOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  neighborhoodOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  neighborhoodOptionText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  neighborhoodOptionTextSelected: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  bioInput: {
    marginBottom: spacing.lg,
  },
  stepButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 'auto',
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
