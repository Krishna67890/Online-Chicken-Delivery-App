import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPreferences = async () => {
      if (user && user.uid) {
        setLoading(true);
        try {
          const userData = await userService.getUserProfile(user.uid);
          setPreferences(userData?.preferences || {});
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPreferences();
  }, [user]);

  const updatePreferences = useCallback(async (newPreferences) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      const updatedUser = await userService.updateUserProfile(user.uid, {
        preferences: {
          ...preferences,
          ...newPreferences
        }
      });
      
      setPreferences(updatedUser?.preferences || {});
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, preferences]);

  const value = {
    preferences,
    loading,
    error,
    updatePreferences
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
