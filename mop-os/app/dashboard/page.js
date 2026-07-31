import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Canvas from "./Canvas";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (!profile) {
    // por si el usuario existía antes de crear la tabla profiles
    const { data: created } = await supabase
      .from("profiles")
      .upsert({ id: session.user.id, email: session.user.email, role: "CLIENTE" })
      .select()
      .single();
    profile = created;
  }

  return (
    <Canvas
      user={{ id: session.user.id, email: session.user.email }}
      profile={profile}
    />
  );
}
