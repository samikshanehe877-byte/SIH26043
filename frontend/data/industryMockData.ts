import { IndustryDashboardData, ProjectMilestone } from "@/types/industry";

const defaultMilestones: ProjectMilestone[] = [
  { label: "Problem Accepted", desc: "Challenge assigned" },
  { label: "Team Created", desc: "Students grouped" },
  { label: "Development Started", desc: "Initial coding" },
  { label: "Industry Support Required", desc: "Collaboration requested" },
  { label: "Testing", desc: "QA phase" },
  { label: "Completion", desc: "Project finished" },
];

export const industryMockData: IndustryDashboardData = {
  company: {
    id: "ind-001",
    name: "TechNova Solutions",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TechNova",
    industryDomain: "Cloud & AI Services",
    website: "https://technova.example.com",
    description: "Leading provider of scalable cloud infrastructure and AI integration tools.",
    location: "Bangalore, India",
    contactEmail: "partnerships@technova.example.com",
    contactPhone: "+91-9876543210",
    expertise: {
      technologies: ["AI / ML", "Data Science", "Cloud Computing", "IoT", "Computer Vision"],
      domains: ["Smart Cities", "Healthcare", "Education"]
    },
    resources: [
      { type: "Cloud Credits", available: true, description: "$10,000 AWS credits per project" },
      { type: "APIs", available: true, description: "Access to TechNova NLP & Vision APIs" },
      { type: "Technical Experts", available: true, description: "1 hour weekly mentoring" },
      { type: "Datasets", available: true, description: "Anonymized smart city traffic data" },
    ]
  },
  requests: [
    {
      id: "req-101",
      challengeTitle: "Smart Traffic Light Optimization",
      problemDescription: "Current traffic lights cause congestion. Need an AI-based dynamic timing system.",
      category: "Infrastructure",
      expectedOutcome: "A functioning prototype of a smart traffic control system using CCTV feeds.",
      university: {
        id: "uni-1",
        name: "Bharati Vidyapeeth",
        department: "Computer Engineering",
        location: "Pune, India"
      },
      mentor: {
        id: "mnt-1",
        name: "Prof. Rajesh Kumar",
        department: "Computer Engineering",
        expertise: ["AI", "Algorithms"]
      },
      studentTeam: {
        id: "tm-1",
        name: "TrafficBusters",
        size: 5,
        skills: ["Python", "TensorFlow", "React"]
      },
      aiAnalysis: {
        problemCategory: "Smart City",
        requiredSkills: ["Computer Vision", "Machine Learning"],
        suggestedTechnologies: ["Python", "YOLOv8", "AWS"],
        difficulty: "High",
        suggestedSupportRequirements: ["Cloud Resources", "Dataset"],
        matchScore: 92,
        matchingSkills: ["AI / ML", "Computer Vision", "Cloud Computing"]
      },
      requestedSupportTypes: ["Cloud Resources", "Dataset", "Mentorship"],
      whySupportIsNeeded: "The team requires significant computational power to train the CV models and realistic traffic datasets which are hard to acquire.",
      expectedIndustryContribution: "Provide AWS credits for model training and access to traffic datasets.",
      projectProgress: 35,
      currentMilestoneIndex: 3,
      milestones: defaultMilestones,
      requestDate: "2026-09-08",
      status: "Received"
    },
    {
      id: "req-102",
      challengeTitle: "Rural Telemedicine App",
      problemDescription: "Lack of basic medical advice in remote areas.",
      category: "Healthcare",
      expectedOutcome: "A lightweight mobile app that works on low bandwidth.",
      university: {
        id: "uni-2",
        name: "Delhi Technological University",
        department: "Software Engineering",
        location: "New Delhi, India"
      },
      mentor: {
        id: "mnt-2",
        name: "Dr. Sneha Patel",
        department: "Software Engineering",
        expertise: ["Mobile Dev", "Healthcare Systems"]
      },
      studentTeam: {
        id: "tm-2",
        name: "HealthConnect",
        size: 4,
        skills: ["Flutter", "Firebase", "Node.js"]
      },
      aiAnalysis: {
        problemCategory: "Healthcare",
        requiredSkills: ["Mobile Development", "Backend API"],
        suggestedTechnologies: ["Flutter", "WebRTC"],
        difficulty: "Medium",
        suggestedSupportRequirements: ["API", "Domain Expert"],
        matchScore: 65,
        matchingSkills: ["Cloud Computing"]
      },
      requestedSupportTypes: ["API", "Technical Expertise"],
      whySupportIsNeeded: "Need an enterprise-grade video conferencing API to integrate into the app.",
      expectedIndustryContribution: "Provide access to a commercial video API and guidance on WebRTC.",
      projectProgress: 50,
      currentMilestoneIndex: 3,
      milestones: defaultMilestones,
      requestDate: "2026-09-07",
      status: "Under Review"
    },
    {
      id: "req-103",
      challengeTitle: "Crop Disease Detection",
      problemDescription: "Farmers lose crops due to late detection of leaf diseases.",
      category: "Agriculture",
      expectedOutcome: "An image classification model accessible via SMS bot.",
      university: {
        id: "uni-3",
        name: "IIT Bombay",
        department: "Computer Science",
        location: "Mumbai, India"
      },
      mentor: {
        id: "mnt-3",
        name: "Prof. Anil Desai",
        department: "Computer Science",
        expertise: ["Deep Learning"]
      },
      studentTeam: {
        id: "tm-3",
        name: "AgriVision",
        size: 6,
        skills: ["PyTorch", "FastAPI"]
      },
      aiAnalysis: {
        problemCategory: "Agriculture",
        requiredSkills: ["Computer Vision", "NLP"],
        suggestedTechnologies: ["PyTorch", "Twilio API"],
        difficulty: "Medium",
        suggestedSupportRequirements: ["Cloud Resources"],
        matchScore: 80,
        matchingSkills: ["AI / ML", "Computer Vision"]
      },
      requestedSupportTypes: ["Cloud Resources"],
      whySupportIsNeeded: "Need GPU instances for training the ResNet models.",
      expectedIndustryContribution: "GPU cloud instances.",
      projectProgress: 20,
      currentMilestoneIndex: 2,
      milestones: defaultMilestones,
      requestDate: "2026-09-05",
      status: "Clarification Needed"
    }
  ],
  collaborations: [
    {
      id: "col-201",
      requestId: "req-099",
      challengeTitle: "Smart Water Management System",
      problemDescription: "Water wastage due to lack of monitoring in urban residential areas.",
      category: "Environment / Water Management",
      university: {
        id: "uni-1",
        name: "Bharati Vidyapeeth",
        department: "Computer Engineering",
        location: "Pune, India"
      },
      mentor: {
        id: "mnt-4",
        name: "Prof. Sarah Connor",
        department: "Computer Engineering",
        expertise: ["IoT", "Systems"]
      },
      studentTeam: {
        id: "tm-4",
        name: "AquaTech",
        size: 4,
        skills: ["IoT", "React", "Node.js"]
      },
      projectProgress: 68,
      currentMilestoneIndex: 4,
      milestones: defaultMilestones,
      industrySupport: [
        {
          id: "sup-1",
          type: "Hardware",
          status: "Delivered",
          description: "10x IoT Flow Sensors",
          expectedDeliveryDate: "2026-08-15"
        },
        {
          id: "sup-2",
          type: "Technical Expertise",
          status: "In Progress",
          description: "Bi-weekly review meetings with IoT engineers",
          expectedDeliveryDate: "2026-10-01"
        }
      ],
      collaborationStatus: "In Progress",
      lastUpdate: "2026-09-09"
    },
    {
      id: "col-202",
      requestId: "req-098",
      challengeTitle: "AI Chatbot for Citizen Queries",
      problemDescription: "Municipal corporation website is hard to navigate.",
      category: "E-Governance",
      university: {
        id: "uni-4",
        name: "VIT Vellore",
        department: "IT",
        location: "Vellore, India"
      },
      mentor: {
        id: "mnt-5",
        name: "Dr. Vikram Singh",
        department: "IT",
        expertise: ["NLP", "Web Dev"]
      },
      studentTeam: {
        id: "tm-5",
        name: "GovBot Creators",
        size: 3,
        skills: ["Python", "LangChain", "Next.js"]
      },
      projectProgress: 90,
      currentMilestoneIndex: 5,
      milestones: defaultMilestones,
      industrySupport: [
        {
          id: "sup-3",
          type: "API",
          status: "Completed",
          description: "Enterprise LLM API Access",
          expectedDeliveryDate: "2026-07-20"
        }
      ],
      collaborationStatus: "Support Delivered",
      lastUpdate: "2026-09-01"
    }
  ],
  supportedChallenges: [
    {
      id: "sch-1",
      challengeTitle: "Automated Pothole Detection",
      universityName: "NIT Surathkal",
      mentorName: "Prof. A. Rao",
      year: "2025",
      supportProvided: ["Cloud Resources", "Mentorship"],
      finalStatus: "Solution Deployed",
      completionDate: "2025-11-20",
      impactResult: "Adopted by Mangalore City Corporation"
    },
    {
      id: "sch-2",
      challengeTitle: "E-Waste Supply Chain Tracker",
      universityName: "BITS Pilani",
      mentorName: "Dr. M. Sharma",
      year: "2025",
      supportProvided: ["Technical Expertise"],
      finalStatus: "Completed",
      completionDate: "2025-08-14",
      impactResult: "Used by 3 local recycling firms"
    }
  ],
  notifications: [
    {
      id: 1,
      type: "info",
      title: "New Collaboration Request",
      message: "Prof. Rajesh Kumar (Bharati Vidyapeeth) requested support for 'Smart Traffic Light Optimization'.",
      timeAgo: "2 hours ago",
      isRead: false
    },
    {
      id: 2,
      type: "update",
      title: "Clarification Reply",
      message: "Mentor responded to your clarification on 'Crop Disease Detection'.",
      timeAgo: "5 hours ago",
      isRead: false
    },
    {
      id: 3,
      type: "success",
      title: "Milestone Reached",
      message: "Team 'AquaTech' reached the 'Testing' milestone.",
      timeAgo: "1 day ago",
      isRead: true
    }
  ],
  impact: {
    projectsSupported: 12,
    universitiesCollaborated: 8,
    studentsReached: 45,
    technicalExpertsInvolved: 5,
    resourcesProvided: 18,
    completedSolutions: 9,
    supportDistribution: [
      { label: "Cloud Resources", value: 35 },
      { label: "Technical Expertise", value: 25 },
      { label: "APIs", value: 20 },
      { label: "Datasets", value: 10 },
      { label: "Hardware", value: 5 },
      { label: "Other", value: 5 }
    ]
  }
};
