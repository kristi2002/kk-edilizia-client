import { redirect } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

/** Legacy route → keep backlinks, redirect to new silo. */
export default async function RifacimentoTettoPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/rifacimento-tetto-facciate`);
}
