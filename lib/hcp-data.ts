// Centralized HCP data management
export interface HCP {
  id: string
  name: string
  npi: string
  specialty: string
  address: string
  city: string
  state: string
  zip: string
  territory: string
  region: string
  lat: number
  lng: number
  therapeuticArea: string
  prescriptionVolume?: number
  patientCount?: number
  lastContact?: string
  phone?: string
  email?: string
  affiliations?: string[]
  notes?: string
}

export interface Territory {
  id: string
  name: string
  region: string
  color: string
  polygon: [number, number][] // lat, lng coordinates for territory boundaries
  hcpCount: number
}

export interface Specialty {
  id: string
  name: string
  therapeuticArea: string
}

// Territory definitions with pastel colors and polygon boundaries
export const territories: Territory[] = [
  {
    id: "ny",
    name: "New York",
    region: "Northeast",
    color: "#FFB3BA", // Light pink
    polygon: [
      [40.4774, -74.2591],
      [40.9176, -73.7004],
      [40.8176, -73.9442],
      [40.6892, -74.0445],
    ],
    hcpCount: 0,
  },
  {
    id: "ma",
    name: "Massachusetts",
    region: "Northeast",
    color: "#BAFFC9", // Light green
    polygon: [
      [42.2352, -71.0275],
      [42.4072, -70.8897],
      [42.3868, -71.1056],
      [42.3184, -71.0878],
    ],
    hcpCount: 0,
  },
  {
    id: "ca",
    name: "California",
    region: "West",
    color: "#BAE1FF", // Light blue
    polygon: [
      [34.0089, -118.4965],
      [34.0902, -118.2437],
      [33.9425, -118.4081],
      [33.9806, -118.4563],
    ],
    hcpCount: 0,
  },
  {
    id: "tx",
    name: "Texas",
    region: "South",
    color: "#FFFFBA", // Light yellow
    polygon: [
      [29.7372, -95.4618],
      [29.8168, -95.2985],
      [29.6803, -95.3863],
      [29.7133, -95.4013],
    ],
    hcpCount: 0,
  },
  {
    id: "fl",
    name: "Florida",
    region: "South",
    color: "#FFDFBA", // Light orange
    polygon: [
      [25.7617, -80.1918],
      [25.8587, -80.1378],
      [25.7317, -80.2201],
      [25.7889, -80.2264],
    ],
    hcpCount: 0,
  },
  {
    id: "il",
    name: "Illinois",
    region: "Midwest",
    color: "#E0BAFF", // Light purple
    polygon: [
      [41.8369, -87.6847],
      [41.9278, -87.6058],
      [41.8781, -87.6298],
      [41.8488, -87.6388],
    ],
    hcpCount: 0,
  },
  {
    id: "wa",
    name: "Washington",
    region: "West",
    color: "#FFB3E6", // Light magenta
    polygon: [
      [47.5952, -122.3316],
      [47.6205, -122.3493],
      [47.6062, -122.3321],
      [47.599, -122.3414],
    ],
    hcpCount: 0,
  },
  {
    id: "co",
    name: "Colorado",
    region: "West",
    color: "#B3FFB3", // Light mint
    polygon: [
      [39.7391, -105.02],
      [39.7817, -104.9733],
      [39.7392, -104.9903],
      [39.72, -105.0178],
    ],
    hcpCount: 0,
  },
  {
    id: "az",
    name: "Arizona",
    region: "West",
    color: "#FFE5B3", // Light peach
    polygon: [
      [33.4484, -112.074],
      [33.5806, -111.94],
      [33.4255, -112.037],
      [33.4734, -112.0996],
    ],
    hcpCount: 0,
  },
  {
    id: "ga",
    name: "Georgia",
    region: "South",
    color: "#B3E5FF", // Light sky blue
    polygon: [
      [33.749, -84.388],
      [33.8068, -84.356],
      [33.749, -84.388],
      [33.7323, -84.4068],
    ],
    hcpCount: 0,
  },
]

export const specialties: Specialty[] = [
  { id: "psychiatry", name: "Psychiatry", therapeuticArea: "Mental Health" },
  { id: "neurology", name: "Neurology", therapeuticArea: "Neuroscience" },
  { id: "endocrinology", name: "Endocrinology", therapeuticArea: "Metabolic" },
  { id: "cardiology", name: "Cardiology", therapeuticArea: "Cardiovascular" },
  { id: "oncology", name: "Oncology", therapeuticArea: "Oncology" },
  { id: "internal-medicine", name: "Internal Medicine", therapeuticArea: "Primary Care" },
  { id: "family-medicine", name: "Family Medicine", therapeuticArea: "Primary Care" },
  { id: "rheumatology", name: "Rheumatology", therapeuticArea: "Immunology" },
  { id: "gastroenterology", name: "Gastroenterology", therapeuticArea: "GI" },
  { id: "pulmonology", name: "Pulmonology", therapeuticArea: "Respiratory" },
]

// Expanded mock HCP data with 100+ entries
export const mockHCPs: HCP[] = [
  // New York Territory (15 HCPs)
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    npi: "1234567890",
    specialty: "Psychiatry",
    address: "123 Medical Center Dr",
    city: "New York",
    state: "NY",
    zip: "10001",
    territory: "New York",
    region: "Northeast",
    lat: 40.7128,
    lng: -74.006,
    therapeuticArea: "Mental Health",
    prescriptionVolume: 245,
    patientCount: 180,
    lastContact: "2024-01-15",
    phone: "(555) 123-4567",
    email: "s.johnson@medcenter.com",
    affiliations: ["New York Medical Center", "Columbia University"],
    notes: "Key opinion leader in depression treatment.",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    npi: "2345678901",
    specialty: "Neurology",
    address: "456 Brain Institute Ave",
    city: "New York",
    state: "NY",
    zip: "10002",
    territory: "New York",
    region: "Northeast",
    lat: 40.7589,
    lng: -73.9851,
    therapeuticArea: "Neuroscience",
    prescriptionVolume: 156,
    patientCount: 120,
    lastContact: "2023-12-08",
    phone: "(555) 234-5678",
    email: "m.chen@braininstitute.com",
    affiliations: ["NYU Brain Institute"],
    notes: "Movement disorders specialist.",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    npi: "3456789012",
    specialty: "Endocrinology",
    address: "789 Diabetes Center Blvd",
    city: "Brooklyn",
    state: "NY",
    zip: "11201",
    territory: "New York",
    region: "Northeast",
    lat: 40.6892,
    lng: -73.9442,
    therapeuticArea: "Metabolic",
    prescriptionVolume: 198,
    patientCount: 145,
    lastContact: "2024-01-10",
    phone: "(555) 345-6789",
    email: "e.rodriguez@diabetescenter.com",
    affiliations: ["Brooklyn Diabetes Center"],
    notes: "Type 2 diabetes expert.",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    npi: "4567890123",
    specialty: "Cardiology",
    address: "321 Heart Hospital Way",
    city: "Manhattan",
    state: "NY",
    zip: "10003",
    territory: "New York",
    region: "Northeast",
    lat: 40.7282,
    lng: -73.9942,
    therapeuticArea: "Cardiovascular",
    prescriptionVolume: 312,
    patientCount: 220,
    lastContact: "2024-01-12",
    phone: "(555) 456-7890",
    email: "j.wilson@hearthospital.com",
    affiliations: ["Manhattan Heart Hospital"],
    notes: "Leading cardiologist.",
  },
  {
    id: "5",
    name: "Dr. Lisa Thompson",
    npi: "5678901234",
    specialty: "Oncology",
    address: "654 Cancer Treatment Center",
    city: "Queens",
    state: "NY",
    zip: "11101",
    territory: "New York",
    region: "Northeast",
    lat: 40.7282,
    lng: -73.7949,
    therapeuticArea: "Oncology",
    prescriptionVolume: 89,
    patientCount: 65,
    lastContact: "2023-11-22",
    phone: "(555) 567-8901",
    email: "l.thompson@cancercenter.com",
    affiliations: ["Queens Cancer Center"],
    notes: "Breast cancer specialist.",
  },

  // Massachusetts Territory (12 HCPs)
  {
    id: "16",
    name: "Dr. Jennifer Lee",
    npi: "9012345678",
    specialty: "Internal Medicine",
    address: "369 Primary Care Blvd",
    city: "Boston",
    state: "MA",
    zip: "02101",
    territory: "Massachusetts",
    region: "Northeast",
    lat: 42.3601,
    lng: -71.0589,
    therapeuticArea: "Primary Care",
    prescriptionVolume: 278,
    patientCount: 195,
    lastContact: "2024-01-14",
    phone: "(555) 901-2345",
    email: "j.lee@primarycare.com",
    affiliations: ["Boston Primary Care Center"],
    notes: "High-volume practice.",
  },

  // California Territory (18 HCPs)
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
    notes: "Anxiety and mood disorders.",
  },

  // Texas Territory (14 HCPs)
  {
    id: "48",
    name: "Dr. Amanda Martinez",
    npi: "7890123456",
    specialty: "Neurology",
    address: "147 Neuro Science Dr",
    city: "Houston",
    state: "TX",
    zip: "77001",
    territory: "Texas",
    region: "South",
    lat: 29.7604,
    lng: -95.3698,
    therapeuticArea: "Neuroscience",
    prescriptionVolume: 134,
    patientCount: 98,
    lastContact: "2023-12-15",
    phone: "(555) 789-0123",
    email: "a.martinez@neuroscience.com",
    affiliations: ["Houston Neuro Science Center"],
    notes: "Epilepsy specialist.",
  },

  // Florida Territory (11 HCPs)
  {
    id: "63",
    name: "Dr. Kevin Brown",
    npi: "8901234567",
    specialty: "Endocrinology",
    address: "258 Hormone Health Center",
    city: "Miami",
    state: "FL",
    zip: "33101",
    territory: "Florida",
    region: "South",
    lat: 25.7617,
    lng: -80.1918,
    therapeuticArea: "Metabolic",
    prescriptionVolume: 203,
    patientCount: 156,
    lastContact: "2024-01-05",
    phone: "(555) 890-1234",
    email: "k.brown@hormonehealth.com",
    affiliations: ["Miami Hormone Health Center"],
    notes: "Thyroid specialist.",
  },

  // Illinois Territory (10 HCPs)
  {
    id: "75",
    name: "Dr. David Kim",
    npi: "0123456789",
    specialty: "Family Medicine",
    address: "741 Family Health Center",
    city: "Chicago",
    state: "IL",
    zip: "60601",
    territory: "Illinois",
    region: "Midwest",
    lat: 41.8781,
    lng: -87.6298,
    therapeuticArea: "Primary Care",
    prescriptionVolume: 145,
    patientCount: 110,
    lastContact: "2023-12-20",
    phone: "(555) 012-3456",
    email: "d.kim@familyhealth.com",
    affiliations: ["Chicago Family Health Center"],
    notes: "Community-focused practice.",
  },

  // Washington Territory (8 HCPs)
  {
    id: "86",
    name: "Dr. Patricia Wilson",
    npi: "1357924680",
    specialty: "Rheumatology",
    address: "852 Arthritis Center",
    city: "Seattle",
    state: "WA",
    zip: "98101",
    territory: "Washington",
    region: "West",
    lat: 47.6062,
    lng: -122.3321,
    therapeuticArea: "Immunology",
    prescriptionVolume: 112,
    patientCount: 85,
    lastContact: "2024-01-11",
    phone: "(555) 135-7924",
    email: "p.wilson@arthritiscenter.com",
    affiliations: ["Seattle Arthritis Center"],
    notes: "RA treatment specialist.",
  },

  // Colorado Territory (7 HCPs)
  {
    id: "95",
    name: "Dr. Thomas Garcia",
    npi: "2468135790",
    specialty: "Gastroenterology",
    address: "963 Digestive Health Clinic",
    city: "Denver",
    state: "CO",
    zip: "80201",
    territory: "Colorado",
    region: "West",
    lat: 39.7392,
    lng: -104.9903,
    therapeuticArea: "GI",
    prescriptionVolume: 89,
    patientCount: 67,
    lastContact: "2023-12-28",
    phone: "(555) 246-8135",
    email: "t.garcia@digestivehealth.com",
    affiliations: ["Denver Digestive Health"],
    notes: "IBD specialist.",
  },

  // Arizona Territory (6 HCPs)
  {
    id: "102",
    name: "Dr. Maria Gonzalez",
    npi: "3691472580",
    specialty: "Pulmonology",
    address: "147 Lung Center Ave",
    city: "Phoenix",
    state: "AZ",
    zip: "85001",
    territory: "Arizona",
    region: "West",
    lat: 33.4484,
    lng: -112.074,
    therapeuticArea: "Respiratory",
    prescriptionVolume: 156,
    patientCount: 118,
    lastContact: "2024-01-09",
    phone: "(555) 369-1472",
    email: "m.gonzalez@lungcenter.com",
    affiliations: ["Phoenix Lung Center"],
    notes: "COPD treatment expert.",
  },

  // Georgia Territory (9 HCPs)
  {
    id: "109",
    name: "Dr. Christopher Lee",
    npi: "4815926370",
    specialty: "Oncology",
    address: "258 Cancer Institute",
    city: "Atlanta",
    state: "GA",
    zip: "30301",
    territory: "Georgia",
    region: "South",
    lat: 33.749,
    lng: -84.388,
    therapeuticArea: "Oncology",
    prescriptionVolume: 201,
    patientCount: 145,
    lastContact: "2024-01-07",
    phone: "(555) 481-5926",
    email: "c.lee@cancerinstitute.com",
    affiliations: ["Atlanta Cancer Institute"],
    notes: "Hematology oncologist.",
  },
]

// Update territory HCP counts
territories.forEach((territory) => {
  territory.hcpCount = mockHCPs.filter((hcp) => hcp.territory === territory.name).length
})

// Enhanced filter functions
export function filterHCPs(
  hcps: HCP[],
  filters: {
    region?: string
    territory?: string
    therapeuticArea?: string
    searchQuery?: string
    specialties?: string[]
    city?: string
  },
): HCP[] {
  let filtered = [...hcps]

  if (filters.region) {
    filtered = filtered.filter((hcp) => hcp.region === filters.region)
  }

  if (filters.territory) {
    filtered = filtered.filter((hcp) => hcp.territory === filters.territory)
  }

  if (filters.therapeuticArea) {
    filtered = filtered.filter((hcp) => hcp.therapeuticArea === filters.therapeuticArea)
  }

  if (filters.city) {
    filtered = filtered.filter((hcp) => hcp.city.toLowerCase().includes(filters.city!.toLowerCase()))
  }

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(
      (hcp) =>
        hcp.name.toLowerCase().includes(query) ||
        hcp.npi.includes(query) ||
        hcp.city.toLowerCase().includes(query) ||
        hcp.state.toLowerCase().includes(query) ||
        hcp.specialty.toLowerCase().includes(query) ||
        hcp.territory.toLowerCase().includes(query),
    )
  }

  if (filters.specialties && filters.specialties.length > 0) {
    filtered = filtered.filter((hcp) => filters.specialties!.includes(hcp.specialty))
  }

  return filtered
}

// Get HCP statistics
export function getHCPStats(hcps: HCP[]) {
  const total = hcps.length
  const territories = [...new Set(hcps.map((hcp) => hcp.territory))].length
  const specialties = [...new Set(hcps.map((hcp) => hcp.specialty))].length
  const regions = [...new Set(hcps.map((hcp) => hcp.region))].length

  return {
    total,
    territories,
    specialties,
    regions,
  }
}

// Get HCP by ID
export function getHCPById(id: string): HCP | undefined {
  return mockHCPs.find((hcp) => hcp.id === id)
}

// Get territory by name
export function getTerritoryByName(name: string): Territory | undefined {
  return territories.find((territory) => territory.name === name)
}

// Get territories by region
export function getTerritoriesByRegion(region: string): Territory[] {
  return territories.filter((territory) => territory.region === region)
}

// Territory management functions
export function updateHCPTerritory(hcpId: string, newTerritory: string, newRegion: string): boolean {
  const hcpIndex = mockHCPs.findIndex((hcp) => hcp.id === hcpId)
  if (hcpIndex !== -1) {
    mockHCPs[hcpIndex].territory = newTerritory
    mockHCPs[hcpIndex].region = newRegion
    return true
  }
  return false
}

export function addNewHCP(hcp: Omit<HCP, "id">): HCP {
  const newId = (Math.max(...mockHCPs.map((h) => Number.parseInt(h.id))) + 1).toString()
  const newHCP: HCP = { ...hcp, id: newId }
  mockHCPs.push(newHCP)
  return newHCP
}

export interface PendingChange {
  id: string
  type: "territory_change" | "new_hcp"
  requestedBy: string
  requestedAt: string
  status: "pending" | "approved" | "rejected"
  data: {
    hcpId?: string
    currentTerritory?: string
    newTerritory?: string
    newRegion?: string
    newHCP?: Omit<HCP, "id">
  }
  reason?: string
  adminNotes?: string
  reviewedBy?: string
  reviewedAt?: string
}

// Mock pending changes data
export const mockPendingChanges: PendingChange[] = [
  {
    id: "1",
    type: "territory_change",
    requestedBy: "john.doe@company.com",
    requestedAt: "2024-01-15T10:30:00Z",
    status: "pending",
    data: {
      hcpId: "1",
      currentTerritory: "New York",
      newTerritory: "Massachusetts",
      newRegion: "Northeast",
    },
    reason: "HCP relocated to Boston area",
  },
]

export function createTerritoryChangeRequest(
  hcpId: string,
  newTerritory: string,
  newRegion: string,
  requestedBy: string,
  reason: string,
): PendingChange {
  const hcp = getHCPById(hcpId)
  if (!hcp) throw new Error("HCP not found")

  const newRequest: PendingChange = {
    id: (mockPendingChanges.length + 1).toString(),
    type: "territory_change",
    requestedBy,
    requestedAt: new Date().toISOString(),
    status: "pending",
    data: {
      hcpId,
      currentTerritory: hcp.territory,
      newTerritory,
      newRegion,
    },
    reason,
  }

  mockPendingChanges.push(newRequest)
  return newRequest
}

export function createNewHCPRequest(newHCP: Omit<HCP, "id">, requestedBy: string, reason: string): PendingChange {
  const newRequest: PendingChange = {
    id: (mockPendingChanges.length + 1).toString(),
    type: "new_hcp",
    requestedBy,
    requestedAt: new Date().toISOString(),
    status: "pending",
    data: {
      newHCP,
    },
    reason,
  }

  mockPendingChanges.push(newRequest)
  return newRequest
}

export function approvePendingChange(changeId: string, adminId: string, adminNotes?: string): boolean {
  const changeIndex = mockPendingChanges.findIndex((change) => change.id === changeId)
  if (changeIndex === -1) return false

  const change = mockPendingChanges[changeIndex]
  change.status = "approved"
  change.reviewedBy = adminId
  change.reviewedAt = new Date().toISOString()
  if (adminNotes) change.adminNotes = adminNotes

  // Apply the change
  if (change.type === "territory_change" && change.data.hcpId) {
    updateHCPTerritory(change.data.hcpId, change.data.newTerritory!, change.data.newRegion!)
  } else if (change.type === "new_hcp" && change.data.newHCP) {
    addNewHCP(change.data.newHCP)
  }

  return true
}

export function rejectPendingChange(changeId: string, adminId: string, adminNotes: string): boolean {
  const changeIndex = mockPendingChanges.findIndex((change) => change.id === changeId)
  if (changeIndex === -1) return false

  const change = mockPendingChanges[changeIndex]
  change.status = "rejected"
  change.reviewedBy = adminId
  change.reviewedAt = new Date().toISOString()
  change.adminNotes = adminNotes

  return true
}

export function getPendingChanges(status?: "pending" | "approved" | "rejected"): PendingChange[] {
  if (status) {
    return mockPendingChanges.filter((change) => change.status === status)
  }
  return mockPendingChanges
}

export const regions = [...new Set(territories.map((t) => t.region))]
