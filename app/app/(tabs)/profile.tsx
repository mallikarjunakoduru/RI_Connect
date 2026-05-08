import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Settings,
  FileText,
  ShoppingBag,
  Heart,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit2,
  X,
} from 'lucide-react-native';

import { colors, spacing, fontSize, borderRadius, NEIGHBORHOODS } from '../../src/constants';
import { Avatar, Button, Input, StatusMessage } from '../../src/components/ui';
import { useAuth } from '../../src/hooks/useAuth';

type MenuItem = {
  icon: typeof Settings;
  label: string;
  onPress: () => void;
  isDestructive?: boolean;
};

type StatusState = {
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
} | null;

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, signOut, updateProfile } = useAuth();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(profile?.display_name || '');
  const [editBio, setEditBio] = useState(profile?.bio || '');
  const [editNeighborhood, setEditNeighborhood] = useState(profile?.neighborhood || '');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);

  const showComingSoon = (feature: string) => {
    const message = `${feature} will be available soon!`;
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Coming Soon', message);
    }
  };

  const handleSignOut = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to sign out?');
      if (confirmed) {
        await signOut();
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              await signOut();
            },
          },
        ]
      );
    }
  };

  const handleEditProfile = () => {
    setEditName(profile?.display_name || '');
    setEditBio(profile?.bio || '');
    setEditNeighborhood(profile?.neighborhood || '');
    setStatus(null);
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      setStatus({ type: 'error', message: 'Name is required.' });
      return;
    }

    setIsSaving(true);
    setStatus({ type: 'info', message: 'Saving changes...' });

    try {
      await updateProfile({
        display_name: editName.trim(),
        bio: editBio.trim() || null,
        neighborhood: editNeighborhood || null,
      });

      setStatus({ type: 'success', message: 'Profile updated!' });
      setTimeout(() => {
        setShowEditModal(false);
        setStatus(null);
      }, 1000);
    } catch (error: any) {
      setStatus({
        type: 'error',
        title: 'Failed to save',
        message: error.message || 'Something went wrong.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: FileText,
      label: 'My Posts',
      onPress: () => showComingSoon('My Posts'),
    },
    {
      icon: ShoppingBag,
      label: 'My Listings',
      onPress: () => showComingSoon('My Listings'),
    },
    {
      icon: Heart,
      label: 'Saved Items',
      onPress: () => showComingSoon('Saved Items'),
    },
    {
      icon: Bell,
      label: 'Notification Settings',
      onPress: () => showComingSoon('Notification Settings'),
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      onPress: () => showComingSoon('Privacy & Security'),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onPress: () => showComingSoon('Help & Support'),
    },
    {
      icon: LogOut,
      label: 'Sign Out',
      onPress: handleSignOut,
      isDestructive: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => showComingSoon('Settings')}
        >
          <Settings size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Avatar
              source={profile?.avatar_url}
              name={profile?.display_name}
              size="xl"
            />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={() => showComingSoon('Change Avatar')}
            >
              <Edit2 size={16} color={colors.textInverse} />
            </TouchableOpacity>
          </View>

          <Text style={styles.displayName}>
            {profile?.display_name || 'User'}
          </Text>

          {profile?.neighborhood && (
            <Text style={styles.neighborhood}>
              📍 {profile.neighborhood}
            </Text>
          )}

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Listings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>—</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {profile?.bio && (
            <Text style={styles.bio}>{profile.bio}</Text>
          )}

          <Button
            variant="outline"
            size="sm"
            onPress={handleEditProfile}
            style={styles.editProfileButton}
          >
            Edit Profile
          </Button>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                item.isDestructive && styles.menuItemDestructive,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <item.icon
                  size={22}
                  color={item.isDestructive ? colors.error : colors.text}
                />
                <Text
                  style={[
                    styles.menuItemLabel,
                    item.isDestructive && styles.menuItemLabelDestructive,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
              {!item.isDestructive && (
                <ChevronRight size={20} color={colors.textTertiary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Button
              size="sm"
              onPress={handleSaveProfile}
              loading={isSaving}
              disabled={isSaving}
            >
              Save
            </Button>
          </View>

          <ScrollView style={styles.modalContent}>
            {status && (
              <StatusMessage
                type={status.type}
                title={status.title}
                message={status.message}
              />
            )}

            <Input
              label="Display Name"
              placeholder="Your name"
              value={editName}
              onChangeText={setEditName}
              containerStyle={styles.inputContainer}
            />

            <Text style={styles.inputLabel}>Neighborhood</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.neighborhoodScroll}
            >
              {NEIGHBORHOODS.map((neighborhood) => (
                <TouchableOpacity
                  key={neighborhood}
                  style={[
                    styles.neighborhoodChip,
                    editNeighborhood === neighborhood && styles.neighborhoodChipSelected,
                  ]}
                  onPress={() => setEditNeighborhood(neighborhood)}
                >
                  <Text
                    style={[
                      styles.neighborhoodChipText,
                      editNeighborhood === neighborhood && styles.neighborhoodChipTextSelected,
                    ]}
                  >
                    {neighborhood}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Input
              label="Bio"
              placeholder="Tell your neighbors about yourself..."
              value={editBio}
              onChangeText={setEditBio}
              multiline
              numberOfLines={4}
              containerStyle={styles.inputContainer}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  headerIcon: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 8,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  displayName: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  neighborhood: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  bio: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    lineHeight: 22,
  },
  editProfileButton: {
    marginTop: spacing.md,
  },
  menuSection: {
    backgroundColor: colors.surface,
    marginTop: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuItemLabel: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  menuItemDestructive: {
    borderBottomWidth: 0,
    marginTop: spacing.sm,
  },
  menuItemLabelDestructive: {
    color: colors.error,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    paddingVertical: spacing.lg,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  modalContent: {
    flex: 1,
    padding: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  neighborhoodScroll: {
    marginBottom: spacing.md,
  },
  neighborhoodChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    marginRight: spacing.sm,
  },
  neighborhoodChipSelected: {
    backgroundColor: colors.primary,
  },
  neighborhoodChipText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
  },
  neighborhoodChipTextSelected: {
    color: colors.textInverse,
  },
});
