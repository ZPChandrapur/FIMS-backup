import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface UserPermission {
  application_name: string;
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
  can_admin: boolean;
  role_name: string;
}

export interface UserProfile {
  name: string | null;
  role_name: string | null;
  email: string | null;
  phone_number: string | null;
}
export interface PermissionCheck {
  hasAccess: (app: string, permission?: 'read' | 'write' | 'delete' | 'admin') => boolean;
  permissions: UserPermission[];
  userRole: string | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export const usePermissions = (user: User | null): PermissionCheck => {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPermissions([]);
      setUserRole(null);
      setUserProfile(null);
      setIsLoading(false);
      return;
    }

    const fetchPermissions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch user roles and permissions directly without RPC function
        const { data: userRolesData, error: userRolesError } = await supabase
          .from('user_roles')
          .select(`
            name,
            phone_number,
            role_id,
            roles!inner(name)
          `)
          .eq('user_id', user.id);

        if (userRolesError) {
          console.error('Error fetching user roles:', userRolesError);
          // Don't throw error, continue with empty permissions
          console.warn('Continuing with empty permissions due to user roles error');
        }

        // Get role IDs for permission lookup
        const roleIds = userRolesData?.map(ur => ur.role_id) || [];
        const primaryRole = userRolesData?.[0]?.roles?.name || null;
        
        setUserRole(primaryRole);

        // Fetch permissions for user's roles
        let permissionsData: UserPermission[] = [];
        if (roleIds.length > 0) {
          const { data: permsData, error: permsError } = await supabase
            .from('application_permissions')
            .select(`
              application_name,
              can_read,
              can_write,
              can_delete,
              can_admin,
              roles!inner(name)
            `)
            .in('role_id', roleIds);

          if (permsError) {
            console.error('Error fetching permissions:', permsError);
            // Continue without permissions rather than failing
            permissionsData = [];
          } else {
            permissionsData = permsData?.map(p => ({
              application_name: p.application_name,
              can_read: p.can_read,
              can_write: p.can_write,
              can_delete: p.can_delete,
              can_admin: p.can_admin,
              role_name: p.roles?.name || primaryRole || 'unknown'
            })) || [];
          }
        }

        // Debug logging
        console.log('User ID:', user.id);
        console.log('User Roles Data:', userRolesData);
        console.log('Role IDs:', roleIds);
        console.log('Permissions Data:', permissionsData);
        console.log('FIMS Permission:', permissionsData.find(p => p.application_name === 'fims'));

        setPermissions(permissionsData);

        // Set user profile from the fetched data
        const primaryUserRole = userRolesData?.[0];
        setUserProfile({
          name: primaryUserRole?.name || null,
          role_name: primaryRole,
          email: user.email || null,
          phone_number: primaryUserRole?.phone_number || null
        });

      } catch (err) {
        console.error('Error fetching permissions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch permissions');
        // Set basic profile with email only on error
        setUserProfile({
          name: null,
          role_name: null,
          email: user?.email || null,
          phone_number: null
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  const hasAccess = (app: string, permission: 'read' | 'write' | 'delete' | 'admin' = 'read'): boolean => {
    console.log('Checking access for:', app, permission);
    console.log('Available permissions:', permissions);
    
    const appPermission = permissions.find(p => p.application_name === app);
    console.log('Found app permission:', appPermission);
    
    if (!appPermission) return false;

    switch (permission) {
      case 'read':
        return appPermission.can_read;
      case 'write':
        return appPermission.can_write;
      case 'delete':
        return appPermission.can_delete;
      case 'admin':
        return appPermission.can_admin;
      default:
        return false;
    }
  };

  return {
    hasAccess,
    permissions,
    userRole,
    userProfile,
    isLoading,
    error
  };
};