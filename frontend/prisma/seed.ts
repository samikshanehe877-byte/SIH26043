import { PrismaClient, UserRole, AccountStatus, VerificationStatus, ProblemStatus, ProblemType, ProblemGiverType, ProjectStatus, ProjectMemberRole, EvidenceType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create regions
  const region1 = await prisma.region.upsert({
    where: { id: 'region-1' },
    update: {},
    create: {
      id: 'region-1',
      name: 'Pune Metropolitan Region',
      district: 'Pune',
      state: 'Maharashtra',
    },
  })

  const region2 = await prisma.region.upsert({
    where: { id: 'region-2' },
    update: {},
    create: {
      id: 'region-2',
      name: 'Mumbai Metropolitan Region',
      district: 'Mumbai',
      state: 'Maharashtra',
    },
  })

  console.log('✅ Regions created')

  // Create universities
  const university1 = await prisma.university.upsert({
    where: { registrationNumber: 'UNIV-001' },
    update: {},
    create: {
      name: 'ABC Institute of Technology',
      registrationNumber: 'UNIV-001',
      description: 'Leading engineering institute in Pune',
      website: 'https://abcit.edu.in',
      email: 'contact@abcit.edu.in',
      phone: '+91-20-12345678',
      address: 'Survey No. 123, Pune-Nagar Road',
      district: 'Pune',
      state: 'Maharashtra',
      verificationStatus: VerificationStatus.VERIFIED,
      regionId: region1.id,
    },
  })

  const university2 = await prisma.university.upsert({
    where: { registrationNumber: 'UNIV-002' },
    update: {},
    create: {
      name: 'XYZ University of Engineering',
      registrationNumber: 'UNIV-002',
      description: 'Premier technology university',
      website: 'https://xyzuniv.edu.in',
      email: 'info@xyzuniv.edu.in',
      phone: '+91-22-87654321',
      address: 'Tech Park, Andheri East',
      district: 'Mumbai',
      state: 'Maharashtra',
      verificationStatus: VerificationStatus.VERIFIED,
      regionId: region2.id,
    },
  })

  console.log('✅ Universities created')

  // Create industries
  const industry1 = await prisma.industry.upsert({
    where: { registrationNumber: 'IND-001' },
    update: {},
    create: {
      companyName: 'TechSolutions Pvt Ltd',
      registrationNumber: 'IND-001',
      industryType: 'Information Technology',
      description: 'Software development and IT consulting',
      website: 'https://techsolutions.com',
      email: 'hr@techsolutions.com',
      phone: '+91-20-23456789',
      address: 'Hinjewadi IT Park, Phase 1',
      district: 'Pune',
      state: 'Maharashtra',
      verificationStatus: VerificationStatus.VERIFIED,
      regionId: region1.id,
    },
  })

  const industry2 = await prisma.industry.upsert({
    where: { registrationNumber: 'IND-002' },
    update: {},
    create: {
      companyName: 'GreenEnergy Corp',
      registrationNumber: 'IND-002',
      industryType: 'Renewable Energy',
      description: 'Solar and wind energy solutions',
      website: 'https://greenenergy.com',
      email: 'careers@greenenergy.com',
      phone: '+91-22-34567890',
      address: 'Bandra Kurla Complex',
      district: 'Mumbai',
      state: 'Maharashtra',
      verificationStatus: VerificationStatus.VERIFIED,
      regionId: region2.id,
    },
  })

  console.log('✅ Industries created')

  // Create government
  const government1 = await prisma.government.upsert({
    where: { id: 'gov-1' },
    update: {},
    create: {
      id: 'gov-1',
      name: 'Maharashtra State Government',
      department: 'Department of Rural Development',
      level: 'STATE',
      email: 'ruraldev@maharashtra.gov.in',
      phone: '+91-22-22612345',
      address: 'Mantralaya, Mumbai',
      district: 'Mumbai',
      state: 'Maharashtra',
      verificationStatus: VerificationStatus.VERIFIED,
      regionId: region1.id,
    },
  })

  console.log('✅ Government created')

  // Create users
  const passwordHash = await bcrypt.hash('password123', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sih.gov.in' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@sih.gov.in',
      passwordHash,
      phone: '+91-9876543210',
      role: UserRole.ADMIN,
      accountStatus: AccountStatus.ACTIVE,
      regionId: region1.id,
    },
  })

  const citizenUser = await prisma.user.upsert({
    where: { email: 'rahul.citizen@example.com' },
    update: {},
    create: {
      name: 'Rahul Sharma',
      email: 'rahul.citizen@example.com',
      passwordHash,
      phone: '+91-9876543211',
      role: UserRole.CITIZEN,
      accountStatus: AccountStatus.ACTIVE,
      location: 'Pune',
      regionId: region1.id,
    },
  })

  const studentUser = await prisma.user.upsert({
    where: { email: 'priya.student@abcit.edu.in' },
    update: {},
    create: {
      name: 'Priya Patel',
      email: 'priya.student@abcit.edu.in',
      passwordHash,
      phone: '+91-9876543212',
      role: UserRole.STUDENT,
      accountStatus: AccountStatus.ACTIVE,
      location: 'Pune',
      regionId: region1.id,
    },
  })

  const mentorUser = await prisma.user.upsert({
    where: { email: 'dr.sharma@abcit.edu.in' },
    update: {},
    create: {
      name: 'Dr. Anil Sharma',
      email: 'dr.sharma@abcit.edu.in',
      passwordHash,
      phone: '+91-9876543213',
      role: UserRole.MENTOR,
      accountStatus: AccountStatus.ACTIVE,
      location: 'Pune',
      regionId: region1.id,
    },
  })

  const industryEmployeeUser = await prisma.user.upsert({
    where: { email: 'amit.engineer@techsolutions.com' },
    update: {},
    create: {
      name: 'Amit Kumar',
      email: 'amit.engineer@techsolutions.com',
      passwordHash,
      phone: '+91-9876543214',
      role: UserRole.INDUSTRY_EMPLOYEE,
      accountStatus: AccountStatus.ACTIVE,
      location: 'Pune',
      regionId: region1.id,
    },
  })

  const industryMentorUser = await prisma.user.upsert({
    where: { email: 'sunita.mentor@techsolutions.com' },
    update: {},
    create: {
      name: 'Sunita Reddy',
      email: 'sunita.mentor@techsolutions.com',
      passwordHash,
      phone: '+91-9876543215',
      role: UserRole.INDUSTRY_MENTOR,
      accountStatus: AccountStatus.ACTIVE,
      location: 'Pune',
      regionId: region1.id,
    },
  })

  const govOfficerUser = await prisma.user.upsert({
    where: { email: 'officer.patil@maharashtra.gov.in' },
    update: {},
    create: {
      name: 'Officer Rajesh Patil',
      email: 'officer.patil@maharashtra.gov.in',
      passwordHash,
      phone: '+91-9876543216',
      role: UserRole.GOVERNMENT_OFFICER,
      accountStatus: AccountStatus.ACTIVE,
      location: 'Pune',
      regionId: region1.id,
    },
  })

  console.log('✅ Users created')

  // Create university student
  await prisma.universityStudent.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      universityId: university1.id,
      rollNumber: 'ABC2021001',
      course: 'B.Tech Computer Science',
      department: 'Computer Science',
      year: 3,
      graduationYear: 2025,
      cgpa: 8.5,
      bio: 'Passionate about environmental tech solutions',
    },
  })

  // Create university mentor
  await prisma.universityMentor.upsert({
    where: { userId: mentorUser.id },
    update: {},
    create: {
      userId: mentorUser.id,
      universityId: university1.id,
      department: 'Civil Engineering',
      designation: 'Professor',
      specialization: 'Water Resources Engineering',
      experienceYears: 15,
      bio: 'Expert in flood management and water systems',
    },
  })

  // Create industry employee
  await prisma.industryEmployee.upsert({
    where: { userId: industryEmployeeUser.id },
    update: {},
    create: {
      userId: industryEmployeeUser.id,
      industryId: industry1.id,
      employeeCode: 'EMP-2020-001',
      designation: 'Senior Software Engineer',
      department: 'R&D',
      experienceYears: 5,
    },
  })

  // Create industry mentor
  await prisma.industryMentor.upsert({
    where: { userId: industryMentorUser.id },
    update: {},
    create: {
      userId: industryMentorUser.id,
      industryId: industry1.id,
      designation: 'Technical Lead',
      department: 'IoT Solutions',
      expertise: 'Sensor Networks, Environmental Monitoring',
      experienceYears: 10,
      bio: 'Leads IoT projects for smart city infrastructure',
    },
  })

  // Create government officer
  await prisma.governmentOfficer.upsert({
    where: { userId: govOfficerUser.id },
    update: {},
    create: {
      userId: govOfficerUser.id,
      governmentId: government1.id,
      designation: 'Deputy Director',
      department: 'Rural Water Supply',
      jurisdiction: 'Pune District',
    },
  })

  console.log('✅ User profiles created')

  // Create skills
  const skills = [
    { name: 'GIS Mapping', domain: 'Geospatial', category: 'Technical' },
    { name: 'Remote Sensing', domain: 'Geospatial', category: 'Technical' },
    { name: 'Civil Engineering', domain: 'Engineering', category: 'Technical' },
    { name: 'Flood Modelling', domain: 'Environmental', category: 'Technical' },
    { name: 'IoT Sensor Networks', domain: 'IoT', category: 'Technical' },
    { name: 'Data Analysis', domain: 'Data Science', category: 'Technical' },
    { name: 'Project Management', domain: 'Management', category: 'Soft Skill' },
    { name: 'Community Engagement', domain: 'Social', category: 'Soft Skill' },
    { name: 'Python Programming', domain: 'Programming', category: 'Technical' },
    { name: 'Environmental Impact Assessment', domain: 'Environmental', category: 'Technical' },
  ]

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    })
  }

  console.log('✅ Skills created')

  // Assign skills to users
  const gisSkill = await prisma.skill.findUnique({ where: { name: 'GIS Mapping' } })
  const remoteSkill = await prisma.skill.findUnique({ where: { name: 'Remote Sensing' } })
  const civilSkill = await prisma.skill.findUnique({ where: { name: 'Civil Engineering' } })
  const floodSkill = await prisma.skill.findUnique({ where: { name: 'Flood Modelling' } })
  const iotSkill = await prisma.skill.findUnique({ where: { name: 'IoT Sensor Networks' } })
  const pythonSkill = await prisma.skill.findUnique({ where: { name: 'Python Programming' } })

  if (gisSkill) await prisma.userSkill.upsert({ where: { userId_skillId: { userId: studentUser.id, skillId: gisSkill.id } }, update: {}, create: { userId: studentUser.id, skillId: gisSkill.id, proficiency: 4, experienceYears: 2 } })
  if (remoteSkill) await prisma.userSkill.upsert({ where: { userId_skillId: { userId: studentUser.id, skillId: remoteSkill.id } }, update: {}, create: { userId: studentUser.id, skillId: remoteSkill.id, proficiency: 3, experienceYears: 1 } })
  if (pythonSkill) await prisma.userSkill.upsert({ where: { userId_skillId: { userId: studentUser.id, skillId: pythonSkill.id } }, update: {}, create: { userId: studentUser.id, skillId: pythonSkill.id, proficiency: 5, experienceYears: 3 } })

  if (civilSkill) await prisma.userSkill.upsert({ where: { userId_skillId: { userId: mentorUser.id, skillId: civilSkill.id } }, update: {}, create: { userId: mentorUser.id, skillId: civilSkill.id, proficiency: 5, experienceYears: 15 } })
  if (floodSkill) await prisma.userSkill.upsert({ where: { userId_skillId: { userId: mentorUser.id, skillId: floodSkill.id } }, update: {}, create: { userId: mentorUser.id, skillId: floodSkill.id, proficiency: 5, experienceYears: 12 } })

  if (iotSkill) await prisma.userSkill.upsert({ where: { userId_skillId: { userId: industryEmployeeUser.id, skillId: iotSkill.id } }, update: {}, create: { userId: industryEmployeeUser.id, skillId: iotSkill.id, proficiency: 4, experienceYears: 4 } })
  if (pythonSkill) await prisma.userSkill.upsert({ where: { userId_skillId: { userId: industryEmployeeUser.id, skillId: pythonSkill.id } }, update: {}, create: { userId: industryEmployeeUser.id, skillId: pythonSkill.id, proficiency: 5, experienceYears: 5 } })

  console.log('✅ User skills assigned')

  // Create a problem
  const problem = await prisma.problem.create({
    data: {
      title: 'Recurring Flooding in Khadakwasla Village',
      description: 'Annual monsoon flooding affects 500+ households in Khadakwasla village. Need sustainable drainage and early warning system.',
      problemType: ProblemType.HYBRID,
      domain: 'Environment',
      subdomain: 'Water Management',
      ownerUserId: citizenUser.id,
      regionId: region1.id,
      district: 'Pune',
      state: 'Maharashtra',
      latitude: 18.4232,
      longitude: 73.8045,
      impactLevel: 4,
      urgency: 4,
      status: ProblemStatus.VERIFIED,
      rawInput: 'Our village floods every monsoon. Water enters homes, destroys crops. Need help.',
      problemNature: ProblemType.HYBRID,
      affectedArea: 'Khadakwasla Village, Pune District',
      affectedPopulation: '500+ households (~2500 people)',
      frequency: 'Annual (June-September)',
      requiredCapabilities: ['GIS Mapping', 'Civil Engineering', 'IoT Sensor Networks', 'Flood Modelling'],
      suggestedIntervention: 'Install IoT water level sensors, create drainage master plan, develop early warning mobile app',
      problemGiverType: ProblemGiverType.COMMUNITY_GROUP,
      communityGroupName: 'Khadakwasla Gram Panchayat',
      confirmedByGiver: true,
    },
  })

  // Add problem skills
  for (const skillName of ['GIS Mapping', 'Remote Sensing', 'Civil Engineering', 'Flood Modelling', 'IoT Sensor Networks']) {
    const skill = await prisma.skill.findUnique({ where: { name: skillName } })
    if (skill) {
      await prisma.problemSkill.create({
        data: { problemId: problem.id, skillId: skill.id, required: true },
      })
    }
  }

  console.log('✅ Problem created with skills')

  // Create matches
  await prisma.match.create({
    data: {
      problemId: problem.id,
      userId: studentUser.id,
      organizationId: university1.id,
      organizationType: 'UNIVERSITY',
      matchScore: 91.5,
      semanticScore: 88,
      skillScore: 92,
      regionalScore: 95,
      experienceScore: 70,
      reason: 'Same region, environmental engineering expertise, previous flood-management project, student team available, faculty mentor available',
      status: 'PENDING',
    },
  })

  await prisma.match.create({
    data: {
      problemId: problem.id,
      userId: industryEmployeeUser.id,
      organizationId: industry1.id,
      organizationType: 'INDUSTRY',
      matchScore: 87.2,
      semanticScore: 85,
      skillScore: 90,
      regionalScore: 95,
      experienceScore: 75,
      reason: 'Same region, IoT expertise, sensor network experience, industry mentor available',
      status: 'PENDING',
    },
  })

  console.log('✅ Matches created')

  // Create project
  const project = await prisma.project.create({
    data: {
      problemId: problem.id,
      title: 'Khadakwasla Flood Mitigation Project',
      description: 'Multi-stakeholder project to implement IoT-based early warning system and drainage improvements',
      status: ProjectStatus.PLANNING,
      createdBy: adminUser.id,
      universityId: university1.id,
      industryId: industry1.id,
    },
  })

  // Add project members
  await prisma.projectMember.create({
    data: {
      projectId: project.id,
      userId: studentUser.id,
      role: ProjectMemberRole.STUDENT,
      organizationType: 'UNIVERSITY',
      organizationId: university1.id,
    },
  })

  await prisma.projectMember.create({
    data: {
      projectId: project.id,
      userId: mentorUser.id,
      role: ProjectMemberRole.UNIVERSITY_MENTOR,
      organizationType: 'UNIVERSITY',
      organizationId: university1.id,
    },
  })

  await prisma.projectMember.create({
    data: {
      projectId: project.id,
      userId: industryEmployeeUser.id,
      role: ProjectMemberRole.INDUSTRY_ENGINEER,
      organizationType: 'INDUSTRY',
      organizationId: industry1.id,
    },
  })

  await prisma.projectMember.create({
    data: {
      projectId: project.id,
      userId: industryMentorUser.id,
      role: ProjectMemberRole.INDUSTRY_MENTOR,
      organizationType: 'INDUSTRY',
      organizationId: industry1.id,
    },
  })

  await prisma.projectMember.create({
    data: {
      projectId: project.id,
      userId: citizenUser.id,
      role: ProjectMemberRole.PROBLEM_OWNER,
      organizationType: 'COMMUNITY',
      organizationId: 'community-khadakwasla',
    },
  })

  console.log('✅ Project with members created')

  // Create collaboration
  await prisma.collaboration.create({
    data: {
      problemId: problem.id,
      universityId: university1.id,
      industryId: industry1.id,
      governmentId: government1.id,
      status: 'PROPOSED',
      proposedBy: adminUser.id,
      description: 'Tri-party collaboration for flood mitigation in Khadakwasla',
    },
  })

  console.log('✅ Collaboration created')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })