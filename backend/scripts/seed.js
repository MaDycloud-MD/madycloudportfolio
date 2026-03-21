/**
 * ONE-TIME seed script — run after setting up MongoDB Atlas.
 * Reads your original hardcoded arrays and inserts them into the database.
 *
 * Usage:
 *   cd backend
 *   node scripts/seed.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const Project      = require('../models/Project');
const Experience   = require('../models/Experience');
const Skill        = require('../models/Skill');
const Education    = require('../models/Education');
const Certification = require('../models/Certification');
const Volunteering = require('../models/Volunteering');

// ── Data (migrated from your existing components) ─────────────────────────────

const projects = [
  {
    title: 'Deep Packet Inspection',
    slug: 'deep-packet-inspection',
    description: 'Production-style Deep Packet Inspection engine in Java with zero-copy concurrent pipeline.',
    details: [
      'Built a production-style Deep Packet Inspection (DPI) engine in Java with zero-copy concurrent pipeline, TLS SNI parsing, and stateful TCP tracking to classify and block encrypted traffic in real time.',
      'Designed lock-efficient multi-threaded architecture using consistent 5-tuple hashing for flow affinity, enabling horizontal scaling without shared connection-table contention.',
      'Implemented TLS 1.2/1.3 ClientHello parser from raw binary to extract SNI without third-party libraries for HTTPS domain classification.',
      'Engineered a hot-reloadable rule engine with wildcard domain support and O(1) IP/app lookup using per-category read-write locking.',
      'Built deterministic packet generator and connection table with LRU eviction (100K cap) mirroring firewall-grade networking systems.',
    ],
    techStack: [
      { name: 'Java',  logoUrl: '/logos/java.svg' },
      { name: 'Maven', logoUrl: '/logos/apache-maven.svg' },
    ],
    links: { github: 'https://github.com/MaDycloud-MD/Deep_Packet_Inspection-Java.git' },
    featured: true, order: 1,
  },
  {
    title: 'Strapi Headless CMS Deployment on AWS',
    slug: 'strapi-headless-cms-aws',
    description: 'Designed and deployed Strapi Headless CMS on AWS ECS (Fargate) using Docker and PostgreSQL (RDS).',
    details: [
      'Designed and deployed Strapi Headless CMS on AWS ECS (Fargate) using Docker and PostgreSQL (RDS), improving scalability and automation.',
      'Implemented Infrastructure as Code (IaC) with Terraform to provision ECS clusters, task definitions, networking, and secure RDS configurations.',
      'Troubleshot and resolved critical deployment issues (Docker multi-stage builds, SSL & pg_hba.conf errors, secret management), ensuring production-grade reliability.',
    ],
    techStack: [
      { name: 'AWS',       logoUrl: '/logos/aws.svg' },
      { name: 'Docker',    logoUrl: '/logos/docker.svg' },
      { name: 'Terraform', logoUrl: '/logos/terraform.svg' },
    ],
    links: {
      github:  'https://github.com/MaDycloud-MD/my-strapi-project-aws-deploy.git',
      youtube: 'https://youtu.be/zRJaCDK8b3g?si=gQi6vL4hyv4oDJ6y',
    },
    featured: true, order: 2,
  },
  {
    title: 'City Wellness: AI-Powered Waste Reporting System',
    slug: 'city-wellness-ai-waste-reporting',
    description: 'Full-stack AI-powered waste management platform using TensorFlow CNN classifier.',
    details: [
      'Developed a full-stack AI-powered waste management platform using Tensorflow (92% accurate CNN classifier), enabling real-time voice, image, and GPS reporting.',
      'Architected a cloud-native deployment model using AWS (EC2, ASG, ELB, Route 53) with CI/CD pipelines, which reduced deployment effort by 80%, increased uptime to 99.95%.',
    ],
    techStack: [
      { name: 'React.js',    logoUrl: '/logos/react.svg' },
      { name: 'Node.js',     logoUrl: '/logos/node.js.svg' },
      { name: 'MongoDB',     logoUrl: '/logos/mongodb.svg' },
      { name: 'TensorFlow',  logoUrl: '/logos/tensorflow.svg' },
      { name: 'AWS',         logoUrl: '/logos/aws.svg' },
      { name: 'Docker',      logoUrl: '/logos/docker.svg' },
    ],
    links: { github: 'https://github.com/MaDycloud-MD/SmartCitywellness.git' },
    featured: true, order: 3,
  },
  {
    title: 'CloudForge: Cloud-Native DevSecOps Platform',
    slug: 'cloudforge-devsecops-platform',
    description: 'Automated CI/CD pipeline using Jenkins with security scanning and Kubernetes deployment.',
    details: [
      'Automated CI/CD pipeline using Jenkins, integrating Trivy and SonarQube for security scans, resulting in 60% faster deployments and 20% reduced AWS operating costs.',
      'Deployed containerized services to AWS EKS with Helm and ArgoCD (99.9% uptime), implemented Prometheus-Grafana monitoring to cut incident response time by 50%.',
    ],
    techStack: [
      { name: 'AWS',        logoUrl: '/logos/aws.svg' },
      { name: 'Docker',     logoUrl: '/logos/docker.svg' },
      { name: 'Kubernetes', logoUrl: '/logos/kubernetes.svg' },
      { name: 'Jenkins',    logoUrl: '/logos/jenkins.svg' },
      { name: 'Prometheus', logoUrl: '/logos/prometheus.svg' },
      { name: 'Grafana',    logoUrl: '/logos/grafana.svg' },
      { name: 'ArgoCD',     logoUrl: '/logos/argocd.svg' },
    ],
    links: { github: 'https://github.com/MaDycloud-MD/Netflix_DevSecOps_Project.git' },
    featured: true, order: 4,
  },
  {
    title: 'Face Recognition with AWS Rekognition',
    slug: 'face-recognition-aws-rekognition',
    description: 'Secure architecture using AWS Rekognition, S3, Lambda, DynamoDB, and IAM.',
    details: [
      'Designed and deployed a secure architecture using AWS Rekognition, S3, Lambda, DynamoDB, and IAM.',
      'Improved recognition accuracy by 15%, reduced latency by 40%, and achieved 99.9% uptime.',
    ],
    techStack: [
      { name: 'AWS',              logoUrl: '/logos/aws.svg' },
      { name: 'AWS DynamoDB',     logoUrl: '/logos/dynamodb.svg' },
      { name: 'AWS Lambda',       logoUrl: '/logos/lambda.svg' },
      { name: 'AWS Rekognition',  logoUrl: '/logos/rekognition.svg' },
    ],
    links: { github: 'https://github.com/MaDycloud-MD/Automated-Face-Recognition-System-Deployment-using-AWS-Rekognition.git' },
    order: 5,
  },
  {
    title: '2048 Game Docker Deployment',
    slug: '2048-game-docker-deployment',
    description: 'Dockerized 2048 game deployed using AWS Elastic Beanstalk.',
    details: [
      'Dockerized the game and deployed using AWS Elastic Beanstalk, enabling rapid, scalable hosting with container-based architecture.',
      'Achieved 40% faster deployments, reduced manual provisioning by 50%, and maintained 99.8% uptime.',
    ],
    techStack: [
      { name: 'Docker', logoUrl: '/logos/docker.svg' },
      { name: 'AWS',    logoUrl: '/logos/aws.svg' },
    ],
    links: { github: 'https://github.com/MaDycloud-MD/2048_UsingDocker_AWS.git' },
    order: 6,
  },
  {
    title: 'Book Review System – Cloud-Based Web Platform',
    slug: 'book-review-system',
    description: 'Cloud-based book review system enabling users to browse, rate and review books.',
    details: [
      'Designed and developed a cloud-based book review system enabling users to register, browse books, post ratings, and write detailed reviews.',
      'Integrated user authentication and profile management using Firebase for secure, cloud-based account handling.',
      'Deployed on GitHub Pages with real-time feedback supporting 100+ early users.',
    ],
    techStack: [
      { name: 'HTML5',      logoUrl: '/logos/html5.svg' },
      { name: 'JavaScript', logoUrl: '/logos/javascript.svg' },
      { name: 'Firebase',   logoUrl: '/logos/firebase.svg' },
    ],
    links: {
      github: 'https://github.com/MaDycloud-MD/Book-Review-System.git',
      live:   'https://madycloud-md.github.io/Book-Review-System/',
    },
    order: 7,
  },
];

const experience = [
  {
    role:     'Junior Cloud Engineer Intern',
    company:  'Eyesec Cybersecurity Solution Pvt. Ltd',
    duration: 'Mar 2023 – Jun 2023',
    points: [
      'Assisted in architecting and implementing a scalable cloud-based SaaS solution on AWS for a Farm House Goods client, analyzing 50+ use cases to optimize the architecture, resulting in a 40% revenue increase in Q1 and a 6.33% sales boost over six months.',
      'Configured and monitored AWS services, including EC2, ECS, S3, and load balancers to ensure high availability, performance, and cost-efficiency of SaaS applications.',
    ],
    order: 1,
  },
  {
    role:     'Intern',
    company:  'BSNL',
    duration: 'Sept 2022 – Oct 2022',
    points: [
      'Supported network infrastructure management by working with routers, switches, and FTTH systems, ensuring a reliable networking backbone and enhancing system stability.',
      'Assisted in CRM implementation to automate sales workflows, reducing administrative workload by 10% and improving operational efficiency by 5%.',
    ],
    order: 2,
  },
];

const skills = [
  {
    category: 'Programming',
    title: 'Programming Languages',
    items: [
      { label: 'Java',   logoUrl: '/logos/java.svg' },
      { label: 'Python', logoUrl: '/logos/python.svg' },
      { label: 'C',      logoUrl: '/logos/c.svg' },
    ],
    order: 1,
  },
  {
    category: 'DevOps',
    title: 'Cloud & DevOps',
    items: [
      { label: 'AWS',            logoUrl: '/logos/aws.svg' },
      { label: 'Azure',          logoUrl: '/logos/azure.svg' },
      { label: 'Docker',         logoUrl: '/logos/docker.svg' },
      { label: 'Kubernetes',     logoUrl: '/logos/kubernetes.svg' },
      { label: 'Terraform',      logoUrl: '/logos/terraform.svg' },
      { label: 'Jenkins',        logoUrl: '/logos/jenkins.svg' },
      { label: 'GitHub Actions', logoUrl: '/logos/github-actions.svg' },
      { label: 'ArgoCD',         logoUrl: '/logos/argocd.svg' },
      { label: 'Prometheus',     logoUrl: '/logos/prometheus.svg' },
      { label: 'Grafana',        logoUrl: '/logos/grafana.svg' },
      { label: 'Helm',           logoUrl: '/logos/helm.svg' },
      { label: 'Ansible',        logoUrl: '/logos/ansible.svg' },
      { label: 'Nginx',          logoUrl: '/logos/nginx.svg' },
      { label: 'Apache',         logoUrl: '/logos/apache.svg' },
    ],
    order: 2,
  },
  {
    category: 'Databases',
    title: 'Databases',
    items: [
      { label: 'MySQL',   logoUrl: '/logos/mysql.svg' },
      { label: 'MongoDB', logoUrl: '/logos/mongodb.svg' },
    ],
    order: 3,
  },
  {
    category: 'Operating Systems',
    title: 'Operating Systems',
    items: [
      { label: 'Linux',   logoUrl: '/logos/linux.svg' },
      { label: 'Unix',    logoUrl: '/logos/unix.svg' },
      { label: 'Windows', logoUrl: '/logos/windows-11.svg' },
    ],
    order: 4,
  },
  {
    category: 'Tools',
    title: 'Tools',
    items: [
      { label: 'Git',                logoUrl: '/logos/git.svg' },
      { label: 'GitHub',             logoUrl: '/logos/github.svg' },
      { label: 'Vim',                logoUrl: '/logos/vim.svg' },
      { label: 'Visual Studio Code', logoUrl: '/logos/visual-studio-code.svg' },
      { label: 'Jira',               logoUrl: '/logos/jira.svg' },
    ],
    order: 5,
  },
];

const education = [
  {
    degree:      'Bachelor of Computer Applications [BCA]',
    institution: 'Rani Channamma University, Karnataka.',
    score:       'CGPA: 8.37',
    year:        'Pursuing',
    order: 1,
  },
  {
    degree:      'Diploma in Computer Science and Engineering [Cloud Computing]',
    institution: 'Jain Polytechnic | Department of Technical Education, Karnataka.',
    score:       'CGPA: 9.52',
    year:        '2020 - 2023',
    order: 2,
  },
];

const certifications = [
  {
    name:    'Oracle Fusion Cloud Applications ERP Certified Foundations Associate',
    logoUrl: '/certified_logos/OMBPERPCFA1.png',
    url:     'https://catalog-education.oracle.com/ords/certview/sharebadge?id=63A9C307421DA9E029F6439932D082379FF624B815214AB311EB6F4FBFA2754D',
    order: 1,
  },
  {
    name:    'Oracle Fusion Cloud Applications CX Certified Foundations Associate',
    logoUrl: '/certified_logos/OMBPCXCFA1.png',
    url:     'https://catalog-education.oracle.com/ords/certview/sharebadge?id=D123AB165397D80B055C0277A5ACC5CBD0DB432D050DC324AB26E2DD058AD2E7',
    order: 2,
  },
  {
    name:    'Oracle Fusion Cloud Applications SCM Certified Foundations Associate',
    logoUrl: '/certified_logos/OMBPSCMCFA1.png',
    url:     'https://catalog-education.oracle.com/ords/certview/sharebadge?id=B6DB4FCE8EB45465222C782AE0A9B5D38C372BD4757DB6F3E8248E2C475BE885',
    order: 3,
  },
  {
    name:    'Oracle Fusion Cloud Applications HCM Certified Foundations Associate',
    logoUrl: '/certified_logos/OMBPHCMCFA1.png',
    url:     'https://catalog-education.oracle.com/ords/certview/sharebadge?id=D5B5689ACFCB6631F44DE9619D938A1128C91F799853ED6BFAACA86A842A417A',
    order: 4,
  },
  {
    name:    'Diploma in Office Automation',
    logoUrl: '/certified_logos/DOA.jpg',
    url:     'https://drive.google.com/file/d/14-ZVIGmb0FwR24SSacIve5zVnQ9j9dhy/view?usp=sharing',
    order: 5,
  },
  {
    name:       'AWS Certified Cloud Practitioner (in-progress)',
    logoUrl:    '/logos/aws.svg',
    url:        'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    inProgress: true,
    order: 6,
  },
];

const volunteering = [
  {
    title:       'Teaching Assistant',
    description: 'Delivered lectures on 3+ academic courses and helped 90+ students clear academic doubts.',
    order: 1,
  },
  {
    title:       'Placement Coordinator',
    description: 'Organized 50+ company drives, peer 250+ resume reviews, and 15+ mock interviews.',
    order: 2,
  },
  {
    title:       'Cybersecurity Workshop Volunteer',
    description: 'Supported Secuneus Tech in hands-on sessions for 200+ students.',
    order: 3,
  },
  {
    title:       'Event Organizer, Tech & Cultural Fests',
    description: 'Led planning and logistics for college-wide events, managing other volunteers.',
    order: 4,
  },
];

// ── Seed function ─────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing collections
    await Promise.all([
      Project.deleteMany({}),
      Experience.deleteMany({}),
      Skill.deleteMany({}),
      Education.deleteMany({}),
      Certification.deleteMany({}),
      Volunteering.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Insert fresh data
    // await Project.insertMany(projects);
    // console.log(`📦 Seeded ${projects.length} projects`);

    // await Experience.insertMany(experience);
    // console.log(`💼 Seeded ${experience.length} experience entries`);

    // await Skill.insertMany(skills);
    // console.log(`🛠️  Seeded ${skills.length} skill groups`);

    // await Education.insertMany(education);
    // console.log(`🎓 Seeded ${education.length} education entries`);

    // await Certification.insertMany(certifications);
    // console.log(`🏅 Seeded ${certifications.length} certifications`);

    // await Volunteering.insertMany(volunteering);
    // console.log(`🤝 Seeded ${volunteering.length} volunteering entries`);

    // console.log('\n✨ Database seeded successfully!');
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
