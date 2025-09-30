"use client"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { X, Filter, Search, MapPin, Building2, Stethoscope } from "lucide-react"
import { territories, specialties } from "@/lib/hcp-data"

interface FilterSidebarProps {
  isOpen: boolean
  selectedRegion: string
  selectedTerritory: string
  selectedTherapeuticArea: string
  searchQuery: string
  selectedSpecialties: string[]
  selectedCity: string
  onRegionChange: (value: string) => void
  onTerritoryChange: (value: string) => void
  onTherapeuticAreaChange: (value: string) => void
  onSearchChange: (value: string) => void
  onSpecialtiesChange: (specialties: string[]) => void
  onCityChange: (value: string) => void
}

export function FilterSidebar({
  isOpen,
  selectedRegion,
  selectedTerritory,
  selectedTherapeuticArea,
  searchQuery,
  selectedSpecialties,
  selectedCity,
  onRegionChange,
  onTerritoryChange,
  onTherapeuticAreaChange,
  onSearchChange,
  onSpecialtiesChange,
  onCityChange,
}: FilterSidebarProps) {
  const therapeuticAreas = [...new Set(specialties.map((s) => s.therapeuticArea))]
  const regions = [...new Set(territories.map((t) => t.region))]
  const territoryNames = territories.map((t) => t.name)
  const specialtyNames = specialties.map((s) => s.name)

  const clearFilters = () => {
    onRegionChange("")
    onTerritoryChange("")
    onTherapeuticAreaChange("")
    onSearchChange("")
    onSpecialtiesChange([])
    onCityChange("")
  }

  const activeFiltersCount = [
    selectedRegion,
    selectedTerritory,
    selectedTherapeuticArea,
    searchQuery,
    selectedCity,
    ...selectedSpecialties,
  ].filter(Boolean).length

  const handleSpecialtyChange = (value: string, checked: boolean) => {
    if (checked) {
      onSpecialtiesChange([...selectedSpecialties, value])
    } else {
      onSpecialtiesChange(selectedSpecialties.filter((item) => item !== value))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-80 bg-sidebar border-r border-sidebar-border lg:relative lg:z-auto">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-sidebar-foreground" />
            <h2 className="font-semibold text-sidebar-foreground">Territory Filters</h2>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Search */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-sidebar-foreground flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search HCPs
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, NPI, city, or territory..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-sidebar-primary"
              />
            </div>
          </div>

          <Separator />

          {/* Geography Hierarchy */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-sidebar-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Territory Management
            </Label>

            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Region</Label>
                <Select value={selectedRegion} onValueChange={onRegionChange}>
                  <SelectTrigger className="bg-sidebar-primary">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Territory</Label>
                <Select value={selectedTerritory} onValueChange={onTerritoryChange}>
                  <SelectTrigger className="bg-sidebar-primary">
                    <SelectValue placeholder="Select territory" />
                  </SelectTrigger>
                  <SelectContent>
                    {territoryNames
                      .filter(
                        (territory) =>
                          !selectedRegion || territories.find((t) => t.name === territory)?.region === selectedRegion,
                      )
                      .map((territory) => (
                        <SelectItem key={territory} value={territory}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full border border-white"
                              style={{ backgroundColor: territories.find((t) => t.name === territory)?.color }}
                            />
                            {territory}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter by city..."
                    value={selectedCity}
                    onChange={(e) => onCityChange(e.target.value)}
                    className="pl-10 bg-sidebar-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Therapeutic Areas */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-sidebar-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Therapeutic Area
            </Label>
            <Select value={selectedTherapeuticArea} onValueChange={onTherapeuticAreaChange}>
              <SelectTrigger className="bg-sidebar-primary">
                <SelectValue placeholder="Select therapeutic area" />
              </SelectTrigger>
              <SelectContent>
                {therapeuticAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Specialty Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-sidebar-foreground flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Medical Specialties
            </Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {specialtyNames.map((specialty) => (
                <div key={specialty} className="flex items-center space-x-2">
                  <Checkbox
                    id={specialty}
                    checked={selectedSpecialties.includes(specialty)}
                    onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
                  />
                  <Label htmlFor={specialty} className="text-sm text-sidebar-foreground cursor-pointer">
                    {specialty}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-sidebar-foreground">Active Filters</Label>
              <div className="space-y-2">
                {searchQuery && (
                  <div className="flex items-center justify-between p-2 bg-sidebar-accent/10 rounded-md">
                    <span className="text-xs text-sidebar-foreground">Search: {searchQuery}</span>
                    <Button variant="ghost" size="sm" onClick={() => onSearchChange("")} className="h-4 w-4 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {selectedTherapeuticArea && (
                  <div className="flex items-center justify-between p-2 bg-sidebar-accent/10 rounded-md">
                    <span className="text-xs text-sidebar-foreground">{selectedTherapeuticArea}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTherapeuticAreaChange("")}
                      className="h-4 w-4 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {selectedRegion && (
                  <div className="flex items-center justify-between p-2 bg-sidebar-accent/10 rounded-md">
                    <span className="text-xs text-sidebar-foreground">{selectedRegion} Region</span>
                    <Button variant="ghost" size="sm" onClick={() => onRegionChange("")} className="h-4 w-4 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {selectedTerritory && (
                  <div className="flex items-center justify-between p-2 bg-sidebar-accent/10 rounded-md">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border border-white"
                        style={{ backgroundColor: territories.find((t) => t.name === selectedTerritory)?.color }}
                      />
                      <span className="text-xs text-sidebar-foreground">{selectedTerritory}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onTerritoryChange("")} className="h-4 w-4 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {selectedCity && (
                  <div className="flex items-center justify-between p-2 bg-sidebar-accent/10 rounded-md">
                    <span className="text-xs text-sidebar-foreground">City: {selectedCity}</span>
                    <Button variant="ghost" size="sm" onClick={() => onCityChange("")} className="h-4 w-4 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {selectedSpecialties.map((filter) => (
                  <div key={filter} className="flex items-center justify-between p-2 bg-sidebar-accent/10 rounded-md">
                    <span className="text-xs text-sidebar-foreground">{filter}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSpecialtyChange(filter, false)}
                      className="h-4 w-4 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter Summary */}
          <div className="mt-6 p-3 bg-primary/5 border border-primary/20 rounded-md">
            <div className="text-xs text-primary font-medium mb-1">Territory Overview</div>
            <div className="text-xs text-muted-foreground">
              {activeFiltersCount === 0
                ? "Showing all HCPs across all territories"
                : `${activeFiltersCount} filter${activeFiltersCount > 1 ? "s" : ""} applied`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
