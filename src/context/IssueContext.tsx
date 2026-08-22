import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CivicIssue, IssueStatus, CommunityIssueGroup, IssueEvidence, ActionUpdate, Role } from '../types';
import { INITIAL_MOCK_ISSUES } from '../data/mockIssues';
import { 
  fetchIssuesFromSupabase, 
  insertIssueToSupabase, 
  updateIssueStatusInSupabase, 
  deleteIssueFromSupabase,
  subscribeToIssuesRealtime,
  supabaseConfig
} from '../utils/supabaseClient';

interface AddIssueInput {
  category: CivicIssue['category'];
  title: string;
  description: string;
  citizen_name: string;
  citizen_phone: string;
  citizen_email?: string;
  citizen_address?: string;
  latitude: number;
  longitude: number;
  address: string;
  ward_id: string;
  ward_name: string;
  severity: CivicIssue['severity'];
  photos: string[];
  evidence_items?: IssueEvidence[];
  priority_score?: number;
}

interface IssueContextType {
  issues: CivicIssue[];
  allIssuesWithDeleted: CivicIssue[];
  loading: boolean;
  isDbConnected: boolean;
  addIssue: (data: AddIssueInput) => Promise<CivicIssue>;
  updateIssueStatus: (
    issueId: string, 
    status: IssueStatus, 
    userName: string, 
    userRole: 'councillor' | 'mla' | 'citizen',
    comment?: string, 
    evidencePhoto?: string, 
    assignedTo?: string
  ) => Promise<{ success: boolean; error?: string }>;
  deleteIssue: (
    issueId: string, 
    userRole: Role, 
    userName: string
  ) => Promise<{ success: boolean; error?: string }>;
  verifyIssueResolution: (issueId: string, isFixed: boolean, comment?: string) => Promise<void>;
  getIssueById: (issueId: string) => CivicIssue | undefined;
  upvoteIssue: (issueId: string) => void;
  refreshIssues: () => Promise<void>;
  communityGroups: CommunityIssueGroup[];
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(supabaseConfig.isConfigured);

  const [allIssues, setAllIssues] = useState<CivicIssue[]>(() => {
    const saved = localStorage.getItem('madurai_civic_issues_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse saved issues", e);
      }
    }
    return INITIAL_MOCK_ISSUES;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('madurai_civic_issues_v3', JSON.stringify(allIssues));
    } catch (e) {
      console.warn("Storage quota exceeded or error saving to localStorage", e);
    }
  }, [allIssues]);

  // Load issues from Supabase
  const refreshIssues = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchIssuesFromSupabase();
      if (res.data && res.data.length > 0) {
        setAllIssues(res.data);
        setIsDbConnected(true);
      }
    } catch (err) {
      console.warn('Error syncing with Supabase:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and Realtime subscription
  useEffect(() => {
    refreshIssues();

    // Subscribe to realtime database changes
    const unsubscribe = subscribeToIssuesRealtime(
      (newIssue) => {
        setAllIssues(prev => {
          if (prev.some(i => i.issue_id === newIssue.issue_id)) {
            return prev.map(i => i.issue_id === newIssue.issue_id ? newIssue : i);
          }
          return [newIssue, ...prev];
        });
      },
      (updatedIssue) => {
        setAllIssues(prev => prev.map(i => i.issue_id === updatedIssue.issue_id ? updatedIssue : i));
      },
      (deletedIssueId) => {
        setAllIssues(prev => prev.filter(i => i.issue_id !== deletedIssueId));
      }
    );

    return () => {
      unsubscribe();
    };
  }, [refreshIssues]);

  // Active issues excluding soft-deleted ones
  const activeIssues = React.useMemo(() => {
    return allIssues.filter(i => !i.deleted_at);
  }, [allIssues]);

  const addIssue = async (data: AddIssueInput): Promise<CivicIssue> => {
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    const newId = `MS-2026-${randomSeq}`;
    const nowIso = new Date().toISOString();

    const createdEvidence: IssueEvidence[] = data.evidence_items && data.evidence_items.length > 0 
      ? data.evidence_items 
      : data.photos.map((p, idx) => ({
          id: `ev-${Date.now()}-${idx}`,
          issue_id: newId,
          file_url: p,
          file_type: 'image',
          latitude: data.latitude,
          longitude: data.longitude,
          captured_at: nowIso,
          created_at: nowIso,
          is_exif_verified: false
        }));

    const newIssue: CivicIssue = {
      id: `uuid-${Date.now()}-${randomSeq}`,
      issue_id: newId,
      category: data.category,
      title: data.title,
      description: data.description,
      citizen_name: data.citizen_name,
      citizen_phone: data.citizen_phone,
      citizen_email: data.citizen_email,
      citizen_address: data.citizen_address,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      ward_id: data.ward_id,
      ward_name: data.ward_name,
      photos: data.photos,
      evidence_items: createdEvidence,
      severity: data.severity,
      status: 'NEW',
      priority_score: data.priority_score ?? (data.severity === 'high' ? 85 : data.severity === 'medium' ? 60 : 35),
      citizen_verified: false,
      upvotes_count: 1,
      reporter_anonymous_id: `CITIZEN_${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: nowIso,
      updated_at: nowIso,
      timeline: [
        {
          id: `act-${Date.now()}-init`,
          issue_id: newId,
          user_name: "Citizen Reporter",
          user_role: "citizen",
          previous_status: 'NEW',
          new_status: 'NEW',
          message: "Civic complaint registered with mandatory geotagged photo evidence.",
          created_at: nowIso
        }
      ]
    };

    // Update locally for instant responsiveness
    setAllIssues(prev => [newIssue, ...prev]);

    // Insert to Supabase DB asynchronously
    try {
      const res = await insertIssueToSupabase(newIssue);
      if (res.data) {
        setAllIssues(prev => prev.map(i => i.issue_id === newId ? res.data! : i));
      }
    } catch (err) {
      console.warn("Failed to persist to Supabase, saved locally", err);
    }

    return newIssue;
  };

  const updateIssueStatus = async (
    issueId: string,
    newStatus: IssueStatus,
    userName: string,
    userRole: 'councillor' | 'mla' | 'citizen',
    comment?: string,
    evidencePhoto?: string,
    assignedTo?: string
  ): Promise<{ success: boolean; error?: string }> => {
    let updatedIssue: CivicIssue | null = null;
    const nowIso = new Date().toISOString();

    setAllIssues(prev => prev.map(issue => {
      if (issue.issue_id !== issueId && issue.id !== issueId) return issue;

      const prevStatus = issue.status;
      const newAction: ActionUpdate = {
        id: `act-${Date.now()}`,
        issue_id: issue.issue_id,
        user_name: userName,
        user_role: userRole,
        previous_status: prevStatus,
        new_status: newStatus,
        message: comment || `Status updated from ${prevStatus} to ${newStatus}.`,
        evidence_photo: evidencePhoto,
        created_at: nowIso
      };

      const updated: CivicIssue = {
        ...issue,
        status: newStatus,
        assigned_to: assignedTo || issue.assigned_to,
        resolved_at: newStatus === 'COMPLETED' ? nowIso : issue.resolved_at,
        updated_at: nowIso,
        timeline: [...issue.timeline, newAction]
      };

      updatedIssue = updated;
      return updated;
    }));

    if (!updatedIssue) {
      return { success: false, error: 'Issue not found' };
    }

    // Sync to Supabase
    try {
      await updateIssueStatusInSupabase(
        (updatedIssue as CivicIssue).issue_id,
        newStatus,
        (updatedIssue as CivicIssue).timeline,
        assignedTo,
        (updatedIssue as CivicIssue).citizen_verified
      );
    } catch (err) {
      console.warn("Supabase update error:", err);
    }

    return { success: true };
  };

  const deleteIssue = async (
    issueId: string,
    userRole: Role,
    userName: string
  ): Promise<{ success: boolean; error?: string }> => {
    // STRICT AUTHORIZATION: Only MLA can delete
    if (userRole !== 'mla') {
      console.error("Authorization Violation: Only MLA can delete issues.");
      return { success: false, error: "Unauthorized: Only MLA office can delete issues." };
    }

    const nowIso = new Date().toISOString();
    let updatedIssue: CivicIssue | null = null;

    setAllIssues(prev => prev.map(issue => {
      if (issue.issue_id !== issueId && issue.id !== issueId) return issue;

      const deleteAction: ActionUpdate = {
        id: `act-${Date.now()}-del`,
        issue_id: issue.issue_id,
        user_name: userName,
        user_role: 'mla',
        previous_status: issue.status,
        new_status: issue.status,
        message: `Issue archived and soft-deleted by MLA Office (${userName}).`,
        created_at: nowIso
      };

      const updated: CivicIssue = {
        ...issue,
        deleted_at: nowIso,
        deleted_by: userName,
        timeline: [...issue.timeline, deleteAction]
      };

      updatedIssue = updated;
      return updated;
    }));

    if (!updatedIssue) {
      return { success: false, error: 'Issue not found' };
    }

    // Sync deletion to Supabase
    try {
      await deleteIssueFromSupabase(
        (updatedIssue as CivicIssue).issue_id,
        'mla',
        userName,
        (updatedIssue as CivicIssue).timeline
      );
    } catch (err) {
      console.warn("Supabase delete error:", err);
    }

    return { success: true };
  };

  const verifyIssueResolution = async (issueId: string, isFixed: boolean, comment?: string) => {
    const nowIso = new Date().toISOString();
    let updatedIssue: CivicIssue | null = null;

    setAllIssues(prev => prev.map(issue => {
      if (issue.issue_id !== issueId && issue.id !== issueId) return issue;

      if (isFixed) {
        const verifyAction: ActionUpdate = {
          id: `act-${Date.now()}-vf`,
          issue_id: issue.issue_id,
          user_name: "Citizen (Verification)",
          user_role: "citizen",
          previous_status: issue.status,
          new_status: 'COMPLETED',
          message: comment || 'Citizen confirmed issue resolution.',
          created_at: nowIso
        };

        const updated: CivicIssue = {
          ...issue,
          citizen_verified: true,
          status: 'COMPLETED',
          updated_at: nowIso,
          timeline: [...issue.timeline, verifyAction]
        };
        updatedIssue = updated;
        return updated;
      } else {
        // Citizen says NO, STILL A PROBLEM -> Reopen back to WORKING
        const reopenAction: ActionUpdate = {
          id: `act-${Date.now()}-reopen`,
          issue_id: issue.issue_id,
          user_name: "Citizen (Reopen Request)",
          user_role: "citizen",
          previous_status: issue.status,
          new_status: 'WORKING',
          message: comment || 'Citizen reported problem is still unresolved.',
          created_at: nowIso
        };

        const updated: CivicIssue = {
          ...issue,
          status: 'WORKING',
          citizen_verified: false,
          priority_score: Math.min(100, issue.priority_score + 15),
          updated_at: nowIso,
          timeline: [...issue.timeline, reopenAction]
        };
        updatedIssue = updated;
        return updated;
      }
    }));

    if (updatedIssue) {
      try {
        await updateIssueStatusInSupabase(
          (updatedIssue as CivicIssue).issue_id,
          (updatedIssue as CivicIssue).status,
          (updatedIssue as CivicIssue).timeline,
          undefined,
          (updatedIssue as CivicIssue).citizen_verified
        );
      } catch (err) {
        console.warn("Supabase verification update error:", err);
      }
    }
  };

  const getIssueById = (issueId: string) => {
    if (!issueId) return undefined;
    const cleanId = issueId.toUpperCase().trim();
    return allIssues.find(i => 
      i.issue_id.toUpperCase().trim() === cleanId || 
      (i.id && i.id.toUpperCase().trim() === cleanId)
    );
  };

  const upvoteIssue = (issueId: string) => {
    setAllIssues(prev => prev.map(issue => {
      if (issue.issue_id !== issueId && issue.id !== issueId) return issue;
      const updated = {
        ...issue,
        upvotes_count: issue.upvotes_count + 1,
        priority_score: Math.min(100, issue.priority_score + 2),
        updated_at: new Date().toISOString()
      };
      return updated;
    }));
  };

  // Group issues by location proximity & category
  const communityGroups: CommunityIssueGroup[] = React.useMemo(() => {
    const groups: CommunityIssueGroup[] = [];
    const processedIds = new Set<string>();

    activeIssues.forEach(issue => {
      if (processedIds.has(issue.issue_id)) return;

      const related = activeIssues.filter(other => 
        other.issue_id !== issue.issue_id &&
        other.category === issue.category &&
        Math.abs(other.latitude - issue.latitude) < 0.006 &&
        Math.abs(other.longitude - issue.longitude) < 0.006
      );

      const allCluster = [issue, ...related];
      allCluster.forEach(i => processedIds.add(i.issue_id));

      if (allCluster.length >= 1) {
        const totalPhotos = allCluster.reduce((acc, curr) => acc + (curr.photos?.length || 0), 0);
        const maxPriority = Math.max(...allCluster.map(i => i.priority_score));

        groups.push({
          group_id: `GRP-${issue.ward_id}-${issue.category.toUpperCase()}`,
          title: `${issue.title.split('near')[0] || issue.title}`,
          category: issue.category,
          primary_issue_id: issue.issue_id,
          related_issue_ids: allCluster.map(i => i.issue_id),
          ward_id: issue.ward_id,
          location_name: issue.address,
          latitude: issue.latitude,
          longitude: issue.longitude,
          total_reports: allCluster.length + allCluster.reduce((a, b) => a + (b.upvotes_count || 0), 0),
          total_photos: totalPhotos,
          severity: issue.severity,
          priority_score: Math.min(100, maxPriority + (allCluster.length * 5)),
          status: issue.status
        });
      }
    });

    return groups.sort((a, b) => b.priority_score - a.priority_score);
  }, [activeIssues]);

  return (
    <IssueContext.Provider value={{
      issues: activeIssues,
      allIssuesWithDeleted: allIssues,
      loading,
      isDbConnected,
      addIssue,
      updateIssueStatus,
      deleteIssue,
      verifyIssueResolution,
      getIssueById,
      upvoteIssue,
      refreshIssues,
      communityGroups
    }}>
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};
