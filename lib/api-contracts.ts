// REST API Contract Definitions

export interface APIResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface HCPSearchParams {
  page?: number
  limit?: number
  search?: string
  territory?: string
  region?: string
  specialty?: string
  city?: string
  therapeuticArea?: string
}

export interface TerritorySearchParams {
  region?: string
  includeHcpCount?: boolean
}

// API Endpoints Documentation
export const API_ENDPOINTS = {
  // HCP Management
  GET_HCPS: {
    method: "GET",
    path: "/api/hcps",
    description: "Fetch paginated list of HCPs with optional filtering",
    queryParams: "HCPSearchParams",
    response: "APIResponse<HCP[]>",
    example: "/api/hcps?page=1&limit=50&territory=California&specialty=Cardiology",
  },

  GET_HCP_BY_ID: {
    method: "GET",
    path: "/api/hcps/:id",
    description: "Fetch single HCP by ID",
    response: "APIResponse<HCP>",
    example: "/api/hcps/123",
  },

  CREATE_HCP: {
    method: "POST",
    path: "/api/hcps",
    description: "Create new HCP record",
    body: 'Omit<HCP, "id">',
    response: "APIResponse<HCP>",
    example: "POST /api/hcps with HCP data in body",
  },

  UPDATE_HCP: {
    method: "PUT",
    path: "/api/hcps/:id",
    description: "Update existing HCP record",
    body: "Partial<HCP>",
    response: "APIResponse<HCP>",
    example: "PUT /api/hcps/123 with updated data",
  },

  // Territory Management
  GET_TERRITORIES: {
    method: "GET",
    path: "/api/territories",
    description: "Fetch all territories with metadata",
    queryParams: "TerritorySearchParams",
    response: "APIResponse<Territory[]>",
    example: "/api/territories?region=West&includeHcpCount=true",
  },

  GET_TERRITORY_BY_ID: {
    method: "GET",
    path: "/api/territories/:id",
    description: "Fetch single territory with polygon data",
    response: "APIResponse<Territory>",
    example: "/api/territories/ca",
  },

  // Specialty Management
  GET_SPECIALTIES: {
    method: "GET",
    path: "/api/specialties",
    description: "Fetch all medical specialties",
    response: "APIResponse<Specialty[]>",
    example: "/api/specialties",
  },

  // Search and Analytics
  SEARCH_HCPS: {
    method: "GET",
    path: "/api/search/hcps",
    description: "Advanced HCP search with multiple filters",
    queryParams: "HCPSearchParams",
    response: "APIResponse<HCP[]>",
    example: "/api/search/hcps?search=johnson&city=new%20york&specialty=psychiatry",
  },

  GET_ANALYTICS: {
    method: "GET",
    path: "/api/analytics/dashboard",
    description: "Get dashboard analytics and statistics",
    response: "APIResponse<DashboardStats>",
    example: "/api/analytics/dashboard",
  },
} as const

// Sample Request/Response Examples
export const SAMPLE_REQUESTS = {
  // GET /api/hcps?page=1&limit=10&territory=California
  GET_HCPS_RESPONSE: {
    data: [
      {
        id: "29",
        name: "Dr. Robert Davis",
        npi: "6789012345",
        specialty: "Psychiatry",
        address: "987 Mental Health Plaza",
        city: "Los Angeles",
        state: "CA",
        zip: "90210",
        territory: "California",
        region: "West",
        lat: 34.0522,
        lng: -118.2437,
        therapeuticArea: "Mental Health",
        prescriptionVolume: 167,
        patientCount: 125,
        lastContact: "2024-01-08",
        phone: "(555) 678-9012",
        email: "r.davis@mentalhealthplaza.com",
        affiliations: ["LA Mental Health Plaza"],
        notes: "Anxiety and mood disorders specialist.",
      },
    ],
    success: true,
    pagination: {
      page: 1,
      limit: 10,
      total: 118,
      totalPages: 12,
    },
  },

  // GET /api/territories
  GET_TERRITORIES_RESPONSE: {
    data: [
      {
        id: "ca",
        name: "California",
        region: "West",
        color: "#BAE1FF",
        polygon: [
          [34.0089, -118.4965],
          [34.0902, -118.2437],
          [33.9425, -118.4081],
          [33.9806, -118.4563],
        ],
        hcpCount: 18,
      },
    ],
    success: true,
  },

  // POST /api/hcps
  CREATE_HCP_REQUEST: {
    name: "Dr. New Physician",
    npi: "9999999999",
    specialty: "Cardiology",
    address: "123 New Medical Center",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    territory: "California",
    region: "West",
    lat: 37.7749,
    lng: -122.4194,
    therapeuticArea: "Cardiovascular",
    phone: "(555) 999-9999",
    email: "new.physician@medical.com",
  },

  CREATE_HCP_RESPONSE: {
    data: {
      id: "119",
      name: "Dr. New Physician",
      npi: "9999999999",
      specialty: "Cardiology",
      address: "123 New Medical Center",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      territory: "California",
      region: "West",
      lat: 37.7749,
      lng: -122.4194,
      therapeuticArea: "Cardiovascular",
      phone: "(555) 999-9999",
      email: "new.physician@medical.com",
    },
    success: true,
    message: "HCP created successfully",
  },
}

export interface DashboardStats {
  totalHcps: number
  totalTerritories: number
  totalSpecialties: number
  totalRegions: number
  hcpsByTerritory: { territory: string; count: number; color: string }[]
  hcpsBySpecialty: { specialty: string; count: number }[]
  hcpsByRegion: { region: string; count: number }[]
  recentActivity: {
    type: "hcp_added" | "territory_changed" | "contact_updated"
    description: string
    timestamp: string
  }[]
}
