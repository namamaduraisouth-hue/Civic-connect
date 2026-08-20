import { CivicIssue } from '../types';

export const INITIAL_MOCK_ISSUES: CivicIssue[] = [
  {
    issue_id: "MS-2026-001001",
    category: "road_damage",
    title: "Deep pothole hazards near Thirumalai Nayakkar Mahal East Gate",
    description: "Multiple severe potholes near Mahal East Gate entrance causing vehicle damage and traffic slowdown during peak hours.",
    photos: [
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
    ],
    latitude: 9.9152,
    longitude: 78.1238,
    address: "Mahal East Gate, Ward 51, Madurai South - 625001",
    ward_id: "WARD_51",
    ward_name: "Ward 51 - Thirumalai Nayakkar Mahal",
    created_at: "2026-08-18T09:30:00Z",
    priority_score: 88,
    severity: "high",
    status: "in_progress",
    assigned_to: "Highways & Road Infrastructure Dept",
    upvotes_count: 34,
    citizen_verified: false,
    reporter_anonymous_id: "CITIZEN_9812",
    timeline: [
      {
        status: "submitted",
        timestamp: "2026-08-18T09:30:00Z",
        updatedBy: "Citizen Reporter",
        comment: "Issue logged with photos"
      },
      {
        status: "received",
        timestamp: "2026-08-18T10:15:00Z",
        updatedBy: "Ward 51 Office",
        comment: "Received and dispatched inspector"
      },
      {
        status: "verified",
        timestamp: "2026-08-18T14:20:00Z",
        updatedBy: "Inspector R. Kannan",
        comment: "Physical site inspection confirmed severe road surface breakdown"
      },
      {
        status: "assigned",
        timestamp: "2026-08-19T08:00:00Z",
        updatedBy: "Councillor K. Pandian",
        comment: "Assigned to Highways repair crew"
      },
      {
        status: "in_progress",
        timestamp: "2026-08-20T07:30:00Z",
        updatedBy: "Road Works Team Lead",
        comment: "Cold asphalt patch repair currently underway"
      }
    ]
  },
  {
    issue_id: "MS-2026-001002",
    category: "water",
    title: "Drinking water pipe leak at Kamarajar Salai 4th Lane",
    description: "Main potable water line leaking heavily on the road pavement, wasting water and reducing household pressure in Ward 52.",
    photos: [
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80"
    ],
    latitude: 9.9205,
    longitude: 78.1352,
    address: "Kamarajar Salai 4th Lane, Ward 52, Madurai South - 625009",
    ward_id: "WARD_52",
    ward_name: "Ward 52 - Kamarajar Salai North",
    created_at: "2026-08-17T11:00:00Z",
    priority_score: 94,
    severity: "high",
    status: "resolved",
    resolved_at: "2026-08-19T16:00:00Z",
    assigned_to: "Madurai Corporation Water Supply Division",
    upvotes_count: 52,
    citizen_verified: false,
    reporter_anonymous_id: "CITIZEN_4421",
    timeline: [
      {
        status: "submitted",
        timestamp: "2026-08-17T11:00:00Z",
        updatedBy: "Citizen Reporter",
        comment: "Pipe line burst reported"
      },
      {
        status: "received",
        timestamp: "2026-08-17T11:30:00Z",
        updatedBy: "Ward 52 Office",
        comment: "Emergency water team alerted"
      },
      {
        status: "in_progress",
        timestamp: "2026-08-18T09:00:00Z",
        updatedBy: "TWAD Engineer S. Sundaram",
        comment: "Excavation and pipe collar replacement started"
      },
      {
        status: "resolved",
        timestamp: "2026-08-19T16:00:00Z",
        updatedBy: "Councillor R. Banumathi",
        comment: "Pipe joint sealed, regular pressure restored.",
        evidencePhoto: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    issue_id: "MS-2026-001003",
    category: "garbage",
    title: "Unattended garbage accumulation near Teppakulam South Bank",
    description: "Solid waste dump accumulating near Mariamman Kovil Teppakulam south steps, causing foul smell and health hazard.",
    photos: [
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80"
    ],
    latitude: 9.9142,
    longitude: 78.1538,
    address: "Teppakulam South Bank, Ward 55, Madurai South - 625009",
    ward_id: "WARD_55",
    ward_name: "Ward 55 - Mariamman Kovil Teppakulam",
    created_at: "2026-08-19T14:10:00Z",
    priority_score: 76,
    severity: "medium",
    status: "assigned",
    assigned_to: "Sanitation & Solid Waste Management Dept",
    upvotes_count: 19,
    citizen_verified: false,
    reporter_anonymous_id: "CITIZEN_7719",
    timeline: [
      {
        status: "submitted",
        timestamp: "2026-08-19T14:10:00Z",
        updatedBy: "Citizen Reporter",
        comment: "Garbage accumulation photo submitted"
      },
      {
        status: "received",
        timestamp: "2026-08-19T15:00:00Z",
        updatedBy: "Ward 55 Office",
        comment: "Notified Public Health Officer"
      },
      {
        status: "assigned",
        timestamp: "2026-08-20T08:15:00Z",
        updatedBy: "Councillor R. Senthil Kumar",
        comment: "Sanitation compactor truck assigned for clearing"
      }
    ]
  },
  {
    issue_id: "MS-2026-001004",
    category: "street_lights",
    title: "Non-functional LED streetlights along Anuppanadi Housing Board Road",
    description: "4 consecutive streetlight poles dark for over 3 days, making night travel unsafe for female residents and elderly.",
    photos: [
      "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80"
    ],
    latitude: 9.9075,
    longitude: 78.1512,
    address: "Anuppanadi Main Road, Ward 56, Madurai South - 625009",
    ward_id: "WARD_56",
    ward_name: "Ward 56 - Anuppanadi Central",
    created_at: "2026-08-16T19:45:00Z",
    priority_score: 82,
    severity: "high",
    status: "submitted",
    upvotes_count: 27,
    citizen_verified: false,
    reporter_anonymous_id: "CITIZEN_3309",
    timeline: [
      {
        status: "submitted",
        timestamp: "2026-08-16T19:45:00Z",
        updatedBy: "Citizen Reporter",
        comment: "Streetlight outage complaint logged"
      }
    ]
  },
  {
    issue_id: "MS-2026-001005",
    category: "drainage",
    title: "Blocked storm water drain overflow in Villapuram Main Market",
    description: "Stagnant drainage water spilling over onto shopfront pavements due to plastic debris blockage.",
    photos: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80"
    ],
    latitude: 9.8995,
    longitude: 78.1215,
    address: "Villapuram Market Street, Ward 58, Madurai South - 625012",
    ward_id: "WARD_58",
    ward_name: "Ward 58 - Villapuram Main",
    created_at: "2026-08-19T08:00:00Z",
    priority_score: 91,
    severity: "high",
    status: "in_progress",
    assigned_to: "Madurai South Underground Drainage Cell",
    upvotes_count: 41,
    citizen_verified: false,
    reporter_anonymous_id: "CITIZEN_1102",
    timeline: [
      {
        status: "submitted",
        timestamp: "2026-08-19T08:00:00Z",
        updatedBy: "Citizen Reporter",
        comment: "Drain overflow logged"
      },
      {
        status: "received",
        timestamp: "2026-08-19T08:45:00Z",
        updatedBy: "Ward 58 Office",
        comment: "Alerted Sanitary Inspector"
      },
      {
        status: "assigned",
        timestamp: "2026-08-19T10:30:00Z",
        updatedBy: "Councillor C. Maruthu",
        comment: "Suction jet machine deployed"
      },
      {
        status: "in_progress",
        timestamp: "2026-08-20T06:00:00Z",
        updatedBy: "Drainage Operations Team",
        comment: "Desilting and obstacle removal underway"
      }
    ]
  }
];
