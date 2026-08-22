import { CivicIssue } from '../types';

export const INITIAL_MOCK_ISSUES: CivicIssue[] = [
  {
    id: "uuid-issue-001",
    issue_id: "MS-2026-001001",
    category: "road_damage",
    title: "Deep pothole hazards near Thirumalai Nayakkar Mahal East Gate",
    description: "Multiple severe potholes near Mahal East Gate entrance causing vehicle damage and traffic slowdown during peak hours.",
    citizen_name: "M. Ramanathan",
    citizen_phone: "9842154321",
    citizen_email: "m.ramanathan.mdu@gmail.com",
    citizen_address: "14/2, East Gate Veli Street, Mahal Area, Madurai South",
    photos: [
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
    ],
    evidence_items: [
      {
        id: "ev-001",
        issue_id: "MS-2026-001001",
        file_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
        file_type: "image",
        latitude: 9.9152,
        longitude: 78.1238,
        captured_at: "2026-08-18T09:28:00Z",
        created_at: "2026-08-18T09:30:00Z",
        is_exif_verified: true
      }
    ],
    latitude: 9.9152,
    longitude: 78.1238,
    address: "Mahal East Gate, Ward 51, Madurai South - 625001",
    ward_id: "WARD_51",
    ward_name: "Ward 51 - Thirumalai Nayakkar Mahal",
    created_at: "2026-08-18T09:30:00Z",
    priority_score: 88,
    severity: "high",
    status: "WORKING",
    assigned_to: "Highways & Road Infrastructure Dept",
    upvotes_count: 34,
    citizen_verified: false,
    reporter_anonymous_id: "CITIZEN_9812",
    timeline: [
      {
        id: "act-001",
        issue_id: "MS-2026-001001",
        user_name: "Citizen Reporter",
        user_role: "citizen",
        previous_status: "NEW",
        new_status: "NEW",
        message: "Civic complaint registered with geotagged photo evidence.",
        created_at: "2026-08-18T09:30:00Z"
      },
      {
        id: "act-002",
        issue_id: "MS-2026-001001",
        user_name: "Councillor K. Pandian",
        user_role: "councillor",
        previous_status: "NEW",
        new_status: "SEEN",
        message: "Issue reviewed by Ward 51 Councillor office. Inspector dispatched for site verification.",
        created_at: "2026-08-18T10:15:00Z"
      },
      {
        id: "act-003",
        issue_id: "MS-2026-001001",
        user_name: "Councillor K. Pandian",
        user_role: "councillor",
        previous_status: "SEEN",
        new_status: "WORKING",
        message: "Assigned to Highways repair crew. Cold asphalt patch repair underway.",
        created_at: "2026-08-19T08:00:00Z"
      }
    ]
  },
  {
    id: "uuid-issue-002",
    issue_id: "MS-2026-001002",
    category: "water",
    title: "Drinking water pipe leak at Kamarajar Salai 4th Lane",
    description: "Main potable water line leaking heavily on the road pavement, wasting water and reducing household pressure in Ward 52.",
    citizen_name: "S. Meenakshi Sundaram",
    citizen_phone: "9443128765",
    citizen_email: "meenakshi.sundaram@yahoo.co.in",
    citizen_address: "56, 4th Lane, Kamarajar Salai, Madurai South",
    photos: [
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80"
    ],
    evidence_items: [
      {
        id: "ev-002",
        issue_id: "MS-2026-001002",
        file_url: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
        file_type: "image",
        latitude: 9.9205,
        longitude: 78.1352,
        captured_at: "2026-08-17T10:55:00Z",
        created_at: "2026-08-17T11:00:00Z",
        is_exif_verified: true
      }
    ],
    latitude: 9.9205,
    longitude: 78.1352,
    address: "Kamarajar Salai 4th Lane, Ward 52, Madurai South - 625009",
    ward_id: "WARD_52",
    ward_name: "Ward 52 - Kamarajar Salai North",
    created_at: "2026-08-17T11:00:00Z",
    priority_score: 94,
    severity: "high",
    status: "COMPLETED",
    resolved_at: "2026-08-19T16:00:00Z",
    assigned_to: "Madurai Corporation Water Supply Division",
    upvotes_count: 52,
    citizen_verified: true,
    reporter_anonymous_id: "CITIZEN_4421",
    timeline: [
      {
        id: "act-004",
        issue_id: "MS-2026-001002",
        user_name: "Citizen Reporter",
        user_role: "citizen",
        previous_status: "NEW",
        new_status: "NEW",
        message: "Pipe line burst reported with photographic evidence.",
        created_at: "2026-08-17T11:00:00Z"
      },
      {
        id: "act-005",
        issue_id: "MS-2026-001002",
        user_name: "Councillor R. Banumathi",
        user_role: "councillor",
        previous_status: "NEW",
        new_status: "SEEN",
        message: "Ward 52 office acknowledged emergency water line issue.",
        created_at: "2026-08-17T11:30:00Z"
      },
      {
        id: "act-006",
        issue_id: "MS-2026-001002",
        user_name: "Councillor R. Banumathi",
        user_role: "councillor",
        previous_status: "SEEN",
        new_status: "WORKING",
        message: "TWAD & Corporation engineering team deployed for excavation and joint collar fitting.",
        created_at: "2026-08-18T09:00:00Z"
      },
      {
        id: "act-007",
        issue_id: "MS-2026-001002",
        user_name: "Councillor R. Banumathi",
        user_role: "councillor",
        previous_status: "WORKING",
        new_status: "COMPLETED",
        message: "Pipe joint sealed and pressure fully restored.",
        evidence_photo: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
        created_at: "2026-08-19T16:00:00Z"
      }
    ]
  },
  {
    id: "uuid-issue-003",
    issue_id: "MS-2026-001003",
    category: "garbage",
    title: "Unattended garbage accumulation near Teppakulam South Bank",
    description: "Solid waste dump accumulating near Mariamman Kovil Teppakulam south steps, causing foul smell and health hazard.",
    citizen_name: "K. Selvakumar",
    citizen_phone: "9789012345",
    citizen_email: "selvakumar.k@gmail.com",
    citizen_address: "88, South Bank Road, Teppakulam, Madurai South",
    photos: [
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80"
    ],
    evidence_items: [
      {
        id: "ev-003",
        issue_id: "MS-2026-001003",
        file_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
        file_type: "image",
        latitude: 9.9142,
        longitude: 78.1538,
        captured_at: "2026-08-19T14:05:00Z",
        created_at: "2026-08-19T14:10:00Z",
        is_exif_verified: true
      }
    ],
    latitude: 9.9142,
    longitude: 78.1538,
    address: "Teppakulam South Bank, Ward 55, Madurai South - 625009",
    ward_id: "WARD_55",
    ward_name: "Ward 55 - Mariamman Kovil Teppakulam",
    created_at: "2026-08-19T14:10:00Z",
    priority_score: 76,
    severity: "medium",
    status: "SEEN",
    assigned_to: "Sanitation & Solid Waste Management Dept",
    upvotes_count: 19,
    citizen_verified: false,
    reporter_anonymous_id: "CITIZEN_7719",
    timeline: [
      {
        id: "act-008",
        issue_id: "MS-2026-001003",
        user_name: "Citizen Reporter",
        user_role: "citizen",
        previous_status: "NEW",
        new_status: "NEW",
        message: "Garbage accumulation reported with location coordinates.",
        created_at: "2026-08-19T14:10:00Z"
      },
      {
        id: "act-009",
        issue_id: "MS-2026-001003",
        user_name: "Councillor R. Senthil Kumar",
        user_role: "councillor",
        previous_status: "NEW",
        new_status: "SEEN",
        message: "Reviewed by Ward 55 Councillor. Sanitation inspector alerted for compactor vehicle scheduling.",
        created_at: "2026-08-19T15:00:00Z"
      }
    ]
  },
  {
    id: "uuid-issue-004",
    issue_id: "MS-2026-001004",
    category: "street_lights",
    title: "Non-functional LED streetlights along Anuppanadi Housing Board Road",
    description: "4 consecutive streetlight poles dark for over 3 days, making night travel unsafe for female residents and elderly.",
    citizen_name: "P. Vasantha",
    citizen_phone: "9940123987",
    citizen_address: "Plot 112, Housing Board Colony, Anuppanadi, Madurai South",
    photos: [
      "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80"
    ],
    evidence_items: [
      {
        id: "ev-004",
        issue_id: "MS-2026-001004",
        file_url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
        file_type: "image",
        latitude: 9.9075,
        longitude: 78.1512,
        captured_at: "2026-08-16T19:40:00Z",
        created_at: "2026-08-16T19:45:00Z",
        is_exif_verified: false
      }
    ],
    latitude: 9.9075,
    longitude: 78.1512,
    address: "Anuppanadi Main Road, Ward 56, Madurai South - 625009",
    ward_id: "WARD_56",
    ward_name: "Ward 56 - Anuppanadi Central",
    created_at: "2026-08-16T19:45:00Z",
    priority_score: 82,
    severity: "high",
    status: "NEW",
    upvotes_count: 27,
    citizen_verified: false,
    reporter_anonymous_id: "CITIZEN_3309",
    timeline: [
      {
        id: "act-010",
        issue_id: "MS-2026-001004",
        user_name: "Citizen Reporter",
        user_role: "citizen",
        previous_status: "NEW",
        new_status: "NEW",
        message: "Streetlight outage complaint submitted by resident.",
        created_at: "2026-08-16T19:45:00Z"
      }
    ]
  },
  {
    id: "uuid-issue-005",
    issue_id: "MS-2026-001005",
    category: "drainage",
    title: "Blocked storm water drain overflow in Villapuram Main Market",
    description: "Stagnant drainage water spilling over onto shopfront pavements due to plastic debris blockage.",
    citizen_name: "A. Mohamed Ibrahim",
    citizen_phone: "9865043210",
    citizen_email: "ibrahim.villapuram@gmail.com",
    citizen_address: "32, Market Street, Villapuram, Madurai South",
    photos: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80"
    ],
    evidence_items: [
      {
        id: "ev-005",
        issue_id: "MS-2026-001005",
        file_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
        file_type: "image",
        latitude: 9.8995,
        longitude: 78.1215,
        captured_at: "2026-08-19T07:50:00Z",
        created_at: "2026-08-19T08:00:00Z",
        is_exif_verified: true
      }
    ],
    latitude: 9.8995,
    longitude: 78.1215,
    address: "Villapuram Market Street, Ward 58, Madurai South - 625012",
    ward_id: "WARD_58",
    ward_name: "Ward 58 - Villapuram Main",
    created_at: "2026-08-19T08:00:00Z",
    priority_score: 91,
    severity: "high",
    status: "WORKING",
    assigned_to: "Madurai South Underground Drainage Cell",
    upvotes_count: 41,
    citizen_verified: false,
    reporter_anonymous_id: "CITIZEN_1102",
    timeline: [
      {
        id: "act-011",
        issue_id: "MS-2026-001005",
        user_name: "Citizen Reporter",
        user_role: "citizen",
        previous_status: "NEW",
        new_status: "NEW",
        message: "Drainage blockage reported by shop owner.",
        created_at: "2026-08-19T08:00:00Z"
      },
      {
        id: "act-012",
        issue_id: "MS-2026-001005",
        user_name: "Councillor C. Maruthu",
        user_role: "councillor",
        previous_status: "NEW",
        new_status: "SEEN",
        message: "Ward 58 office confirmed inspector visit.",
        created_at: "2026-08-19T08:45:00Z"
      },
      {
        id: "act-013",
        issue_id: "MS-2026-001005",
        user_name: "Councillor C. Maruthu",
        user_role: "councillor",
        previous_status: "SEEN",
        new_status: "WORKING",
        message: "Suction jet machine and desilting crew deployed.",
        created_at: "2026-08-19T10:30:00Z"
      }
    ]
  }
];

