export type Language = 'en' | 'ta';

export type Role = 'citizen' | 'councillor' | 'mla' | 'admin';

export type IssueCategory = 
  | 'road_damage'
  | 'drainage'
  | 'street_lights'
  | 'garbage'
  | 'water'
  | 'other';

export type IssueSeverity = 'low' | 'medium' | 'high';

export type IssueStatus = 
  | 'submitted'
  | 'received'
  | 'verified'
  | 'assigned'
  | 'in_progress'
  | 'action_taken'
  | 'resolved'
  | 'reopened';

export interface TimelineEvent {
  status: IssueStatus;
  timestamp: string;
  updatedBy: string;
  comment?: string;
  evidencePhoto?: string;
}

export interface CivicIssue {
  issue_id: string;
  category: IssueCategory;
  title: string;
  description: string;
  photos: string[];
  videos?: string[];
  latitude: number;
  longitude: number;
  address: string;
  ward_id: string;
  ward_name: string;
  created_at: string;
  priority_score: number; // 0 to 100
  severity: IssueSeverity;
  status: IssueStatus;
  assigned_to?: string; // Department or Officer name
  resolved_at?: string;
  citizen_verified: boolean;
  timeline: TimelineEvent[];
  community_group_id?: string;
  upvotes_count: number;
  reporter_anonymous_id: string;
}

export interface WardInfo {
  ward_id: string;
  ward_number: number;
  name_en: string;
  name_ta: string;
  councillor_name: string;
  contact_phone: string;
  total_issues: number;
  resolved_issues: number;
}

export interface CommunityIssueGroup {
  group_id: string;
  title: string;
  category: IssueCategory;
  primary_issue_id: string;
  related_issue_ids: string[];
  ward_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  total_reports: number;
  total_photos: number;
  severity: IssueSeverity;
  priority_score: number;
  status: IssueStatus;
}
