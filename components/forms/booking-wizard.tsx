"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, DepartmentIcon, ShieldCheck, Video } from "@/components/icons";
import { departments, doctors, healthPackages, insuranceProviders } from "@/lib/data";
import { addNairobiDays, isRealDate, nairobiToday } from "@/lib/availability";
import { CaptchaFallback, useCaptcha } from "@/components/captcha";
import { FormField } from "@/components/ui";

type PatientDetails = {
  patientName: string;
  dateOfBirth: string;
  patientIdentifier: string;
  phone: string;
  email: string;
  insuranceProvider: string;
  insuranceNumber: string;
  reason: string;
};
type Slot = { id: string; time: string; available: boolean };
const steps = ["Department", "Clinician", "Date & time", "Your details", "Confirm"];

export function BookingWizard() {
  const captcha = useCaptcha("appointment_booking");
  const [step, setStep] = useState(1);
  const [department, setDepartment] = useState("");
  const [packageSlug, setPackageSlug] = useState("");
  const [doctor, setDoctor] = useState("next-available");
  const [appointmentType, setAppointmentType] = useState("In-Person");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [requestedTime, setRequestedTime] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [patient, setPatient] = useState<PatientDetails>({ patientName: "", dateOfBirth: "", patientIdentifier: "", phone: "", email: "", insuranceProvider: "", insuranceNumber: "", reason: "" });
  const [fieldError, setFieldError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [reference, setReference] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialDoctor = params.get("doctor");
    const initialDepartment = params.get("department");
    const initialType = params.get("appointmentType");
    const initialDate = params.get("date");
    const initialTime = params.get("time");
    const initialPackage = params.get("package");
    const requestedDepartment = departments.find((item) => item.slug === initialDepartment);
    const requestedDoctor = doctors.find((item) => item.slug === initialDoctor);
    if (requestedDepartment) setDepartment(requestedDepartment.slug);
    if (initialPackage && healthPackages.some((item) => item.slug === initialPackage)) setPackageSlug(initialPackage);
    if (requestedDoctor && (!requestedDepartment || requestedDoctor.departmentSlug === requestedDepartment.slug)) {
      setDoctor(requestedDoctor.slug);
      if (!requestedDepartment) setDepartment(requestedDoctor.departmentSlug);
    }
    if (initialType === "Telemedicine" || initialType === "In-Person") setAppointmentType(initialType);
    const fallbackDate = addNairobiDays(1);
    setDate(initialDate && isRealDate(initialDate) && initialDate >= nairobiToday() ? initialDate : fallbackDate);
    if (initialTime && /^\d{2}:\d{2}$/.test(initialTime)) setRequestedTime(initialTime);
  }, []);

  useEffect(() => {
    if (step !== 3 || !department || !date) return;
    let active = true;
    setSlotsLoading(true); setSlotError(""); setSlots([]); setTime("");
    const params = new URLSearchParams({ department, doctor, date });
    fetch(`/api/availability?${params.toString()}`, { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Availability is temporarily unavailable.");
        return result as { slots: Slot[] };
      })
      .then((result) => { if (active) { setSlots(result.slots ?? []); if (requestedTime && result.slots?.some((slot) => slot.time === requestedTime)) setTime(requestedTime); } })
      .catch((error) => { if (active) setSlotError(error instanceof Error ? error.message : "Availability is temporarily unavailable."); })
      .finally(() => { if (active) setSlotsLoading(false); });
    return () => { active = false; };
  }, [step, department, doctor, date, requestedTime]);

  const selectedDepartment = departments.find((item) => item.slug === department);
  const selectedPackage = healthPackages.find((item) => item.slug === packageSlug);
  const eligibleDoctors = useMemo(() => doctors.filter((item) => item.departmentSlug === department), [department]);
  const selectedDoctor = doctors.find((item) => item.slug === doctor);

  function updatePatient(key: keyof PatientDetails, value: string) {
    setPatient((current) => ({ ...current, [key]: value }));
    setFieldError("");
  }

  function next() {
    setFieldError("");
    if (step === 1 && !department) { setFieldError("Choose a department to continue."); return; }
    if (step === 2 && !doctor) { setFieldError("Choose a clinician or select next available."); return; }
    if (step === 3 && (!date || !time)) { setFieldError("Choose an available date and time."); return; }
    if (step === 4) {
      if (!patient.patientName || !patient.dateOfBirth || !patient.patientIdentifier || !patient.phone || !patient.email) {
        setFieldError("Complete all required patient details."); return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) { setFieldError("Enter a valid email address."); return; }
      if (!/^\+?[\d\s().-]{7,20}$/.test(patient.phone)) { setFieldError("Enter a valid phone number."); return; }
      if (new Date(patient.dateOfBirth) > new Date()) { setFieldError("Date of birth cannot be in the future."); return; }
    }
    setStep((current) => Math.min(5, current + 1));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitError(""); setSuccess("");
    const proof = await captcha.getProof();
    if (!proof) { setSubmitError("Please complete the security check before confirming."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department, doctor, packageSlug, appointmentType, date, time, ...patient, ...proof }),
      });
      const result = await response.json();
      captcha.handleFailure(result);
      if (!response.ok) throw new Error(result.message ?? "We could not submit your appointment request.");
      setReference(result.reference ?? "");
      setSuccess(result.message ?? "Your appointment request has been received.");
      captcha.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not submit your appointment request.");
    } finally { setBusy(false); }
  }

  if (success) {
    return (
      <div className="booking-success" role="status">
        <span className="booking-success__icon"><Check size={28} /></span>
        <p className="eyebrow">Request received</p>
        <h2>Thank you, {patient.patientName.split(" ")[0]}.</h2>
        <p>{success}</p>
        {reference && <p className="booking-success__reference">Reference <strong>{reference}</strong></p>}
        <p>We’ll contact you using the details provided. If you have an urgent medical concern, call <a href="tel:+254112272061">+254 112 272 061</a>.</p>
        <div className="button-row"><Link className="button button--primary" href="/">Return to homepage<ArrowRight size={16} /></Link><Link className="button button--secondary" href="/doctors">Find another doctor</Link></div>
      </div>
    );
  }

  return (
    <div className="booking-layout">
      <div className="booking-main">
        <div className="booking-progress" aria-label={`Step ${step} of 5`}>
          {steps.map((label, index) => <div key={label} className={`booking-progress__step${step === index + 1 ? " is-current" : ""}${step > index + 1 ? " is-complete" : ""}`}><span>{step > index + 1 ? <Check size={13} /> : `0${index + 1}`}</span><small>{label}</small></div>)}
        </div>
        {selectedPackage && <aside className="booking-package-prefill" aria-label="Selected health package"><span className="booking-package-prefill__icon"><Check size={17} /></span><div><strong>{selectedPackage.name}</strong><span>KES {selectedPackage.price.toLocaleString("en-KE")} · illustrative price · package request only</span></div><button type="button" onClick={() => setPackageSlug("")}>Remove</button></aside>}
        <form onSubmit={submit} noValidate>
          {step === 1 && <section className="booking-step" aria-labelledby="booking-step-title"><p className="eyebrow">Step 1 of 5</p><h2 id="booking-step-title">Where would you like care?</h2><p>Choose the department that best matches your needs. If you’re unsure, choose General Medicine or contact our team.</p><div className="choice-grid choice-grid--departments">{departments.map((item) => <button type="button" key={item.slug} className={`choice-card${department === item.slug ? " is-selected" : ""}`} aria-pressed={department === item.slug} onClick={() => { setDepartment(item.slug); setDoctor("next-available"); }}><span className="choice-card__icon"><DepartmentIcon name={item.icon} /></span><span>{item.name}</span><small>{department === item.slug ? "Selected" : "Choose department"}</small></button>)}</div></section>}

          {step === 2 && <section className="booking-step" aria-labelledby="booking-step-title"><p className="eyebrow">Step 2 of 5</p><h2 id="booking-step-title">Choose your clinician</h2><p>Choose a specific doctor or let us find the next available clinician in {selectedDepartment?.name ?? "your department"}.</p><div className="choice-grid choice-grid--doctors"><button type="button" className={`next-available-card${doctor === "next-available" ? " is-selected" : ""}`} aria-pressed={doctor === "next-available"} onClick={() => setDoctor("next-available")}><span className="next-available-card__icon"><CalendarDays size={20} /></span><span><strong>Next available</strong><small>We’ll match you with the earliest suitable appointment.</small></span></button>{eligibleDoctors.map((item) => <button key={item.slug} type="button" className={`doctor-choice${doctor === item.slug ? " is-selected" : ""}`} aria-pressed={doctor === item.slug} onClick={() => setDoctor(item.slug)}><img src={item.image} alt="" /><span><strong>{item.name}</strong><small>{item.title}</small><small className="doctor-choice__availability">{item.availability}</small></span></button>)}</div><fieldset className="appointment-type"><legend>Appointment type</legend><div className="appointment-type__options"><button type="button" aria-pressed={appointmentType === "In-Person"} onClick={() => setAppointmentType("In-Person")}><span className="appointment-type__radio" />In-person</button><button type="button" aria-pressed={appointmentType === "Telemedicine"} onClick={() => setAppointmentType("Telemedicine")}><Video size={17} />Telemedicine</button></div></fieldset></section>}

          {step === 3 && <section className="booking-step" aria-labelledby="booking-step-title"><p className="eyebrow">Step 3 of 5</p><h2 id="booking-step-title">Find a time that works</h2><p>Availability is shown in East Africa Time (EAT). Select a date to see open appointment times.</p><FormField id="booking-date" label="Appointment date"><input id="booking-date" type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(event) => setDate(event.target.value)} required /></FormField><div className="slot-section"><div className="slot-section__head"><span><Clock3 size={16} />Available times</span>{date && <small>{new Date(`${date}T12:00:00`).toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" })}</small>}</div>{slotsLoading ? <div className="slot-grid" aria-busy="true" aria-label="Loading appointment times">{Array.from({ length: 10 }, (_, index) => <span className="skeleton skeleton--slot" key={index} />)}</div> : slotError ? <p className="inline-error" role="status">{slotError}</p> : slots.length ? <div className="slot-grid" aria-label="Available appointment times">{slots.map((slot) => <button key={slot.id} type="button" className={`slot-button${time === slot.time ? " is-selected" : ""}`} aria-pressed={time === slot.time} onClick={() => setTime(slot.time)}>{slot.time}</button>)}</div> : <p className="empty-note">No appointments are available on this date. Please choose another day or select next available clinician.</p>}</div></section>}

          {step === 4 && <section className="booking-step" aria-labelledby="booking-step-title"><p className="eyebrow">Step 4 of 5</p><h2 id="booking-step-title">A little about you</h2><p>We use these details to coordinate your appointment. Patient information is handled confidentially.</p><div className="form-grid form-grid--two"><FormField id="patient-name" label="Full name"><input id="patient-name" autoComplete="name" value={patient.patientName} onChange={(event) => updatePatient("patientName", event.target.value)} required aria-invalid={Boolean(fieldError && !patient.patientName)} /></FormField><FormField id="patient-dob" label="Date of birth"><input id="patient-dob" type="date" autoComplete="bday" value={patient.dateOfBirth} onChange={(event) => updatePatient("dateOfBirth", event.target.value)} required aria-invalid={Boolean(fieldError && !patient.dateOfBirth)} /></FormField><FormField id="patient-identifier" label="National ID or passport"><input id="patient-identifier" autoComplete="off" value={patient.patientIdentifier} onChange={(event) => updatePatient("patientIdentifier", event.target.value)} required aria-invalid={Boolean(fieldError && !patient.patientIdentifier)} /></FormField><FormField id="patient-phone" label="Phone number"><input id="patient-phone" type="tel" autoComplete="tel" placeholder="+254 7…" value={patient.phone} onChange={(event) => updatePatient("phone", event.target.value)} required aria-invalid={Boolean(fieldError && !patient.phone)} /></FormField><FormField id="patient-email" label="Email address"><input id="patient-email" type="email" autoComplete="email" value={patient.email} onChange={(event) => updatePatient("email", event.target.value)} required aria-invalid={Boolean(fieldError && !patient.email)} /></FormField><FormField id="patient-insurance-provider" label="Insurance provider"><select id="patient-insurance-provider" value={patient.insuranceProvider} onChange={(event) => updatePatient("insuranceProvider", event.target.value)}><option value="">Self-pay / choose later</option>{insuranceProviders.map((provider) => <option key={provider}>{provider}</option>)}</select></FormField><FormField id="patient-insurance-number" label="Insurance card number"><input id="patient-insurance-number" autoComplete="off" value={patient.insuranceNumber} onChange={(event) => updatePatient("insuranceNumber", event.target.value)} /></FormField></div><FormField id="visit-reason" label="Reason for visit (optional)" hint="Keep this brief; avoid including sensitive medical details."><textarea id="visit-reason" rows={3} maxLength={300} value={patient.reason} onChange={(event) => updatePatient("reason", event.target.value)} /></FormField></section>}

          {step === 5 && <section className="booking-step" aria-labelledby="booking-step-title"><p className="eyebrow">Step 5 of 5</p><h2 id="booking-step-title">Review and confirm</h2><p>Check your details before sending your appointment request.</p><div className="booking-review"><div><span>Department</span><strong>{selectedDepartment?.name}</strong></div>{selectedPackage && <div><span>Health package</span><strong>{selectedPackage.name}</strong></div>}<div><span>Clinician</span><strong>{selectedDoctor?.name ?? "Next available clinician"}</strong></div><div><span>Type</span><strong>{appointmentType}</strong></div><div><span>Date & time</span><strong>{date} · {time} EAT</strong></div><div><span>Patient</span><strong>{patient.patientName}</strong></div><div><span>Contact</span><strong>{patient.phone} · {patient.email}</strong></div></div><p className="booking-consent"><ShieldCheck size={17} /> By confirming, you consent to Gilead Medical Centre using your details to process and follow up on this appointment request. Read our <Link href="/legal/privacy-policy">Privacy Policy</Link>.</p><CaptchaFallback required={captcha.fallbackRequired} onToken={captcha.setV2Token} />{submitError && <p className="form-error" role="alert">{submitError}</p>}</section>}

          {fieldError && <p className="form-error" role="alert">{fieldError}</p>}
          <div className="booking-actions">
            {step > 1 ? <button type="button" className="button button--secondary" onClick={() => { setFieldError(""); setStep((current) => current - 1); }}><ArrowLeft size={16} />Back</button> : <span />}
            {step < 5 ? <button type="button" className="button button--primary" onClick={next}>Continue<ArrowRight size={16} /></button> : <button type="submit" className="button button--primary" disabled={busy}>{busy ? "Sending securely…" : "Confirm appointment request"}<ArrowRight size={16} /></button>}
          </div>
        </form>
      </div>
      <aside className="booking-aside">
        <div className="booking-aside__card"><span className="booking-aside__icon"><ShieldCheck size={21} /></span><p className="eyebrow">Here for you</p><h3>Care starts with a conversation.</h3><p>Our team will confirm your request and help with the next steps.</p><a href="tel:+254112272061">Need help? +254 112 272 061</a></div>
        <div className="booking-aside__note"><strong>Before you book</strong><p>Online requests are not confirmed until our booking coordinator contacts you. For urgent or emergency care, call us directly.</p></div>
      </aside>
    </div>
  );
}
