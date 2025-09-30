import { HCPDetailPage } from "@/components/hcp-detail-page"

interface HCPPageProps {
  params: {
    id: string
  }
}

export default function HCPPage({ params }: HCPPageProps) {
  return <HCPDetailPage hcpId={params.id} />
}
