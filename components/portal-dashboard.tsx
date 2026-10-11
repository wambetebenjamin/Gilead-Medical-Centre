"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Activity, CalendarDays, CreditCard, FileText, Pill, RefreshCw, ShieldCheck, X } from "@/components/icons";
import { nairobiToday } from "@/lib/availability";

type Appointment = { id: string; date: string; time: string; department: string; doctor: string; packageName?: string; appointmentType: string; status: string };
type Bill = { id: string; amountDue: number; status?: string; description?: string; dueDate?: string; reference?: string };
type Prescription = { id: string; name?: string; medication?: string; dosage?: string; instructions?: string; refillsRemaining?: number };
type Summary = { diagnoses?: string[]; allergies?: string[]; chronicConditions?: string[]; updatedAt?: string };
const tabs = [
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "summary", label: "Medical summary", icon: Activity },
  { id: "bills", label: "Bills", icon: CreditCard },
  { id: "prescriptions", label: "Prescriptions", icon: Pill },
] as const;
type Tab = (typeof tabs)[number]["id"];

function moreThan24Hours(date: string, time: string) {
  return new Date(`${date}T${time}:00+03:00`).getTime() - Date.now() >= 24 * 60 * 60 * 1000;
}

export function PortalDashboard({ patientName }: { patientName: string }) {
  const [active, setActive] = useState<Tab>("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [rescheduleId, setRescheduleId] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [phone, setPhone] = useState("");
  const [payingBill, setPayingBill] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  async function loadAll() {
    setLoading(true); setError("");
    try {
      const [appointmentResponse, billResponse, prescriptionResponse, summaryResponse] = await Promise.all([
        fetch("/api/portal/appointments", { cache: "no-store" }),
        fetch("/api/portal/bills", { cache: "no-store" }),
        fetch("/api/portal/prescriptions", { cache: "no-store" }),
        fetch("/api/portal/summary", { cache: "no-store" }),
      ]);
      const [appointmentBody, billBody, prescriptionBody, summaryBody] = await Promise.all([appointmentResponse.json(), billResponse.json(), prescriptionResponse.json(), summaryResponse.json()]);
      if (appointmentResponse.status === 401) { window.location.assign("/portal/login"); return; }
      if (appointmentResponse.ok) setAppointments(appointmentBody.appointments ?? []);
      if (billResponse.ok) setBills(billBody.bills ?? []);
      if (prescriptionResponse.ok) setPrescriptions(prescriptionBody.prescriptions ?? []);
      if (summaryResponse.ok) setSummary(summaryBody.summary ?? null);
      if (![appointmentResponse, billResponse, prescriptionResponse, summaryResponse].some((response) => response.ok)) setError("Some portal information is temporarily unavailable. Please try again later.");
    } catch {
      setError("We could not load your portal data. Please try again.");
    } finally { setLoading(false); }
  }

  useEffect(() => { void loadAll(); }, []);

  async function updateAppointment(id: string, operation: "cancel" | "reschedule") {
    setError(""); setNotice("");
    try {
      const response = await fetch("/api/portal/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, operation, date: newDate, time: newTime }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "We could not update this appointment.");
      setNotice(result.message);
      setRescheduleId("");
      await loadAll();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "We could not update this appointment."); }
  }

  async function pay(bill: Bill) {
    setError(""); setPaymentMessage(""); setPayingBill(bill.id);
    try {
      const response = await fetch("/api/portal/pay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ billId: bill.id, phone }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "We could not start your payment.");
      setPaymentMessage(result.message ?? "Check your phone to approve the M-Pesa request.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "We could not start your payment."); }
    finally { setPayingBill(""); }
  }

  return (
    <div className="portal-layout">
      <aside className="portal-sidebar">
        <div className="portal-sidebar__welcome"><span>Signed in as</span><strong>{patientName || "Gilead patient"}</strong></div>
        <nav className="portal-tabs" aria-label="Patient portal sections">{tabs.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-pressed={active === id} onClick={() => { setActive(id); setError(""); setNotice(""); }}><Icon size={17} />{label}</button>)}</nav>
        <button className="portal-signout" type="button" onClick={() => signOut({ callbackUrl: "/portal/login" })}><X size={15} />Sign out</button>
      </aside>
      <section className="portal-content" aria-live="polite">
        <div className="portal-content__header"><div><p className="eyebrow">Patient portal</p><h2>{tabs.find((tab) => tab.id === active)?.label}</h2></div><button className="portal-refresh" type="button" onClick={() => void loadAll()} disabled={loading}><RefreshCw size={15} />Refresh</button></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        {notice && <p className="form-success" role="status">{notice}</p>}
        {paymentMessage && <p className="form-success" role="status">{paymentMessage}</p>}
        {loading ? <div className="portal-loading" aria-busy="true"><span className="skeleton" /><span className="skeleton" /><span className="skeleton" /></div> : null}
        {!loading && active === "appointments" && <div className="portal-panel">
          {appointments.length === 0 ? <div className="portal-empty"><CalendarDays size={25} /><strong>No appointments to show</strong><p>When your appointment request is linked to this patient account, you’ll see it here.</p><a className="text-link" href="/book">Request an appointment</a></div> : <div className="portal-list">{appointments.map((appointment) => <article className="portal-record portal-record--stack" key={appointment.id}><div><strong>{appointment.department}</strong><span>{appointment.date} at {appointment.time} · {appointment.appointmentType}</span>{appointment.packageName && <span>Health package request: {appointment.packageName}</span>}<span>{appointment.doctor} · Reference {appointment.id}</span></div>{moreThan24Hours(appointment.date, appointment.time) ? <div className="portal-record__actions"><button type="button" className="button button--secondary button--small" onClick={() => { setRescheduleId(rescheduleId === appointment.id ? "" : appointment.id); setNewDate(appointment.date); setNewTime(appointment.time); }}>Reschedule</button><button type="button" className="portal-cancel" onClick={() => void updateAppointment(appointment.id, "cancel")}>Cancel</button></div> : <small className="portal-notice">Less than 24 hours · call +254 112 272 061</small>}{rescheduleId === appointment.id && <div className="reschedule-panel"><label>New date<input type="date" min={nairobiToday()} value={newDate} onChange={(event) => setNewDate(event.target.value)} /></label><label>Time<select value={newTime} onChange={(event) => setNewTime(event.target.value)}><option value="">Choose time</option>{["08:30","09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00"].map((slot) => <option value={slot} key={slot}>{slot}</option>)}</select></label><button className="button button--primary button--small" type="button" onClick={() => void updateAppointment(appointment.id, "reschedule")}>Save change</button></div>}</article>)}</div>}
        </div>}
        {!loading && active === "summary" && <div className="portal-panel"><p>Your clinical summary is visible only to you and authorised members of your care team.</p>{summary ? <div className="summary-grid">{([["Diagnoses", summary.diagnoses], ["Allergies", summary.allergies], ["Chronic conditions", summary.chronicConditions]] as const).map(([label, items]) => <div className="portal-summary-card" key={label}><span>{label}</span>{items?.length ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Nothing recorded here.</p>}</div>)}</div> : <div className="portal-empty"><ShieldCheck size={25} /><strong>Your summary is not available yet</strong><p>When your clinical team links your record, your diagnoses, allergies and long-term conditions will appear here.</p></div>}</div>}
        {!loading && active === "bills" && <div className="portal-panel">{bills.length === 0 ? <div className="portal-empty"><CreditCard size={25} /><strong>No bills to show</strong><p>Outstanding balances and payment history will appear here when linked to your patient account.</p></div> : <><div className="portal-phone-field"><label htmlFor="mpesa-phone">M-Pesa phone number</label><input id="mpesa-phone" type="tel" autoComplete="tel" placeholder="07XX XXX XXX" value={phone} onChange={(event) => setPhone(event.target.value)} /></div><div className="portal-list">{bills.map((bill) => <article className="portal-record" key={bill.id}><div><strong>{bill.description ?? `Bill ${bill.reference ?? bill.id}`}</strong><span>{bill.status ?? "Outstanding"}{bill.dueDate ? ` · Due ${bill.dueDate}` : ""}</span></div><div className="portal-record__pay"><strong>KES {(bill.amountDue ?? 0).toLocaleString("en-KE")}</strong>{bill.status !== "paid" && <button type="button" className="button button--primary button--small" onClick={() => void pay(bill)} disabled={payingBill === bill.id || !phone}>{payingBill === bill.id ? "Starting…" : "Pay with M-Pesa"}</button>}</div></article>)}</div></>}</div>}
        {!loading && active === "prescriptions" && <div className="portal-panel">{prescriptions.length === 0 ? <div className="portal-empty"><Pill size={25} /><strong>No active prescriptions</strong><p>When your care team adds a prescription, it will appear here.</p></div> : <div className="portal-list">{prescriptions.map((prescription) => <article className="portal-record" key={prescription.id}><div><strong>{prescription.name ?? prescription.medication}</strong><span>{prescription.dosage ?? "See your clinician’s instructions"}{prescription.refillsRemaining !== undefined ? ` · ${prescription.refillsRemaining} refills left` : ""}</span>{prescription.instructions && <span>{prescription.instructions}</span>}</div><a className="button button--secondary button--small" href={`https://wa.me/254112272061?text=${encodeURIComponent(`Hello, I would like to request a refill for prescription ${prescription.id}.`)}`} target="_blank" rel="noreferrer">Request refill</a></article>)}</div>}</div>}
      </section>
    </div>
  );
}
