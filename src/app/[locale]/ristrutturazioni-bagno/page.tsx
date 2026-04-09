import { redirect } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

/** Legacy route → keep backlinks, redirect to new silo. */
export default async function RistrutturazioniBagnoPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/ristrutturazione-bagno`);
}
