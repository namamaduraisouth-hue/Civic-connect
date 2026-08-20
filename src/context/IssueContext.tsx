import React, { createContext, useContext, useState, useEffect } from 'react';
import { CivicIssue, IssueStatus, CommunityIssueGroup } from '../types';
import { INITIAL_MOCK_ISSUES } from '../data/mockIssues';

interface IssueContextType {
  issues: CivicIssue[];
  addIssue: (newIssueData: Omit<CivicIssue, 'issue_id' | 'created_at' | 'status' | 'timeline' | 'citizen_verified' | 'upvotes_count' | 'reporter_anonymous_id'>) => CivicIssue;
  updateIssueStatus: (issueId: string, status: IssueStatus, updatedBy: string, comment?: string, evidencePhoto?: string, assignedTo?: string) => void;
  verifyIssueResolution: (issueId: string, isFixed: boolean, comment?: string) => void;
  getIssueById: (issueId: string) => CivicIssue | undefined;
  upvoteIssue: (issueId: string) => void;
  communityGroups: CommunityIssueGroup[];
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<CivicIssue[]>(() => {
    const saved = localStorage.getItem('madurai_civic_issues');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved issues", e);
      }
    }
    return INITIAL_MOCK_ISSUES;
  });

  useEffect(() => {
    localStorage.setItem('madurai_civic_issues', JSON.stringify(issues));
  }, [issues]);

  const addIssue = (
    data: Omit<CivicIssue, 'issue_id' | 'created_at' | 'status' | 'timeline' | 'citizen_verified' | 'upvotes_count' | 'reporter_anonymous_id'>
  ): CivicIssue => {
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    const newId = `MS-2026-${randomSeq}`;
    const nowIso = new Date().toISOString();

    const createdIssue: CivicIssue = {
      ...data,
      issue_id: newId,
      created_at: nowIso,
      status: 'submitted',
      citizen_verified: false,
      upvotes_count: 1,
      reporter_anonymous_id: `CITIZEN_${Math.floor(1000 + Math.random() * 9000)}`,
      timeline: [
        {
          status: 'submitted',
          timestamp: nowIso,
          updatedBy: 'Citizen Reporter',
          comment: 'Civic complaint submitted with location verification'
        }
      ]
    };

    setIssues(prev => [createdIssue, ...prev]);
    return createdIssue;
  };

  const updateIssueStatus = (
    issueId: string,
    status: IssueStatus,
    updatedBy: string,
    comment?: string,
    evidencePhoto?: string,
    assignedTo?: string
  ) => {
    setIssues(prev => prev.map(issue => {
      if (issue.issue_id !== issueId) return issue;

      const updatedTimeline = [
        ...issue.timeline,
        {
          status,
          timestamp: new Date().toISOString(),
          updatedBy,
          comment,
          evidencePhoto
        }
      ];

      return {
        ...issue,
        status,
        assigned_to: assignedTo || issue.assigned_to,
        resolved_at: status === 'resolved' ? new Date().toISOString() : issue.resolved_at,
        timeline: updatedTimeline
      };
    }));
  };

  const verifyIssueResolution = (issueId: string, isFixed: boolean, comment?: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.issue_id !== issueId) return issue;

      if (isFixed) {
        return {
          ...issue,
          citizen_verified: true,
          timeline: [
            ...issue.timeline,
            {
              status: 'resolved',
              timestamp: new Date().toISOString(),
              updatedBy: 'Citizen (Verification)',
              comment: comment || 'Citizen confirmed issue resolution.'
            }
          ]
        };
      } else {
        // Citizen says NO, STILL A PROBLEM -> Reopen
        return {
          ...issue,
          status: 'reopened',
          citizen_verified: false,
          priority_score: Math.min(100, issue.priority_score + 15),
          timeline: [
            ...issue.timeline,
            {
              status: 'reopened',
              timestamp: new Date().toISOString(),
              updatedBy: 'Citizen (Reopen Request)',
              comment: comment || 'Citizen reported problem is still unresolved.'
            }
          ]
        };
      }
    }));
  };

  const getIssueById = (issueId: string) => {
    return issues.find(i => i.issue_id.toUpperCase().trim() === issueId.toUpperCase().trim());
  };

  const upvoteIssue = (issueId: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.issue_id !== issueId) return issue;
      return {
        ...issue,
        upvotes_count: issue.upvotes_count + 1,
        priority_score: Math.min(100, issue.priority_score + 2)
      };
    }));
  };

  // Group issues by location proximity & category
  const communityGroups: CommunityIssueGroup[] = React.useMemo(() => {
    const groups: CommunityIssueGroup[] = [];
    const processedIds = new Set<string>();

    issues.forEach(issue => {
      if (processedIds.has(issue.issue_id)) return;

      // Find related issues within ~0.005 lat/lng distance (approx 500m) with same category
      const related = issues.filter(other => 
        other.issue_id !== issue.issue_id &&
        other.category === issue.category &&
        Math.abs(other.latitude - issue.latitude) < 0.006 &&
        Math.abs(other.longitude - issue.longitude) < 0.006
      );

      const allCluster = [issue, ...related];
      allCluster.forEach(i => processedIds.add(i.issue_id));

      if (allCluster.length >= 1) {
        const totalPhotos = allCluster.reduce((acc, curr) => acc + curr.photos.length, 0);
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
          total_reports: allCluster.length + allCluster.reduce((a, b) => a + b.upvotes_count, 0),
          total_photos: totalPhotos,
          severity: issue.severity,
          priority_score: Math.min(100, maxPriority + (allCluster.length * 5)),
          status: issue.status
        });
      }
    });

    return groups.sort((a, b) => b.priority_score - a.priority_score);
  }, [issues]);

  return (
    <IssueContext.Provider value={{
      issues,
      addIssue,
      updateIssueStatus,
      verifyIssueResolution,
      getIssueById,
      upvoteIssue,
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
