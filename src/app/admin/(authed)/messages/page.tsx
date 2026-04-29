import { prisma } from "@/lib/prisma";
import { withAdminDb } from "@/lib/admin/db-guard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DbNotice } from "@/components/admin/DbNotice";
import { MessagesList } from "./MessagesList";

export default async function AdminMessagesPage() {
  const result = await withAdminDb(() =>
    prisma.contactSubmission.findMany({
      orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
      take: 200,
    }),
  );

  if (!result.ok) {
    return (
      <>
        <AdminPageHeader title="Messages" />
        <DbNotice error={result.error} />
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Messages"
        description="Submissions from the public contact form. Newest unread shown first."
      />
      <MessagesList
        messages={result.data.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          company: m.company,
          subject: m.subject,
          message: m.message,
          isRead: m.isRead,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </>
  );
}
