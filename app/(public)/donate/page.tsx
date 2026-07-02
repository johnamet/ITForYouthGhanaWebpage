import { DonationCampaign } from "@/components/home/donation-campaign";
import { activeDonationCampaign } from "@/lib/content/site-config";

export default function DonatePage() {
  return <DonationCampaign campaign={activeDonationCampaign} />;
}
