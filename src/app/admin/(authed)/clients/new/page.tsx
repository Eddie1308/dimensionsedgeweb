import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ClientForm } from "../_components/ClientForm";

export default function NewClientPage() {
  return (
    <>
      <AdminPageHeader title="New client" backHref="/admin/clients" />
      <ClientForm
        initial={{
          nameEn: "",
          nameAr: "",
          logoUrl: "",
          industryEn: "",
          industryAr: "",
          isVisible: false,
          order: 0,
        }}
      />
    </>
  );
}
