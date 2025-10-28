import { Briefcase, Calendar } from "lucide-react";

const experiences = [
  {
    title: "Senior Full Stack Developer",
    company: "Tech Company Inc.",
    period: "2022 - Present",
    description: "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and architecting solutions.",
    achievements: [
      "Improved application performance by 40%",
      "Led team of 5 developers",
      "Implemented CI/CD pipeline",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "Digital Solutions Ltd.",
    period: "2020 - 2022",
    description: "Developed and maintained multiple client projects using modern web technologies. Collaborated with design and product teams.",
    achievements: [
      "Built 10+ production applications",
      "Reduced deployment time by 60%",
      "Introduced testing practices",
    ],
  },
  {
    title: "Frontend Developer",
    company: "Creative Studio",
    period: "2018 - 2020",
    description: "Created responsive and interactive user interfaces. Worked closely with designers to implement pixel-perfect designs.",
    achievements: [
      "Converted 50+ designs to code",
      "Improved mobile responsiveness",
      "Established component library",
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-24 bg-putih">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-tua">Work Experience</h2>
          <p className="text-lg max-w-2xl mx-auto text-blue-tua">
            My professional journey in software development
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="relative pl-8 pb-8 border-l-2 border-primary/30 last:pb-0 animate-slide-in-left"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full  border-4 border-background" />
              
              <div className="bg-white p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300">
                <div className="bg-white flex flex-wrap items-start justify-between gap-4 mb-4 text-bg-white">
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-black">
                      {exp.title}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-black">
                      <Briefcase className="w-4 h-4" />
                      <span>{exp.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full text-black">
                    <Calendar className="w-4 h-4" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 text-black">{exp.description}</p>

                <div className="space-y-2 text-black">
                  {exp.achievements.map((achievement, achievementIndex) => (
                    <div
                      key={achievementIndex}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="text-accent mt-1">✓</span>
                      <span className=" text-black">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;