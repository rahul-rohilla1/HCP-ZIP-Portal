"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MapPin, Users, Building2, Menu, LogOut, User, Settings } from "lucide-react"
import { USMap } from "@/components/us-map"
import { HCPTable } from "@/components/hcp-table"
import { FilterSidebar } from "@/components/filter-sidebar"
import { AdminApprovalPanel } from "@/components/admin-approval-panel"
import { useAuth } from "@/components/auth-provider"
import { mockHCPs, filterHCPs, getHCPStats } from "@/lib/hcp-data"

export function AlignmentPortal() {
  const { user, logout, isLoading } = useAuth()
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [selectedTerritory, setSelectedTerritory] = useState<string>("")
  const [selectedTherapeuticArea, setSelectedTherapeuticArea] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const filteredHCPs = useMemo(() => {
    return filterHCPs(mockHCPs, {
      region: selectedRegion,
      territory: selectedTerritory,
      therapeuticArea: selectedTherapeuticArea,
      searchQuery,
      specialties: selectedSpecialties,
      city: selectedCity,
    })
  }, [selectedRegion, selectedTerritory, selectedTherapeuticArea, searchQuery, selectedSpecialties, selectedCity])

  const stats = useMemo(() => getHCPStats(filteredHCPs), [filteredHCPs])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if no user (will be redirected by AuthProvider)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">HCP Territory Management</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{stats.total} HCPs</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-sm text-left">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-muted-foreground">{user.role}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-red-600">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <FilterSidebar
          isOpen={sidebarOpen}
          selectedRegion={selectedRegion}
          selectedTerritory={selectedTerritory}
          selectedTherapeuticArea={selectedTherapeuticArea}
          searchQuery={searchQuery}
          selectedSpecialties={selectedSpecialties}
          selectedCity={selectedCity}
          onRegionChange={setSelectedRegion}
          onTerritoryChange={setSelectedTerritory}
          onTherapeuticAreaChange={setSelectedTherapeuticArea}
          onSearchChange={setSearchQuery}
          onSpecialtiesChange={setSelectedSpecialties}
          onCityChange={setSelectedCity}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-80" : ""}`}>
          <div className="p-6 space-y-6">
            {/* Stats Cards - Updated with territory-focused data */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total HCPs</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.territories}</div>
                    <div className="text-sm text-muted-foreground">Territories</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.specialties}</div>
                    <div className="text-sm text-muted-foreground">Specialties</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.regions}</div>
                    <div className="text-sm text-muted-foreground">Regions</div>
                  </div>
                </div>
              </Card>
            </div>

            {user.role === "Admin" && <AdminApprovalPanel />}

            {/* Map Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Geographic Distribution</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    <MapPin className="h-3 w-3 mr-1" />
                    HCPs ({stats.total})
                  </Badge>
                </div>
              </div>
              <USMap
                hcps={filteredHCPs}
                selectedRegion={selectedRegion}
                selectedTerritory={selectedTerritory}
                onHCPClick={(hcpId) => {
                  // Navigate to HCP detail page
                  window.location.href = `/hcp/${hcpId}`
                }}
              />
            </Card>

            {/* HCP Table */}
            <HCPTable hcps={filteredHCPs} />
          </div>
        </main>
      </div>
    </div>
  )
}
