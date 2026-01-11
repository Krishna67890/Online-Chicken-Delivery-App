import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { profileService } from '../services/profileService';

export const useProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        setLoading(true);
        try {
          // Get profile from auth context or fetch from service
          if (user.profile) {
            setProfile(user.profile);
          } else {
            // In a real app, this would fetch from the backend
            // For now, we'll use a mock implementation
            const mockProfile = {
              id: user.id,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              phone: user.phone || '',
              avatar: user.avatar || '',
              savedAddresses: user.savedAddresses || [],
              favoriteItems: user.favoriteItems || [],
              loyaltyPoints: user.loyaltyPoints || 0,
              dietaryPreferences: user.dietaryPreferences || {},
              memberSince: user.createdAt || new Date().toISOString(),
              notifications: user.notifications || {
                email: true,
                sms: false,
                push: true
              }
            };
            setProfile(mockProfile);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProfile();
  }, [user]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update the profile in the auth context
      const updatedUser = { ...user, ...profileData, profile: { ...profile, ...profileData } };
      await updateUser(updatedUser);
      
      // Update local state
      setProfile(prev => ({ ...prev, ...profileData }));
      
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, profile, updateUser]);

  const uploadAvatar = useCallback(async (file) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would upload to a storage service
      // For now, we'll simulate with a data URL or placeholder
      const avatarUrl = URL.createObjectURL(file);
      
      // Update the user profile with the new avatar
      const updatedUser = { ...user, avatar: avatarUrl };
      await updateUser(updatedUser);
      
      // Update local state
      setProfile(prev => ({ ...prev, avatar: avatarUrl }));
      
      return avatarUrl;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, updateUser]);

  const refreshProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would fetch fresh data from the backend
      // For now, we'll just reload from the auth context
      if (user?.profile) {
        setProfile(user.profile);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    refreshProfile
  };
};