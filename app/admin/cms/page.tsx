import { revalidatePath } from "next/cache";
import { AdminShell, SetupNotice } from "@/components/AdminShell";
import { getAdminCollections } from "@/lib/cms";
import { requireStaff } from "@/lib/admin-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function CmsPage() {
  const staff = await requireStaff();
  const { collections, configured } = await getAdminCollections();

  async function publishCollection(formData: FormData) {
    "use server";
    await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    const id = String(formData.get("id"));
    await supabase.from("cms_collections").update({ status: "published" }).eq("id", id);
    revalidatePath("/");
  }

  return (
    <AdminShell title="CMS">
      <div className="admin-grid">
        {staff.mode === "setup" || !configured ? <SetupNotice /> : null}
        <article className="admin-card wide">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Language</th>
                <th>Collection</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection: any) => (
                <tr key={collection.id}>
                  <td>{collection.language}</td>
                  <td>{collection.key}</td>
                  <td>{collection.status}</td>
                  <td>{collection.updated_at ? new Date(collection.updated_at).toLocaleString() : "-"}</td>
                  <td>
                    <form action={publishCollection}>
                      <input type="hidden" name="id" value={collection.id} />
                      <button className="btn" type="submit" disabled={!configured}>
                        Publish
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </AdminShell>
  );
}
