// src/hooks/usePreferences.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { userService } from '../services/userService';

export const usePreferences = () => {
  const { user, updateUser } = useAuth();
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      if (user) {
        setLoading(true);
        try {
          const userData = await userService.getUserProfile(user.id);
          setPreferences(userData.preferences || {});
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPreferences();
  }, [user]);

  // Update preferences
  const updatePreferences = useCallback(async (newPreferences) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      const updatedUser = await userService.updateUserProfile(user.id, {
        preferences: {
          ...preferences,
          ...newPreferences
        }
      });
      
      setPreferences(updatedUser.preferences || {});
      await updateUser({ preferences: updatedUser.preferences });
      
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, preferences, updateUser]);

  // Update specific preference
  const updatePreference = useCallback(async (key, value) => {
    return await updatePreferences({ [key]: value });
  }, [updatePreferences]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    updatePreference
  };
};