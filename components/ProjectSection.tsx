import Image from "next/image";

const projects = [
  {
    title: "Car Rent",
    image: "/image.png",
    description:
      "Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
    tech: ["react", "mongodb", "tailwind"],
  },
  {
    title: "Job IT",
    image: "/image.png",
    description:
      "Web application that enables users to search for job openings, view estimated salary ranges and locate available jobs based on their current location.",
    tech: ["react", "restapi", "scss"],
  },
  {
    title: "Trip Guide",
    image: "/image.png",
    description:
      "A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, with curated recommendations.",
    tech: ["nextjs", "supabase", "css"],
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <p className="text-sm text-[#6e7fa3] tracking-widest mb-2">
          MY WORK
        </p>
        <h2 className="text-5xl font-extrabold mb-6">
          Projects<span className="text-[#a6c1ff]">.</span>
        </h2>

        <p className="text-[#9ca9c5] max-w-2xl leading-relaxed mb-14">
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos. It reflects my ability to
          solve complex problems, work with different technologies, and manage
          projects effectively.
        </p>

        {/* Grid Project Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-[#131620] p-6 rounded-2xl border border-[#2c3245] hover:border-[#5568c9] transition-all"
            >
              <div className="rounded-xl overflow-hidden mb-5">
                <Image
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-44"
                  width={1000 } height={1000}
                />
              </div>
              <h3 className="font-bold text-xl mb-3">{project.title}</h3>
              <p className="text-[#9ca9c5] text-sm leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 text-xs">
                {project.tech.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[#77b0ff] bg-[#1a2130] py-1 px-2 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
