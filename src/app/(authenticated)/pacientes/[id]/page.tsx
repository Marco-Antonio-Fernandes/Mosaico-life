import { PatientWorkspace } from "@/features/prototype/patient-workspace";

export default async function PatientPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ session?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  return <div className="prototype"><p className="proto-demo">PRÉVIA VISUAL · Prontuário fictício. Nada é enviado ao servidor.</p><header className="proto-heading"><span className="proto-badge">Mosaico Life · psicologia</span><h1>Prontuário do paciente</h1><p>O paciente é a entrada do cuidado: anotações, demandas, evolução e sessões ficam reunidas neste espaço.</p></header><PatientWorkspace patientId={id} initialSession={query.session === "1"} /></div>;
}
