export type Department = {
  slug: string;
  name: string;
  shortName: string;
  head: string;
  description: string;
  services: string[];
  facilities: string[];
  icon: string;
  image?: string;
};

export const departments: Department[] = [
  {
    slug: "emergency-trauma",
    name: "Emergency & Trauma",
    shortName: "Emergency",
    head: "Dr. Daniel Mwangi",
    description: "Urgent assessment and stabilisation, day or night, with coordinated access to imaging, theatre and critical care.",
    services: ["24-hour emergency assessment", "Trauma stabilisation", "Ambulance coordination", "Urgent diagnostics"],
    facilities: ["24-hour emergency bay", "On-site imaging", "Resuscitation equipment", "Direct theatre and ICU access"],
    icon: "heart-pulse",
    image: "/images/uganda-child-care.jpg",
  },
  {
    slug: "maternity",
    name: "Maternity & Women’s Health",
    shortName: "Maternity",
    head: "Dr. Wanjiku Muriuki",
    description: "Thoughtful antenatal, delivery and postnatal care for every family, supported by experienced maternity teams.",
    services: ["Antenatal clinics", "Labour and delivery", "Postnatal support", "Gynaecology consultations"],
    facilities: ["Labour suites", "Newborn support", "Ultrasound access", "Family-centred rooms"],
    icon: "baby",
    image: "/images/uganda-ward-care.jpg",
  },
  {
    slug: "paediatrics",
    name: "Paediatrics",
    shortName: "Paediatrics",
    head: "Dr. Amina Wanjiku",
    description: "Child-friendly care from routine check-ups and immunisations to specialist assessment and inpatient support.",
    services: ["Well-child reviews", "Immunisations", "Acute paediatric care", "Growth and development checks"],
    facilities: ["Child-friendly clinic rooms", "Paediatric observation", "Family support spaces", "Laboratory and imaging access"],
    icon: "baby",
    image: "/images/uganda-child-care.jpg",
  },
  {
    slug: "surgery",
    name: "Surgery",
    shortName: "Surgery",
    head: "Dr. Peter Kamau",
    description: "Planned and urgent surgical care with clear preparation, careful follow-up and a multidisciplinary team.",
    services: ["General surgery", "Day surgery", "Pre-operative assessment", "Post-operative review"],
    facilities: ["Modern operating theatres", "Recovery bays", "Sterile processing", "Critical care support"],
    icon: "stethoscope",
  },
  {
    slug: "cardiology",
    name: "Cardiology",
    shortName: "Cardiology",
    head: "Dr. Brian Kamau",
    description: "Heart-health assessment, monitoring and treatment planning with a focus on prevention and continuity of care.",
    services: ["Cardiology consultations", "ECG and monitoring", "Hypertension care", "Cardiac risk assessment"],
    facilities: ["ECG diagnostics", "Cardiac monitoring", "Imaging referrals", "Pharmacy support"],
    icon: "heart-pulse",
  },
  {
    slug: "oncology",
    name: "Oncology",
    shortName: "Oncology",
    head: "Dr. Leah Otieno",
    description: "Coordinated cancer care with supportive guidance, diagnostics and referrals tailored to each patient.",
    services: ["Oncology consultations", "Treatment planning", "Screening guidance", "Supportive care coordination"],
    facilities: ["Multidisciplinary case review", "Diagnostic coordination", "Patient counselling", "Referral navigation"],
    icon: "ribbon",
  },
  {
    slug: "orthopaedics",
    name: "Orthopaedics",
    shortName: "Orthopaedics",
    head: "Dr. Peter Mwangi",
    description: "Assessment and treatment for bone, joint and mobility concerns, from injury care to rehabilitation planning.",
    services: ["Fracture assessment", "Joint and back clinics", "Sports injury care", "Rehabilitation planning"],
    facilities: ["Digital imaging access", "Procedure rooms", "Physiotherapy referrals", "Mobility support"],
    icon: "bone",
  },
  {
    slug: "neurology",
    name: "Neurology",
    shortName: "Neurology",
    head: "Dr. Samuel Njoroge",
    description: "Specialist evaluation for neurological symptoms and long-term conditions, with coordinated diagnostics.",
    services: ["Neurology consultations", "Headache assessment", "Stroke follow-up", "Chronic condition reviews"],
    facilities: ["Diagnostic coordination", "Imaging referrals", "Care planning", "Pharmacy support"],
    icon: "brain",
  },
  {
    slug: "radiology-imaging",
    name: "Radiology & Imaging",
    shortName: "Imaging",
    head: "Dr. Mercy Achieng",
    description: "Timely diagnostic imaging to support clinical decisions, with clear preparation instructions for patients.",
    services: ["Ultrasound", "X-ray", "CT referrals", "Image-guided assessment"],
    facilities: ["Digital radiography", "Ultrasound rooms", "Secure image reporting", "Clinician coordination"],
    icon: "scan-line",
  },
  {
    slug: "icu",
    name: "Intensive Care (ICU)",
    shortName: "ICU",
    head: "Dr. David Kiptoo",
    description: "Close monitoring and specialist support for patients who need a higher level of care.",
    services: ["Critical care monitoring", "Post-operative observation", "Family updates", "Consultant-led reviews"],
    facilities: ["Monitored beds", "Ventilatory support", "24-hour clinical cover", "Laboratory access"],
    icon: "activity",
  },
  {
    slug: "pharmacy",
    name: "Pharmacy",
    shortName: "Pharmacy",
    head: "Pharm. Grace Wambui",
    description: "Reliable prescription support and medicine counselling from a team that helps patients use medicines safely.",
    services: ["Prescription dispensing", "Medicine counselling", "Refill requests", "Medication reviews"],
    facilities: ["On-site pharmacy", "Secure dispensing", "Refill coordination", "Patient counselling"],
    icon: "pill",
  },
  {
    slug: "laboratory",
    name: "Laboratory",
    shortName: "Laboratory",
    head: "Dr. Esther Naliaka",
    description: "Accurate diagnostic testing with clear instructions and results shared securely with your care team.",
    services: ["Routine blood tests", "Microbiology", "Point-of-care testing", "Specimen collection"],
    facilities: ["On-site collection", "Quality-controlled processing", "Secure reporting", "Clinician coordination"],
    icon: "flask-conical",
  },
];

export type Doctor = {
  slug: string;
  name: string;
  title: string;
  department: string;
  departmentSlug: string;
  specialty: string;
  qualifications: string[];
  languages: string[];
  gender: "Female" | "Male";
  availability: "Today" | "This week" | "Limited";
  consultationFee: number;
  image: string;
  bio: string;
  telemedicine: boolean;
};

// Illustrative profile data for the prototype. Replace with a verified clinician roster before launch.
export const doctors: Doctor[] = [
  {
    slug: "amina-wanjiku",
    name: "Dr. Amina Wanjiku",
    title: "Consultant Paediatrician",
    department: "Paediatrics",
    departmentSlug: "paediatrics",
    specialty: "Child health & development",
    qualifications: ["MBChB", "M.Med Paediatrics"],
    languages: ["English", "Kiswahili"],
    gender: "Female",
    availability: "Today",
    consultationFee: 3500,
    image: "/images/doctor-wanjiku.jpg",
    bio: "A patient-first paediatric care profile focused on clear communication with children and their families.",
    telemedicine: true,
  },
  {
    slug: "brian-kamau",
    name: "Dr. Brian Kamau",
    title: "Consultant Cardiologist",
    department: "Cardiology",
    departmentSlug: "cardiology",
    specialty: "Heart health & prevention",
    qualifications: ["MBChB", "M.Med Internal Medicine", "Fellowship in Cardiology"],
    languages: ["English", "Kiswahili"],
    gender: "Male",
    availability: "This week",
    consultationFee: 5000,
    image: "/images/doctor-kamau.jpg",
    bio: "A sample cardiology profile for the appointment experience. Clinical credentials and availability require verification.",
    telemedicine: true,
  },
  {
    slug: "grace-otieno",
    name: "Dr. Grace Otieno",
    title: "Consultant Obstetrician & Gynaecologist",
    department: "Maternity & Women’s Health",
    departmentSlug: "maternity",
    specialty: "Antenatal & women’s health",
    qualifications: ["MBChB", "M.Med Obstetrics & Gynaecology"],
    languages: ["English", "Kiswahili", "Luo"],
    gender: "Female",
    availability: "Today",
    consultationFee: 4500,
    image: "/images/doctor-wanjiku.jpg",
    bio: "A sample women’s-health profile centred on respectful, family-aware care and shared decision-making.",
    telemedicine: true,
  },
  {
    slug: "peter-mwangi",
    name: "Dr. Peter Mwangi",
    title: "Consultant Orthopaedic Surgeon",
    department: "Orthopaedics",
    departmentSlug: "orthopaedics",
    specialty: "Bone, joint & mobility care",
    qualifications: ["MBChB", "M.Med Orthopaedics"],
    languages: ["English", "Kiswahili"],
    gender: "Male",
    availability: "Limited",
    consultationFee: 4500,
    image: "/images/doctor-kamau.jpg",
    bio: "An illustrative orthopaedic profile to demonstrate search, appointment slots and clinician detail pages.",
    telemedicine: false,
  },
  {
    slug: "esther-naliaka",
    name: "Dr. Esther Naliaka",
    title: "Laboratory Medicine Specialist",
    department: "Laboratory",
    departmentSlug: "laboratory",
    specialty: "Laboratory diagnostics",
    qualifications: ["MBChB", "M.Med Laboratory Medicine"],
    languages: ["English", "Kiswahili"],
    gender: "Female",
    availability: "This week",
    consultationFee: 3000,
    image: "/images/doctor-wanjiku.jpg",
    bio: "A demonstration profile for the centre’s diagnostics and laboratory services.",
    telemedicine: false,
  },
];

export const insuranceProviders = ["NHIF", "Jubilee", "AAR", "Britam", "Madison", "CIC"];

export const branches = {
  nairobi: {
    name: "Nairobi",
    address: "Nairobi, Kenya",
    phone: "+254 112 272 061",
    email: "nairobi@gileadmedicalcentre.co.ke",
    hours: "Open 24 hours · Emergency services",
    mapQuery: "Gilead Medical Centre Nairobi Kenya",
  },
  mombasa: {
    name: "Mombasa",
    address: "Mombasa, Kenya",
    phone: "+254 112 272 061",
    email: "mombasa@gileadmedicalcentre.co.ke",
    hours: "Open 24 hours · Emergency services",
    mapQuery: "Gilead Medical Centre Mombasa Kenya",
  },
};

export const healthPackages = [
  {
    slug: "basic-wellness",
    name: "Basic Wellness Check",
    price: 4500,
    note: "Indicative price · confirm with the centre",
    includes: ["Consultation with a clinician", "Blood pressure and BMI", "Basic blood profile", "Personal health summary"],
  },
  {
    slug: "executive-screen",
    name: "Executive Health Screen",
    price: 12500,
    note: "Indicative price · confirm with the centre",
    includes: ["Comprehensive clinician review", "Expanded laboratory profile", "ECG and vital checks", "Follow-up discussion"],
  },
  {
    slug: "family-package",
    name: "Comprehensive Family Package",
    price: 25000,
    note: "Indicative price · confirm with the centre",
    includes: ["Wellness checks for two adults", "Child health assessment", "Family risk review", "Coordinated results appointment"],
  },
];
