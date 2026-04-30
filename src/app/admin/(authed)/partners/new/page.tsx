import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PartnerForm } from "../_components/PartnerForm";

export default function NewPartnerPage() {
  return (
    <>
      <AdminPageHeader title="New partner" backHref="/admin/partners" />
      <PartnerForm
        initial={{
          nameEn: "",
          nameAr: "",
          logoText: "",
          logoUrl: "",
          websiteUrl: "",
          isVisible: false,
          order: 0,
        }}
      />
    </>
  );
}
