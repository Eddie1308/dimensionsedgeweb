import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TeamMemberForm } from "../_components/TeamMemberForm";

export default function NewTeamMemberPage() {
  return (
    <>
      <AdminPageHeader title="New team member" backHref="/admin/team" />
      <TeamMemberForm
        initial={{
          nameEn: "", nameAr: "", titleEn: "", titleAr: "",
          department: "", photoUrl: "", summaryEn: "", summaryAr: "",
          bioEn: "", bioAr: "", order: 0, isVisible: true,
        }}
      />
    </>
  );
}
