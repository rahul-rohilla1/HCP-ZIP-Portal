"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import type { HCP } from "@/lib/hcp-data"
import { territories, getTerritoryByName } from "@/lib/hcp-data"

interface USMapProps {
  hcps: HCP[]
  selectedRegion: string
  selectedTerritory: string
  onHCPClick: (hcpId: string) => void
}

export function USMap({ hcps, selectedRegion, selectedTerritory, onHCPClick }: USMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [selectedHCP, setSelectedHCP] = useState<HCP | null>(null)
  const [hoveredHCP, setHoveredHCP] = useState<HCP | null>(null)
  const territoryLayersRef = useRef<any[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = (await import("leaflet")).default

      // Fix for default markers in Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      if (mapRef.current && !map) {
        const newMap = L.map(mapRef.current).setView([39.8283, -98.5795], 4) // Center of US

        // Add OpenStreetMap tiles (free)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(newMap)

        setMap(newMap)
      }
    }

    initMap()

    // Cleanup
    return () => {
      if (map) {
        map.remove()
        setMap(null)
      }
    }
  }, [])

  useEffect(() => {
    if (!map || typeof window === "undefined") return

    const updateTerritoryLayers = async () => {
      const L = (await import("leaflet")).default

      // Clear existing territory layers
      territoryLayersRef.current.forEach((layer) => {
        map.removeLayer(layer)
      })
      territoryLayersRef.current = []

      // Get territories to highlight based on filters
      const territoriesToHighlight = territories.filter((territory) => {
        if (selectedTerritory) {
          return territory.name === selectedTerritory
        }
        if (selectedRegion) {
          return territory.region === selectedRegion
        }
        return false
      })

      // Add territory polygon overlays
      territoriesToHighlight.forEach((territory) => {
        const polygon = L.polygon(territory.polygon, {
          color: territory.color,
          fillColor: territory.color,
          fillOpacity: 0.3,
          weight: 3,
          opacity: 0.8,
          className: "territory-overlay",
        }).addTo(map)

        // Add pulsing effect for selected territories
        const pulseCircle = L.circle(
          [
            territory.polygon.reduce((sum, coord) => sum + coord[0], 0) / territory.polygon.length,
            territory.polygon.reduce((sum, coord) => sum + coord[1], 0) / territory.polygon.length,
          ],
          {
            radius: 50000,
            color: territory.color,
            fillColor: territory.color,
            fillOpacity: 0.1,
            weight: 2,
            opacity: 0.6,
            className: "territory-pulse",
          },
        ).addTo(map)

        territoryLayersRef.current.push(polygon, pulseCircle)
      })
    }

    updateTerritoryLayers()
  }, [map, selectedRegion, selectedTerritory])

  useEffect(() => {
    if (!map || typeof window === "undefined") return

    const addHCPMarkers = async () => {
      const L = (await import("leaflet")).default

      // Clear existing HCP markers only
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer)
        }
      })

      hcps.forEach((hcp) => {
        const territory = getTerritoryByName(hcp.territory)
        const territoryColor = territory?.color || "#6B7280"

        const isHighlighted =
          (selectedRegion && hcp.region === selectedRegion) ||
          (selectedTerritory && hcp.territory === selectedTerritory)

        // Create modern, fluid bubble with territory color
        const iconHtml = `
          <div class="relative transform transition-all duration-500 hover:scale-125 hover:z-50">
            <div class="w-10 h-10 rounded-full border-3 border-white shadow-xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
              isHighlighted
                ? "ring-4 ring-white ring-opacity-80 animate-pulse scale-110"
                : "hover:ring-2 hover:ring-white hover:ring-opacity-60"
            }" 
            style="background: linear-gradient(135deg, ${territoryColor}CC, ${territoryColor}99); box-shadow: 0 8px 32px ${territoryColor}40;">
              <svg class="w-5 h-5 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
              </svg>
            </div>
            ${
              isHighlighted
                ? `
              <div class="absolute inset-0 rounded-full animate-ping" style="background: ${territoryColor}40;"></div>
              <div class="absolute -inset-2 rounded-full animate-pulse" style="background: radial-gradient(circle, ${territoryColor}20, transparent);"></div>
            `
                : ""
            }
          </div>
        `

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-hcp-marker",
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        })

        const marker = L.marker([hcp.lat, hcp.lng], { icon: customIcon }).addTo(map)

        // Add click event
        marker.on("click", () => {
          setSelectedHCP(hcp)
          onHCPClick(hcp.id)
        })

        // Add hover events
        marker.on("mouseover", () => {
          setHoveredHCP(hcp)
        })

        marker.on("mouseout", () => {
          setHoveredHCP(null)
        })
      })
    }

    addHCPMarkers()
  }, [map, hcps, onHCPClick, selectedRegion, selectedTerritory])

  const activeTerritories = territories.filter((territory) => hcps.some((hcp) => hcp.territory === territory.name))

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg border border-border relative z-0"
        style={{ minHeight: "500px" }}
      />

      {/* Enhanced Legend with Territory Colors */}
      <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl z-10 max-w-xs">
        <h3 className="text-sm font-semibold mb-3 text-foreground">Territory Legend</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {activeTerritories.map((territory) => (
            <div key={territory.id} className="flex items-center gap-2 text-xs">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: territory.color }}
              ></div>
              <span className="text-foreground font-medium">{territory.name}</span>
              <span className="text-muted-foreground">({territory.hcpCount})</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm bg-gradient-to-br from-gray-400 to-gray-600 ring-2 ring-white ring-opacity-60"></div>
            <span className="text-muted-foreground">Selected/Filtered</span>
          </div>
        </div>
      </div>

      {/* Enhanced Hover Tooltip */}
      {hoveredHCP && (
        <div className="absolute top-4 left-4 bg-popover/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl z-10 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center"
                style={{ backgroundColor: getTerritoryByName(hoveredHCP.territory)?.color || "#6B7280" }}
              >
                <MapPin className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm text-foreground">{hoveredHCP.name}</h4>
              <p className="text-xs text-muted-foreground">{hoveredHCP.specialty}</p>
              <p className="text-xs text-muted-foreground">{hoveredHCP.address}</p>
              <p className="text-xs text-muted-foreground">
                {hoveredHCP.city}, {hoveredHCP.state} {hoveredHCP.zip}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="default"
                  className="text-xs border-0"
                  style={{
                    backgroundColor: getTerritoryByName(hoveredHCP.territory)?.color + "20",
                    color: getTerritoryByName(hoveredHCP.territory)?.color || "#6B7280",
                  }}
                >
                  {hoveredHCP.territory}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {hoveredHCP.region}
                </Badge>
              </div>
              {hoveredHCP.prescriptionVolume && (
                <p className="text-xs text-muted-foreground mt-1">
                  Rx Volume: {hoveredHCP.prescriptionVolume} | Patients: {hoveredHCP.patientCount}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Statistics Bar */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
        <div className="flex items-center gap-4">
          <span className="font-medium">Showing {hcps.length} HCPs</span>
          <span>•</span>
          <span>{[...new Set(hcps.map((hcp) => hcp.territory))].length} Territories</span>
          <span>•</span>
          <span>{[...new Set(hcps.map((hcp) => hcp.region))].length} Regions</span>
          <span>•</span>
          <span>{[...new Set(hcps.map((hcp) => hcp.specialty))].length} Specialties</span>
        </div>
        <div className="text-xs text-muted-foreground">Click bubbles for details • Hover for quick info</div>
      </div>

      {/* Load Leaflet CSS with custom styles */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />

      {/* Custom CSS for enhanced map styling */}
      <style jsx>{`
        .custom-hcp-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .territory-overlay {
          pointer-events: none;
          z-index: 100;
        }
        
        .territory-pulse {
          pointer-events: none;
          z-index: 99;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        
        .leaflet-marker-icon {
          z-index: 1000 !important;
        }
        
        .leaflet-marker-icon:hover {
          z-index: 1001 !important;
        }
      `}</style>
    </div>
  )
}
