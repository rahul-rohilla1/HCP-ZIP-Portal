"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, MapPin } from "lucide-react"
import { updateHCPTerritory, addNewHCP, territories, regions, type HCP } from "@/lib/hcp-data"

interface TerritoryManagementProps {
  hcp?: HCP
  onUpdate: () => void
}

export function TerritoryManagement({ hcp, onUpdate }: TerritoryManagementProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTerritory, setSelectedTerritory] = useState(hcp?.territory || "")
  const [selectedRegion, setSelectedRegion] = useState(hcp?.region || "")

  // Form state for new HCP
  const [formData, setFormData] = useState({
    name: "",
    npi: "",
    specialty: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    therapeuticArea: "",
    phone: "",
    email: "",
    lat: 0,
    lng: 0,
  })

  const handleTerritoryChange = () => {
    if (hcp && selectedTerritory && selectedRegion) {
      updateHCPTerritory(hcp.id, selectedTerritory, selectedRegion)
      onUpdate()
      setIsOpen(false)
    }
  }

  const handleAddNewHCP = () => {
    if (formData.name && formData.npi && selectedTerritory && selectedRegion) {
      addNewHCP({
        ...formData,
        territory: selectedTerritory,
        region: selectedRegion,
      })
      onUpdate()
      setIsOpen(false)
      // Reset form
      setFormData({
        name: "",
        npi: "",
        specialty: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        therapeuticArea: "",
        phone: "",
        email: "",
        lat: 0,
        lng: 0,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={hcp ? "outline" : "default"} size="sm">
          {hcp ? (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Change Territory
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add New HCP
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-600" />
            {hcp ? `Change Territory for ${hcp.name}` : "Add New HCP"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!hcp && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="npi">NPI Number</Label>
                  <Input
                    id="npi"
                    value={formData.npi}
                    onChange={(e) => setFormData({ ...formData, npi: e.target.value })}
                    placeholder="1234567890"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="Cardiology"
                  />
                </div>
                <div>
                  <Label htmlFor="therapeuticArea">Therapeutic Area</Label>
                  <Input
                    id="therapeuticArea"
                    value={formData.therapeuticArea}
                    onChange={(e) => setFormData({ ...formData, therapeuticArea: e.target.value })}
                    placeholder="Cardiology"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Medical Center Dr"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="NY"
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    placeholder="10001"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="region">Region</Label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
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
            <Label htmlFor="territory">Territory</Label>
            <Select value={selectedTerritory} onValueChange={setSelectedTerritory}>
              <SelectTrigger>
                <SelectValue placeholder="Select territory" />
              </SelectTrigger>
              <SelectContent>
                {territories
                  .filter((territory) => !selectedRegion || territory.region === selectedRegion)
                  .map((territory) => (
                    <SelectItem key={territory.name} value={territory.name}>
                      {territory.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={hcp ? handleTerritoryChange : handleAddNewHCP}>
              {hcp ? "Update Territory" : "Add HCP"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
