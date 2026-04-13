import Navbar         from '@/components/Navbar';
import Hero           from '@/components/sections/Hero';
import Experience     from '@/components/sections/Experience';
import Projects       from '@/components/sections/Projects';
import Skills         from '@/components/sections/Skills';
import Education      from '@/components/sections/Education';
import Certifications from '@/components/sections/Certifications';
import Volunteering   from '@/components/sections/Volunteering';
import Contact        from '@/components/sections/Contact';

// ISR — revalidate every 60 seconds so admin changes go live quickly
export const revalidate = 60;

async function getAllData() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const opts = { next: { revalidate: 60 } };

  const [projects, experience, skills, education, certifications, volunteering] =
    await Promise.allSettled([
      fetch(`${base}/api/projects`,       opts).then(r => r.json()),
      fetch(`${base}/api/experience`,     opts).then(r => r.json()),
      fetch(`${base}/api/skills`,         opts).then(r => r.json()),
      fetch(`${base}/api/education`,      opts).then(r => r.json()),
      fetch(`${base}/api/certifications`, opts).then(r => r.json()),
      fetch(`${base}/api/volunteering`,   opts).then(r => r.json()),
    ]);

  return {
    projects:       projects.status       === 'fulfilled' ? projects.value.data       : [],
    experience:     experience.status     === 'fulfilled' ? experience.value.data     : [],
    skills:         skills.status         === 'fulfilled' ? skills.value.data         : [],
    education:      education.status      === 'fulfilled' ? education.value.data      : [],
    certifications: certifications.status === 'fulfilled' ? certifications.value.data : [],
    volunteering:   volunteering.status   === 'fulfilled' ? volunteering.value.data   : [],
  };
}

export default async function HomePage() {
  const { projects, experience, skills, education, certifications, volunteering } = await getAllData();

  return (
    <div className="min-h-screen flex flex-col font-inter bg-light dark:bg-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
  <Navbar />

  {/* Main Content Area */}
  <main className="flex-grow max-w-6xl mx-auto px-6 w-full">
    <Hero />
    <Experience     data={experience} />
    <Projects       data={projects} />
    <Skills         data={skills} />
    <Education      data={education} />
    <Certifications data={certifications} />
    <Volunteering   data={volunteering} />
    <Contact />
  </main>

  {/* Footer Area */}
  <footer className="w-full py-6 mt-10 border-t border-gray-200 dark:border-gray-800">
    <div className="max-w-6xl mx-auto px-6 flex justify-center md:justify-start items-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Designed & Developed by <strong>Mohammed Shoaib Makandar</strong> and MaDycloud
      </p>
    </div>
  </footer>
</div>
  );
}
