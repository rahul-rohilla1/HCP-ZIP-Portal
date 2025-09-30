"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Plus } from "lucide-react"
import { territories, createTerritoryChangeRequest, createNewHCPRequest, type HCP } from "@/lib/hcp-data"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"

interface TerritoryChangeDialogProps {
  hcp?: HCP
  mode: "change" | "add"
  trigger?: React.ReactNode
}

export function TerritoryChangeDialog({ hcp, mode, trigger }: TerritoryChangeDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [selectedTerritory, setSelectedTerritory] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state for new HCP
  const [newHCPData, setNewHCPData] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    try {
      if (mode === "change" && hcp) {
        const territory = territories.find((t) => t.name === selectedTerritory)
        if (!territory) throw new Error("Invalid territory selected")

        createTerritoryChangeRequest(hcp.id, selectedTerritory, territory.region, user.email, reason)

        toast({
          title: "Territory Change Requested",
          description: "Your request has been submitted for admin approval.",
        })
      } else if (mode === "add") {
        const territory = territories.find((t) => t.name === selectedTerritory)
        if (!territory) throw new Error("Invalid territory selected")

        const newHCP = {
          ...newHCPData,
          territory: selectedTerritory,
          region: territory.region,
        }

        createNewHCPRequest(newHCP, user.email, reason)

        toast({
          title: "New HCP Request Submitted",
          description: "Your request has been submitted for admin approval.",
        })
      }

      setOpen(false)
      setSelectedTerritory("")
      setReason("")
      setNewHCPData({
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultTrigger =
    mode === "change" ? (
      <Button variant="outline" size="sm">
        <MapPin className="h-4 w-4 mr-2" />
        Change Territory
      </Button>
    ) : (
      <Button variant="outline" size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add New HCP
      </Button>
    )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "change" ? `Change Territory for ${hcp?.name}` : "Add New HCP"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "add" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newHCPData.name}
                    onChange={(e) => setNewHCPData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="npi">NPI</Label>
                  <Input
                    id="npi"
                    value={newHCPData.npi}
                    onChange={(e) => setNewHCPData((prev) => ({ ...prev, npi: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select onValueChange={(value) => setNewHCPData((prev) => ({ ...prev, specialty: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Oncology">Oncology</SelectItem>
                      <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                      <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="therapeuticArea">Therapeutic Area</Label>
                  <Select onValueChange={(value) => setNewHCPData((prev) => ({ ...prev, therapeuticArea: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Oncology">Oncology</SelectItem>
                      <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                      <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newHCPData.address}
                  onChange={(e) => setNewHCPData((prev) => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newHCPData.city}
                    onChange={(e) => setNewHCPData((prev) => ({ ...prev, city: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={newHCPData.state}
                    onChange={(e) => setNewHCPData((prev) => ({ ...prev, state: e.target.value }))}
                    maxLength={2}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP</Label>
                  <Input
                    id="zip"
                    value={newHCPData.zip}
                    onChange={(e) => setNewHCPData((prev) => ({ ...prev, zip: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newHCPData.phone}
                    onChange={(e) => setNewHCPData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newHCPData.email}
                    onChange={(e) => setNewHCPData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="territory">{mode === "change" ? "New Territory" : "Territory"}</Label>
            <Select value={selectedTerritory} onValueChange={setSelectedTerritory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select territory" />
              </SelectTrigger>
              <SelectContent>
                {territories.map((territory) => (
                  <SelectItem key={territory.name} value={territory.name}>
                    {territory.name} ({territory.region})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reason">Reason for Request</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for this request..."
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
