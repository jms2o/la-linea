import { redirect } from "next/navigation";

export default async function RegisterPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  params.set("mode", "register");

  const resolved = await searchParams;
  const next = resolved.next;

  if (typeof next === "string") {
    params.set("next", next);
  }

  redirect(`/login?${params.toString()}`);
}
