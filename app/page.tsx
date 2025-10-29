import WorkExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectSection";
import TechStack from "@/components/TechStack";
import Image from "next/image";

export default function Home() {
   const skills = [
    "Web Developer", 
    "Backend Developer",
    "Social Media Specialist"
  ];

  return (
    <>
     <section className="relative w-full h-screen bg-gradient-to-b from-[#A9D0EB] to-[#C3DDF0]  overflow-hidden">
      {/* Menu Top */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6 z-20">
        <h1 className="font-bold text-lg tracking-widest text-gray-800">
          LUTHFI KHAERI
        </h1>
        <nav className="flex items-center gap-8 text-sm font-medium text-gray-700">
          <a href="#">Projects</a>
          <a href="#">Playground</a>
          <a href="#">About Me</a>
        </nav>
        <button className="bg-[#2C3C4D] text-white px-5 py-2 rounded-md text-sm">
          Contact Me
        </button>
      </header>

      {/* Hero Image */}
      <div className="absolute inset-0 flex items-center  justify-center z-10">
        <Image
          src={"/orang.png"}
          alt="Designer"
          className="w-auto h-[80%] object-contain contrast-125"
          width={300} height={300}
        />
      </div>

      {/* Big Background Text */}
      <h2 className="absolute inset-0 flex items-center justify-center text-[10vw] font-extrabold text-white/70 leading-none select-none z-0">
        PROGRAMMER
      </h2>

      {/* Right Side Progress Navigation */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 text-[#0c2c44]">
        <div className="w-[2px] h-28 bg-[#0c2c44]/40"></div>
        <span className="w-2 h-2 rounded-full bg-[#0c2c44]"></span>
      </div>

    </section>

      <section className="py-16 px-4 bg-gradient-to-b to-putih from-[#C3DDF0]">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-yellow-200 uppercase tracking-wide mb-2">
            INTRODUCTION
          </h2>
          <p className="text-6xl text-blue-tua font-extrabold">
            Overview.
          </p>
        </div>

        {/* Main Content */}
        <div className="mb-10">
          <p className="text-black text-lg leading-relaxed mb-8">
            I'm a skilled software developer with experience in TypeScript and JavaScript, and
            expertise in frameworks like React, Node.js, and Three.js. I'm a quick learner and
            collaborate closely with clients to create efficient, scalable, and user-friendly solutions
            that solve real-world problems. Let's work together to bring your ideas to life!
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, index) => (
            <div 
              key={index}
              className="border-2 border-gray-300 rounded-lg py-4 px-6 text-center hover:border-black transition-colors duration-300"
            >
              <span className="text-black font-medium text-lg">
                {skill}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
    <TechStack/>
    <WorkExperienceSection/>
    <ProjectsSection/>
    </>
  );
}
