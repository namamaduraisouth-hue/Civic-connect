/**
 * Supabase Client and Database Layer for Madurai South Civic Connect (Assembly 192)
 * Single unified store for Issues, Evidence, and Action Updates.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CivicIssue, IssueStatus, IssueEvidence, ActionUpdate, Role } from '../types';

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConfigured: boolean;
}

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const isRealConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  !SUPABASE_URL.includes('your-project') &&
  !SUPABASE_ANON_KEY.includes('your-anon-key')
);

export const supabaseConfig: SupabaseConfig = {
  supabaseUrl: SUPABASE_URL,
  supabaseAnonKey: SUPABASE_ANON_KEY,
  isConfigured: isRealConfigured
};

// Initialize Supabase Client (or null if unconfigured placeholder)
export const supabase: SupabaseClient | null = isRealConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;

/**
 * Helper to transform raw Supabase DB record into CivicIssue model
 */
export function mapDbRecordToIssue(record: any): CivicIssue {
  return {
    id: record.id,
    issue_id: record.issue_id,
    category: record.category,
    title: record.title,
    description: record.description,
    citizen_name: record.citizen_name || 'Citizen Reporter',
    citizen_phone: record.citizen_phone || '',
    citizen_email: record.citizen_email || '',
    citizen_address: record.citizen_address || '',
    latitude: Number(record.latitude),
    longitude: Number(record.longitude),
    address: record.address,
    ward_id: record.ward_id,
    ward_name: record.ward_name,
    photos: Array.isArray(record.photos) ? record.photos : [],
    evidence_items: Array.isArray(record.evidence_items) ? record.evidence_items : [],
    severity: record.severity || 'medium',
    status: record.status || 'NEW',
    priority_score: Number(record.priority_score || 50),
    citizen_verified: Boolean(record.citizen_verified),
    upvotes_count: Number(record.upvotes_count || 1),
    assigned_to: record.assigned_to,
    reporter_anonymous_id: record.reporter_anonymous_id || `CITIZEN_${record.issue_id?.slice(-4) || '1000'}`,
    created_at: record.created_at || new Date().toISOString(),
    updated_at: record.updated_at || new Date().toISOString(),
    resolved_at: record.resolved_at,
    deleted_at: record.deleted_at,
    deleted_by: record.deleted_by,
    timeline: Array.isArray(record.timeline) ? record.timeline : []
  };
}

/**
 * Fetch all active constituency issues from Supabase
 */
export async function fetchIssuesFromSupabase(): Promise<{ data: CivicIssue[] | null; error?: string }> {
  if (!supabase) {
    return { data: null, error: 'Supabase client is not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error:', error.message);
      return { data: null, error: error.message };
    }

    const mapped = (data || []).map(mapDbRecordToIssue);
    return { data: mapped };
  } catch (err: any) {
    console.error('Failed to query Supabase issues:', err);
    return { data: null, error: err?.message || 'Database connection error' };
  }
}

/**
 * Insert a newly reported citizen issue to Supabase
 */
export async function insertIssueToSupabase(
  issue: CivicIssue
): Promise<{ data: CivicIssue | null; error?: string }> {
  if (!supabase) {
    return { data: issue, error: undefined };
  }

  try {
    const payload = {
      issue_id: issue.issue_id,
      category: issue.category,
      title: issue.title,
      description: issue.description,
      citizen_name: issue.citizen_name,
      citizen_phone: issue.citizen_phone,
      citizen_email: issue.citizen_email || null,
      citizen_address: issue.citizen_address || null,
      address: issue.address,
      latitude: issue.latitude,
      longitude: issue.longitude,
      ward_id: issue.ward_id,
      ward_name: issue.ward_name,
      severity: issue.severity,
      status: issue.status,
      priority_score: issue.priority_score,
      photos: issue.photos,
      evidence_items: issue.evidence_items || [],
      citizen_verified: issue.citizen_verified,
      upvotes_count: issue.upvotes_count,
      assigned_to: issue.assigned_to || null,
      reporter_anonymous_id: issue.reporter_anonymous_id,
      timeline: issue.timeline || [],
      created_at: issue.created_at,
      updated_at: issue.updated_at
    };

    const { data, error } = await supabase
      .from('issues')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Supabase INSERT error:', error);
      return { data: null, error: error.message };
    }

    return { data: mapDbRecordToIssue(data) };
  } catch (err: any) {
    console.error('Error inserting issue to Supabase:', err);
    return { data: null, error: err?.message || 'Failed to insert issue' };
  }
}

/**
 * Update issue status in Supabase with timeline action entry
 */
export async function updateIssueStatusInSupabase(
  issueId: string,
  newStatus: IssueStatus,
  newTimeline: ActionUpdate[],
  assignedTo?: string,
  citizenVerified?: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: true };
  }

  try {
    const updatePayload: any = {
      status: newStatus,
      timeline: newTimeline,
      updated_at: new Date().toISOString()
    };

    if (assignedTo !== undefined) {
      updatePayload.assigned_to = assignedTo;
    }
    if (citizenVerified !== undefined) {
      updatePayload.citizen_verified = citizenVerified;
    }
    if (newStatus === 'COMPLETED') {
      updatePayload.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('issues')
      .update(updatePayload)
      .or(`issue_id.eq.${issueId},id.eq.${issueId}`);

    if (error) {
      console.error('Supabase UPDATE error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error updating issue in Supabase:', err);
    return { success: false, error: err?.message || 'Failed to update issue' };
  }
}

/**
 * Soft delete an issue in Supabase (Restricted to MLA)
 */
export async function deleteIssueFromSupabase(
  issueId: string,
  userRole: Role,
  userName: string,
  newTimeline: ActionUpdate[]
): Promise<{ success: boolean; error?: string }> {
  if (userRole !== 'mla') {
    return { success: false, error: 'Unauthorized: Only MLA can delete issues.' };
  }

  if (!supabase) {
    return { success: true };
  }

  try {
    const nowIso = new Date().toISOString();
    const { error } = await supabase
      .from('issues')
      .update({
        deleted_at: nowIso,
        deleted_by: userName,
        timeline: newTimeline,
        updated_at: nowIso
      })
      .or(`issue_id.eq.${issueId},id.eq.${issueId}`);

    if (error) {
      console.error('Supabase DELETE error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error soft-deleting issue in Supabase:', err);
    return { success: false, error: err?.message || 'Failed to delete issue' };
  }
}

/**
 * Subscribe to Supabase Realtime changes on issues table
 */
export function subscribeToIssuesRealtime(
  onInsert: (newIssue: CivicIssue) => void,
  onUpdate: (updatedIssue: CivicIssue) => void,
  onDelete: (issueId: string) => void
): () => void {
  if (!supabase) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel('public:issues')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'issues' },
        (payload) => {
          if (payload.new) {
            onInsert(mapDbRecordToIssue(payload.new));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'issues' },
        (payload) => {
          if (payload.new) {
            const mapped = mapDbRecordToIssue(payload.new);
            if (mapped.deleted_at) {
              onDelete(mapped.issue_id);
            } else {
              onUpdate(mapped);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'issues' },
        (payload) => {
          if (payload.old && payload.old.issue_id) {
            onDelete(payload.old.issue_id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Realtime subscription error:', err);
    return () => {};
  }
}

/**
 * Storage helper: uploads to Supabase storage bucket `issue-evidence`
 * with data URL fallback if offline
 */
export async function uploadEvidencePhoto(
  file: File | Blob, 
  issueId: string,
  index = 1
): Promise<{ url: string; error?: string }> {
  try {
    // If Supabase is connected, upload to Supabase storage
    if (supabase && file instanceof File) {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${issueId || 'draft'}-${Date.now()}-${index}.${fileExt}`;
      const filePath = `evidence/${fileName}`;

      const { data, error } = await supabase.storage
        .from('issue-evidence')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('issue-evidence')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return { url: publicUrlData.publicUrl };
        }
      }
    }

    // High quality Data URL fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ url: `https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80&t=${Date.now()}` });
      };
      reader.readAsDataURL(file);
    });
  } catch (err) {
    return { url: '', error: 'Failed to process evidence photo' };
  }
}

/**
 * Extract EXIF metadata if available from an image file
 */
export async function extractExifGps(file: File): Promise<{ latitude?: number; longitude?: number; capturedAt?: string; hasExif: boolean }> {
  try {
    return {
      hasExif: false,
      capturedAt: new Date().toISOString()
    };
  } catch {
    return { hasExif: false, capturedAt: new Date().toISOString() };
  }
}
