// Demo data for the organization "umbrella": units, domains, and the people under each university
// and industry, with their skills and problem-area claims. Additive and idempotent -- safe to re-run,
// and it never changes an existing user's password or role. Run with: npm run db:seed:people
import { PrismaClient, UserRole, AccountStatus, VerificationStatus, OrgUnitType } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'node:fs'
import path from 'node:path'

const prisma = new PrismaClient()

type Kind = 'uni_student' | 'uni_faculty' | 'uni_mentor' | 'ind_employee' | 'ind_mentor' | 'ind_expert'
type Load = 'light' | 'moderate' | 'full' // stored as currentLoad against maxCapacity 4, as mentor_matcher.py derives it

interface Person {
  name: string
  kind: Kind
  org: string // registrationNumber
  unit: string
  title?: string
  years?: number
  spec?: string
  bio?: string
  certs?: string
  load?: Load
  skills: [string, number][]
  domains: [string, string, number][] // [domain, subdomain, proficiency 1-5]
}

const EMAIL_DOMAIN: Record<string, string> = {
  'UNIV-001': 'abcit.edu.in',
  'UNIV-002': 'xyzuniv.edu.in',
  'UNIV-003': 'sahyadri.edu.in',
  'IND-001': 'techsolutions.com',
  'IND-002': 'greenenergy.in',
  'IND-003': 'aquatech.co.in',
}

const NEW_ORGS = {
  universities: [
    {
      registrationNumber: 'UNIV-003', name: 'Sahyadri University of Sciences', regionId: 'region-1', district: 'Pune',
      description: 'Research university strong in water resources, data science and rural development',
      website: 'https://sahyadri.edu.in', email: 'info@sahyadri.edu.in', address: 'Kothrud, Pune',
    },
  ],
  industries: [
    {
      registrationNumber: 'IND-003', companyName: 'AquaTech Infra Ltd', regionId: 'region-1', district: 'Pune',
      industryType: 'Water & Infrastructure', description: 'Water treatment and smart drainage engineering',
      website: 'https://aquatech.co.in', email: 'contact@aquatech.co.in', address: 'Hinjewadi, Pune',
    },
  ],
}

const UNITS: Record<string, { type: OrgUnitType; names: string[] }> = {
  'UNIV-001': { type: OrgUnitType.DEPARTMENT, names: ['Computer Science', 'Civil Engineering', 'Electronics & Telecom', 'Environmental Science'] },
  'UNIV-002': { type: OrgUnitType.DEPARTMENT, names: ['Computer Science', 'Mechanical Engineering', 'Agricultural Engineering', 'Health Sciences'] },
  'UNIV-003': { type: OrgUnitType.DEPARTMENT, names: ['Civil & Water Resources', 'Data Science', 'Rural Development'] },
  'IND-001': { type: OrgUnitType.BUSINESS_UNIT, names: ['AI & Data Science', 'IoT', 'Product Engineering'] },
  'IND-002': { type: OrgUnitType.BUSINESS_UNIT, names: ['Renewable Energy', 'Sustainability & CSR'] },
  'IND-003': { type: OrgUnitType.BUSINESS_UNIT, names: ['Water Treatment', 'Smart Infrastructure'] },
}

const EXTRA_SKILLS: [string, string, string][] = [
  ['Hydrology', 'Environmental', 'Technical'], ['Stormwater Management', 'Environmental', 'Technical'],
  ['Machine Learning', 'Data Science', 'Technical'], ['Computer Vision', 'Data Science', 'Technical'],
  ['Data Visualization', 'Data Science', 'Technical'], ['Embedded Systems', 'IoT', 'Technical'],
  ['Sensor Hardware Design', 'IoT', 'Technical'], ['Web Development', 'Programming', 'Technical'],
  ['Mobile App Development', 'Programming', 'Technical'], ['Cybersecurity', 'Programming', 'Technical'],
  ['Soil Science', 'Agriculture', 'Technical'], ['Precision Agriculture', 'Agriculture', 'Technical'],
  ['Solar PV Design', 'Energy', 'Technical'], ['Energy Auditing', 'Energy', 'Technical'],
  ['Water Treatment', 'Environmental', 'Technical'], ['Waste Management', 'Environmental', 'Technical'],
  ['Public Health', 'Healthcare', 'Technical'], ['Telemedicine Systems', 'Healthcare', 'Technical'],
  ['Urban Planning', 'Urban', 'Technical'], ['Transport Planning', 'Urban', 'Technical'],
]

const PEOPLE: Person[] = [
  // ---- ABC Institute of Technology ----
  { name: 'Neha Kulkarni', kind: 'uni_student', org: 'UNIV-001', unit: 'Computer Science', bio: 'ML student building learning tools for rural schools',
    skills: [['Machine Learning', 4], ['Python Programming', 5], ['Data Analysis', 4]], domains: [['Education', 'Digital Learning', 4], ['Healthcare', 'Telemedicine and Health Technology', 3]] },
  { name: 'Rohan Deshmukh', kind: 'uni_student', org: 'UNIV-001', unit: 'Computer Science', bio: 'Full-stack developer interested in civic tech',
    skills: [['Web Development', 4], ['Mobile App Development', 4]], domains: [['Public Administration', 'Citizen Grievance Management', 4], ['Accessibility', 'Digital Accessibility', 3]] },
  { name: 'Dr. Meera Iyer', kind: 'uni_faculty', org: 'UNIV-001', unit: 'Computer Science', title: 'Associate Professor', years: 12, spec: 'Machine Learning and Computer Vision',
    skills: [['Machine Learning', 5], ['Computer Vision', 4], ['Data Analysis', 4]], domains: [['Agriculture', 'Crop Disease and Pest Management', 4], ['Healthcare', 'Diagnostics and Testing', 3]] },
  { name: 'Amit Patil', kind: 'uni_student', org: 'UNIV-001', unit: 'Civil Engineering', bio: 'Civil engineering student focused on flood mapping',
    skills: [['GIS Mapping', 4], ['Civil Engineering', 3], ['Flood Modelling', 3]], domains: [['Water Resources', 'Flood Management', 4]] },
  { name: 'Dr. Rajesh Naik', kind: 'uni_mentor', org: 'UNIV-001', unit: 'Civil Engineering', title: 'Professor', years: 20, spec: 'Hydrology and Urban Drainage', load: 'moderate',
    bio: 'Two decades of work on urban flooding and stormwater systems',
    skills: [['Hydrology', 5], ['Stormwater Management', 5], ['Flood Modelling', 5]], domains: [['Water Resources', 'Flood Management', 5], ['Sanitation', 'Drainage and Waterlogging', 5]] },
  { name: 'Prof. Kavita Joshi', kind: 'uni_faculty', org: 'UNIV-001', unit: 'Civil Engineering', title: 'Professor', years: 14, spec: 'Urban and Transport Planning',
    skills: [['Urban Planning', 5], ['Transport Planning', 4]], domains: [['Urban Infrastructure', 'Public Transport', 5], ['Urban Infrastructure', 'Roads and Streets', 4]] },
  { name: 'Sanjay More', kind: 'uni_student', org: 'UNIV-001', unit: 'Electronics & Telecom', bio: 'Builds low-cost sensor nodes',
    skills: [['Embedded Systems', 4], ['IoT Sensor Networks', 4]], domains: [['Energy', 'Energy Efficiency', 3], ['Environment', 'Environmental Monitoring', 4]] },
  { name: 'Dr. Anjali Rao', kind: 'uni_mentor', org: 'UNIV-001', unit: 'Electronics & Telecom', title: 'Associate Professor', years: 13, spec: 'Sensor Systems', load: 'light',
    bio: 'Designs field-deployable environmental sensors',
    skills: [['Sensor Hardware Design', 5], ['IoT Sensor Networks', 5], ['Embedded Systems', 4]], domains: [['Environment', 'Environmental Monitoring', 5], ['Water Resources', 'Water Quality', 4]] },
  { name: 'Pooja Bhosale', kind: 'uni_student', org: 'UNIV-001', unit: 'Environmental Science', bio: 'Studying urban air quality',
    skills: [['Environmental Impact Assessment', 4], ['Remote Sensing', 3]], domains: [['Environment', 'Air Pollution', 4]] },
  { name: 'Dr. Vikram Chavan', kind: 'uni_mentor', org: 'UNIV-001', unit: 'Environmental Science', title: 'Professor', years: 18, spec: 'Solid Waste and Climate Resilience', load: 'full',
    bio: 'Advises municipalities on waste systems',
    skills: [['Environmental Impact Assessment', 5], ['Waste Management', 4]], domains: [['Sanitation', 'Solid Waste Management', 5], ['Environment', 'Climate Resilience', 4]] },

  // ---- XYZ University of Engineering ----
  { name: 'Ishaan Mehta', kind: 'uni_student', org: 'UNIV-002', unit: 'Computer Science', bio: 'Data visualisation for public datasets',
    skills: [['Machine Learning', 4], ['Data Visualization', 4]], domains: [['Public Administration', 'Government Schemes', 3], ['Education', 'Higher Education', 3]] },
  { name: 'Dr. Sneha Kapoor', kind: 'uni_faculty', org: 'UNIV-002', unit: 'Computer Science', title: 'Professor', years: 16, spec: 'Cybersecurity and e-Governance',
    skills: [['Cybersecurity', 5], ['Web Development', 4]], domains: [['Public Administration', 'Transparency and Accountability', 4], ['Accessibility', 'Digital Accessibility', 4]] },
  { name: 'Karan Singh', kind: 'uni_student', org: 'UNIV-002', unit: 'Mechanical Engineering', bio: 'Working on rooftop solar prototypes',
    skills: [['Sensor Hardware Design', 3], ['Solar PV Design', 3]], domains: [['Energy', 'Renewable Energy', 4]] },
  { name: 'Dr. Prakash Menon', kind: 'uni_mentor', org: 'UNIV-002', unit: 'Mechanical Engineering', title: 'Professor', years: 22, spec: 'Energy Systems', load: 'moderate',
    bio: 'Energy audits for small industry and public buildings',
    skills: [['Energy Auditing', 5], ['Solar PV Design', 4]], domains: [['Energy', 'Energy Efficiency', 5], ['Energy', 'Power Reliability', 4]] },
  { name: 'Aditi Deshpande', kind: 'uni_student', org: 'UNIV-002', unit: 'Agricultural Engineering', bio: 'Soil health mapping for small farms',
    skills: [['Soil Science', 4], ['Precision Agriculture', 3], ['GIS Mapping', 3]], domains: [['Agriculture', 'Soil Health', 4]] },
  { name: 'Dr. Suresh Pawar', kind: 'uni_mentor', org: 'UNIV-002', unit: 'Agricultural Engineering', title: 'Professor', years: 19, spec: 'Precision Agriculture and Irrigation', load: 'light',
    bio: 'Irrigation design and remote-sensing for crops',
    skills: [['Precision Agriculture', 5], ['Soil Science', 5], ['Remote Sensing', 4]], domains: [['Agriculture', 'Agricultural Irrigation', 5], ['Agriculture', 'Crop Production', 5]] },
  { name: 'Farah Sheikh', kind: 'uni_student', org: 'UNIV-002', unit: 'Health Sciences', bio: 'Community health data analysis',
    skills: [['Public Health', 4], ['Data Analysis', 3]], domains: [['Healthcare', 'Primary Healthcare', 4], ['Healthcare', 'Maternal and Child Health', 4]] },
  { name: 'Dr. Nandini Rao', kind: 'uni_mentor', org: 'UNIV-002', unit: 'Health Sciences', title: 'Associate Professor', years: 15, spec: 'Public Health and Telemedicine', load: 'moderate',
    bio: 'Runs rural telemedicine pilots',
    skills: [['Public Health', 5], ['Telemedicine Systems', 4]], domains: [['Healthcare', 'Telemedicine and Health Technology', 5], ['Healthcare', 'Primary Healthcare', 5]] },

  // ---- Sahyadri University of Sciences ----
  { name: 'Dr. Harish Gokhale', kind: 'uni_mentor', org: 'UNIV-003', unit: 'Civil & Water Resources', title: 'Professor', years: 24, spec: 'Groundwater and Water Conservation', load: 'full',
    bio: 'Watershed and groundwater recharge specialist',
    skills: [['Hydrology', 5], ['Water Treatment', 4], ['Environmental Impact Assessment', 3]], domains: [['Water Resources', 'Groundwater Management', 5], ['Water Resources', 'Water Conservation', 5], ['Water Resources', 'Drinking Water Access', 4]] },
  { name: 'Tanvi Sawant', kind: 'uni_student', org: 'UNIV-003', unit: 'Civil & Water Resources', bio: 'GIS analyst for watershed projects',
    skills: [['GIS Mapping', 5], ['Remote Sensing', 4], ['Hydrology', 3]], domains: [['Water Resources', 'Water Conservation', 4], ['Water Resources', 'Groundwater Management', 3]] },
  { name: "Dr. Leena D'Souza", kind: 'uni_faculty', org: 'UNIV-003', unit: 'Data Science', title: 'Professor', years: 17, spec: 'Applied Machine Learning',
    skills: [['Machine Learning', 5], ['Data Visualization', 4], ['Python Programming', 5]], domains: [['Environment', 'Environmental Monitoring', 3], ['Education', 'Digital Learning', 4], ['Healthcare', 'Diagnostics and Testing', 3]] },
  { name: 'Arjun Nair', kind: 'uni_student', org: 'UNIV-003', unit: 'Data Science', bio: 'Data analyst for livelihood programmes',
    skills: [['Python Programming', 4], ['Data Analysis', 5]], domains: [['Rural Livelihoods', 'Financial and Market Access', 3]] },
  { name: 'Dr. Shobha Kulkarni', kind: 'uni_mentor', org: 'UNIV-003', unit: 'Rural Development', title: 'Professor', years: 21, spec: 'Rural Livelihoods and Self Help Groups', load: 'moderate',
    bio: 'Works with self help groups across Pune district',
    skills: [['Community Engagement', 5], ['Project Management', 4]], domains: [['Rural Livelihoods', 'Self Help Groups', 5], ['Rural Livelihoods', 'Rural Entrepreneurship', 5], ['Rural Livelihoods', 'Skill Development', 4]] },
  { name: 'Mahesh Jadhav', kind: 'uni_student', org: 'UNIV-003', unit: 'Rural Development', bio: 'Field surveys for village development plans',
    skills: [['Community Engagement', 4]], domains: [['Rural Livelihoods', 'Rural Employment', 4], ['Agriculture', 'Agricultural Market Access', 3]] },

  // ---- TechSolutions Pvt Ltd ----
  { name: 'Riya Banerjee', kind: 'ind_employee', org: 'IND-001', unit: 'AI & Data Science', title: 'Data Scientist', years: 6,
    skills: [['Machine Learning', 5], ['Python Programming', 5], ['Data Visualization', 4]], domains: [['Healthcare', 'Diagnostics and Testing', 3], ['Education', 'Digital Learning', 4]] },
  { name: 'Vivek Sharma', kind: 'ind_expert', org: 'IND-001', unit: 'AI & Data Science', years: 14, spec: 'Computer Vision for field applications', certs: 'AWS ML Specialty; NVIDIA DLI Certified',
    skills: [['Computer Vision', 5], ['Machine Learning', 5]], domains: [['Agriculture', 'Crop Disease and Pest Management', 4], ['Urban Infrastructure', 'Traffic and Road Safety', 4]] },
  { name: 'Deepak Rane', kind: 'ind_employee', org: 'IND-001', unit: 'IoT', title: 'IoT Engineer', years: 5,
    skills: [['IoT Sensor Networks', 5], ['Embedded Systems', 4]], domains: [['Environment', 'Environmental Monitoring', 4], ['Water Resources', 'Water Quality', 3]] },
  { name: 'Sanya Malhotra', kind: 'ind_employee', org: 'IND-001', unit: 'Product Engineering', title: 'Full-Stack Engineer', years: 7,
    skills: [['Web Development', 5], ['Mobile App Development', 5]], domains: [['Public Administration', 'Citizen Grievance Management', 5], ['Public Administration', 'Civic Information Access', 4]] },
  { name: 'Ravi Kulkarni', kind: 'ind_mentor', org: 'IND-001', unit: 'Product Engineering', title: 'Engineering Manager', years: 15, spec: 'Delivery, Web Platforms and Security', load: 'light',
    bio: 'Mentors teams shipping civic-tech products',
    skills: [['Project Management', 5], ['Web Development', 4], ['Cybersecurity', 3]], domains: [['Public Administration', 'Public Service Delivery', 4]] },

  // ---- GreenEnergy Corp ----
  { name: 'Manoj Tiwari', kind: 'ind_employee', org: 'IND-002', unit: 'Renewable Energy', title: 'Solar Design Engineer', years: 8,
    skills: [['Solar PV Design', 5], ['Energy Auditing', 4]], domains: [['Energy', 'Renewable Energy', 5], ['Energy', 'Electricity Access', 4]] },
  { name: 'Dr. Ananya Ghosh', kind: 'ind_expert', org: 'IND-002', unit: 'Renewable Energy', years: 16, spec: 'Solar and Energy Efficiency', certs: 'Certified Energy Auditor (BEE)',
    skills: [['Solar PV Design', 5], ['Energy Auditing', 5]], domains: [['Energy', 'Energy Efficiency', 5], ['Energy', 'Clean Cooking Energy', 3], ['Energy', 'Power Reliability', 4]] },
  { name: 'Suresh Bhat', kind: 'ind_mentor', org: 'IND-002', unit: 'Renewable Energy', title: 'Head of Projects', years: 20, spec: 'Rural Renewable Energy Projects', load: 'moderate',
    bio: 'Has delivered village solar microgrids',
    skills: [['Project Management', 5], ['Solar PV Design', 4]], domains: [['Energy', 'Renewable Energy', 5], ['Rural Livelihoods', 'Rural Entrepreneurship', 3]] },
  { name: 'Priyanka Shah', kind: 'ind_employee', org: 'IND-002', unit: 'Sustainability & CSR', title: 'CSR Programme Manager', years: 6,
    skills: [['Community Engagement', 5], ['Environmental Impact Assessment', 4]], domains: [['Environment', 'Climate Resilience', 4], ['Sanitation', 'Solid Waste Management', 3]] },
  { name: 'Kunal Verma', kind: 'ind_mentor', org: 'IND-002', unit: 'Sustainability & CSR', title: 'Sustainability Lead', years: 12, spec: 'Waste and Circular Economy', load: 'light',
    bio: 'Runs municipal waste-segregation programmes',
    skills: [['Waste Management', 5], ['Environmental Impact Assessment', 4], ['Community Engagement', 4]], domains: [['Sanitation', 'Solid Waste Management', 5], ['Sanitation', 'Public Hygiene', 4]] },

  // ---- AquaTech Infra Ltd ----
  { name: 'Dinesh Patwardhan', kind: 'ind_expert', org: 'IND-003', unit: 'Water Treatment', years: 18, spec: 'Drinking Water and Wastewater Treatment', certs: 'Certified Water Treatment Professional',
    skills: [['Water Treatment', 5], ['Hydrology', 3]], domains: [['Water Resources', 'Water Quality', 5], ['Water Resources', 'Drinking Water Access', 5], ['Sanitation', 'Sewage and Wastewater', 4]] },
  { name: 'Shweta Pillai', kind: 'ind_employee', org: 'IND-003', unit: 'Water Treatment', title: 'Process Engineer', years: 4,
    skills: [['Water Treatment', 4], ['Data Analysis', 3], ['IoT Sensor Networks', 3]], domains: [['Water Resources', 'Water Supply Infrastructure', 4]] },
  { name: 'Rakesh Menon', kind: 'ind_mentor', org: 'IND-003', unit: 'Water Treatment', title: 'Plant Director', years: 22, spec: 'Treatment Plant Operations', load: 'moderate',
    bio: 'Operates municipal treatment plants',
    skills: [['Water Treatment', 5], ['Project Management', 4]], domains: [['Water Resources', 'Water Quality', 5], ['Sanitation', 'Sewage and Wastewater', 5]] },
  { name: 'Aarti Nambiar', kind: 'ind_employee', org: 'IND-003', unit: 'Smart Infrastructure', title: 'Infrastructure Engineer', years: 6,
    skills: [['Civil Engineering', 4], ['GIS Mapping', 4], ['Stormwater Management', 4]], domains: [['Urban Infrastructure', 'Public Infrastructure', 4], ['Water Resources', 'Flood Management', 4]] },
  { name: 'Dr. Gaurav Sinha', kind: 'ind_expert', org: 'IND-003', unit: 'Smart Infrastructure', years: 17, spec: 'Urban Flood Modelling', certs: 'Chartered Engineer (India)',
    skills: [['Stormwater Management', 5], ['Flood Modelling', 5], ['Hydrology', 4]], domains: [['Water Resources', 'Flood Management', 5], ['Sanitation', 'Drainage and Waterlogging', 5], ['Environment', 'Climate Resilience', 4]] },
]

// People already in the database from seed.ts -- they get a unit and domain claims, nothing else changes.
const EXISTING: { email: string; org: string; unit: string; load?: Load; domains: [string, string, number][] }[] = [
  { email: 'priya.student@abcit.edu.in', org: 'UNIV-001', unit: 'Computer Science', domains: [['Environment', 'Environmental Monitoring', 3], ['Water Resources', 'Flood Management', 3]] },
  { email: 'dr.sharma@abcit.edu.in', org: 'UNIV-001', unit: 'Civil Engineering', load: 'moderate', domains: [['Water Resources', 'Flood Management', 5], ['Water Resources', 'Groundwater Management', 4]] },
  { email: 'coordinator@abcit.edu.in', org: 'UNIV-001', unit: 'Computer Science', domains: [['Environment', 'Climate Resilience', 3]] },
  { email: 'amit.engineer@techsolutions.com', org: 'IND-001', unit: 'IoT', domains: [['Environment', 'Environmental Monitoring', 4]] },
  { email: 'sunita.mentor@techsolutions.com', org: 'IND-001', unit: 'IoT', load: 'light', domains: [['Environment', 'Environmental Monitoring', 5], ['Water Resources', 'Water Quality', 4]] },
]

const LOAD_TO_CURRENT: Record<Load, number> = { light: 1, moderate: 3, full: 4 }
const MAX_CAPACITY = 4

function slug(name: string) {
  return name.toLowerCase().replace(/^(dr|prof)\.?\s+/, '').replace(/[^a-z\s]/g, '').trim().split(/\s+/).join('.')
}

async function main() {
  console.log('Seeding organization units, domains and people...')

  // Master data: domains and subdomains from the AI taxonomy so the two never drift apart.
  const taxonomy = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '../ai/data/taxonomy.json'), 'utf8')) as
    Record<string, { description?: string; subdomains: Record<string, unknown> }>
  const domainId = new Map<string, string>()
  const subdomainId = new Map<string, string>()
  for (const [name, info] of Object.entries(taxonomy)) {
    const domain = await prisma.domain.upsert({ where: { name }, update: { description: info.description }, create: { name, description: info.description } })
    domainId.set(name, domain.id)
    for (const sub of Object.keys(info.subdomains)) {
      const existing = await prisma.subdomain.findFirst({ where: { domainId: domain.id, name: sub } })
      const row = existing ?? (await prisma.subdomain.create({ data: { domainId: domain.id, name: sub } }))
      subdomainId.set(`${name}/${sub}`, row.id)
    }
  }
  console.log(`  domains: ${domainId.size}, subdomains: ${subdomainId.size}`)

  for (const [name, domain, category] of EXTRA_SKILLS) {
    await prisma.skill.upsert({ where: { name }, update: {}, create: { name, domain, category } })
  }
  const skillId = new Map((await prisma.skill.findMany()).map((s) => [s.name, s.id]))

  // Organizations: the two universities and two industries from seed.ts already exist; add a third of each.
  for (const u of NEW_ORGS.universities) {
    await prisma.university.upsert({
      where: { registrationNumber: u.registrationNumber }, update: {},
      create: { ...u, state: 'Maharashtra', verificationStatus: VerificationStatus.VERIFIED },
    })
  }
  for (const i of NEW_ORGS.industries) {
    await prisma.industry.upsert({
      where: { registrationNumber: i.registrationNumber }, update: {},
      create: { ...i, state: 'Maharashtra', verificationStatus: VerificationStatus.VERIFIED },
    })
  }
  const universities = new Map((await prisma.university.findMany()).map((u) => [u.registrationNumber, u]))
  const industries = new Map((await prisma.industry.findMany()).map((i) => [i.registrationNumber, i]))
  const orgOf = (reg: string) => {
    const uni = universities.get(reg)
    if (uni) return { kind: 'university' as const, id: uni.id, regionId: uni.regionId }
    const ind = industries.get(reg)
    if (ind) return { kind: 'industry' as const, id: ind.id, regionId: ind.regionId }
    throw new Error(`Organization ${reg} not found -- run "npm run db:seed" first`)
  }

  const unitId = new Map<string, string>() // `${reg}/${unit name}`
  for (const [reg, { type, names }] of Object.entries(UNITS)) {
    const org = orgOf(reg)
    for (const name of names) {
      const where = org.kind === 'university' ? { universityId: org.id, name } : { industryId: org.id, name }
      const existing = await prisma.organizationUnit.findFirst({ where })
      const unit = existing ?? (await prisma.organizationUnit.create({ data: { type, ...where } }))
      unitId.set(`${reg}/${name}`, unit.id)
    }
  }
  console.log(`  units: ${unitId.size}`)

  async function claimDomains(userId: string, claims: [string, string, number][]) {
    for (const [domain, sub, proficiency] of claims) {
      const dId = domainId.get(domain)
      const sId = subdomainId.get(`${domain}/${sub}`)
      if (!dId || !sId) throw new Error(`Unknown domain/subdomain: ${domain}/${sub}`)
      const existing = await prisma.memberDomainClaim.findFirst({ where: { userId, domainId: dId, subdomainId: sId } })
      if (existing) await prisma.memberDomainClaim.update({ where: { id: existing.id }, data: { proficiency } })
      else await prisma.memberDomainClaim.create({ data: { userId, domainId: dId, subdomainId: sId, proficiency, source: 'seed' } })
    }
  }

  async function assignSkills(userId: string, skills: [string, number][]) {
    for (const [name, proficiency] of skills) {
      const sId = skillId.get(name)
      if (!sId) throw new Error(`Unknown skill: ${name}`)
      await prisma.userSkill.upsert({
        where: { userId_skillId: { userId, skillId: sId } },
        update: { proficiency },
        create: { userId, skillId: sId, proficiency },
      })
    }
  }

  // Existing people: attach to a unit and add domain claims.
  for (const e of EXISTING) {
    const user = await prisma.user.findUnique({ where: { email: e.email } })
    if (!user) { console.warn(`  skipped ${e.email} (not in database)`); continue }
    const uId = unitId.get(`${e.org}/${e.unit}`)!
    const data = { unitId: uId }
    await prisma.universityStudent.updateMany({ where: { userId: user.id }, data })
    await prisma.universityFaculty.updateMany({ where: { userId: user.id }, data })
    await prisma.universityMentor.updateMany({ where: { userId: user.id }, data: { ...data, maxCapacity: MAX_CAPACITY, ...(e.load && { currentLoad: LOAD_TO_CURRENT[e.load] }) } })
    await prisma.industryEmployee.updateMany({ where: { userId: user.id }, data })
    await prisma.industryMentor.updateMany({ where: { userId: user.id }, data: { ...data, maxCapacity: MAX_CAPACITY, ...(e.load && { currentLoad: LOAD_TO_CURRENT[e.load] }) } })
    await prisma.industryExpert.updateMany({ where: { userId: user.id }, data })
    await claimDomains(user.id, e.domains)
  }

  // New people.
  const passwordHash = await bcrypt.hash('password123', 10)
  const roleOf: Record<Kind, UserRole> = {
    uni_student: UserRole.STUDENT, uni_faculty: UserRole.FACULTY, uni_mentor: UserRole.MENTOR,
    ind_employee: UserRole.INDUSTRY_EMPLOYEE, ind_mentor: UserRole.MENTOR, ind_expert: UserRole.INDUSTRY_EXPERT,
  }
  let counter = 0
  for (const p of PEOPLE) {
    counter += 1
    const org = orgOf(p.org)
    const email = `${slug(p.name)}@${EMAIL_DOMAIN[p.org]}`
    const uId = unitId.get(`${p.org}/${p.unit}`)!
    const user = await prisma.user.upsert({
      where: { email }, update: {},
      create: { name: p.name, email, passwordHash, role: roleOf[p.kind], accountStatus: AccountStatus.ACTIVE, regionId: org.regionId, location: 'Maharashtra' },
    })
    const common = { unitId: uId, department: p.unit }
    const mentorLoad = { maxCapacity: MAX_CAPACITY, currentLoad: LOAD_TO_CURRENT[p.load ?? 'moderate'] }
    const code = String(counter).padStart(3, '0')

    if (p.kind === 'uni_student') {
      await prisma.universityStudent.upsert({
        where: { userId: user.id }, update: { unitId: uId },
        create: { userId: user.id, universityId: org.id, ...common, rollNumber: `${p.org.replace('-', '')}-2022-${code}`, course: `B.Tech ${p.unit}`, year: 3, graduationYear: 2027, cgpa: 8.2, bio: p.bio },
      })
    } else if (p.kind === 'uni_faculty') {
      await prisma.universityFaculty.upsert({
        where: { userId: user.id }, update: { unitId: uId },
        create: { userId: user.id, universityId: org.id, ...common, designation: p.title!, specialization: p.spec, experienceYears: p.years!, bio: p.bio },
      })
    } else if (p.kind === 'uni_mentor') {
      await prisma.universityMentor.upsert({
        where: { userId: user.id }, update: { unitId: uId, ...mentorLoad },
        create: { userId: user.id, universityId: org.id, ...common, ...mentorLoad, designation: p.title!, specialization: p.spec, experienceYears: p.years!, bio: p.bio },
      })
    } else if (p.kind === 'ind_employee') {
      await prisma.industryEmployee.upsert({
        where: { userId: user.id }, update: { unitId: uId },
        create: { userId: user.id, industryId: org.id, ...common, employeeCode: `EMP-${code}`, designation: p.title!, experienceYears: p.years! },
      })
    } else if (p.kind === 'ind_mentor') {
      await prisma.industryMentor.upsert({
        where: { userId: user.id }, update: { unitId: uId, ...mentorLoad },
        create: { userId: user.id, industryId: org.id, ...common, ...mentorLoad, designation: p.title!, expertise: p.spec!, experienceYears: p.years!, bio: p.bio },
      })
    } else {
      await prisma.industryExpert.upsert({
        where: { userId: user.id }, update: { unitId: uId },
        create: { userId: user.id, industryId: org.id, unitId: uId, expertise: p.spec!, certifications: p.certs, experienceYears: p.years! },
      })
    }
    await assignSkills(user.id, p.skills)
    await claimDomains(user.id, p.domains)
  }
  console.log(`  people: ${PEOPLE.length} new + ${EXISTING.length} existing linked`)
  console.log('Done. Demo logins use the password "password123".')
}

main()
  .catch((error) => { console.error(error); process.exit(1) })
  .finally(() => prisma.$disconnect())
