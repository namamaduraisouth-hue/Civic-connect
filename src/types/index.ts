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

// Core 3 action states + initial NEW state
export type IssueStatus = 'NEW' | 'SEEN' | 'WORKING' | 'COMPLETED';

export interface IssueEvidence {
  id: string;
  issue_id: string;
  file_url: string;
  file_type: 'image' | 'video';
  latitude?: number;
  longitude?: number;
  captured_at?: string;
  created_at: string;
  is_exif_verified?: boolean;
}

export interface ActionUpdate {
  id: string;
  issue_id: string;
  user_id?: string;
  user_name: string;
  user_role: 'councillor' | 'mla' | 'citizen';
  previous_status: IssueStatus;
  new_status: IssueStatus;
  message: string;
  evidence_photo?: string;
  created_at: string;
}

export interface CivicIssue {
  id?: string;
  issue_id: string;
  category: IssueCategory;
  title: string;
  description: string;
  
  // Citizen Creator Details (Private to authorized representatives)
  citizen_name: string;
  citizen_phone: string;
  citizen_email?: string;
  citizen_address?: string;

  // Location Details
  latitude: number;
  longitude: number;
  address: string;
  ward_id: string;
  ward_name: string;

  // Evidence
  photos: string[];
  evidence_items?: IssueEvidence[];
  videos?: string[];

  // Processing & Workflow
  severity: IssueSeverity;
  status: IssueStatus;
  priority_score: number; // 0 to 100
  assigned_to?: string;
  citizen_verified: boolean;
  
  // Timestamps & Audit Trail
  created_at: string;
  updated_at?: string;
  resolved_at?: string;
  deleted_at?: string | null;
  deleted_by?: string | null;

  // Action Updates History
  timeline: ActionUpdate[];

  community_group_id?: string;
  upvotes_count: number;
  reporter_anonymous_id: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'councillor' | 'mla' | 'admin';
  name: string;
  ward_id?: string;
  ward_name?: string;
  phone?: string;
  created_at: string;
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

