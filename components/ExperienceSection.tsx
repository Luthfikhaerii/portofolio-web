const WorkExperienceSection = () => {
  const stats = [
    { number: "5", label: "Years Experience" },
    { number: "3", label: "Projects Completed" },
    { number: "JS", label: "JavaScript" },
    { number: "TS", label: "TypeScript" }
  ];

  const experiences = [
    {
      title: "React.js Developer",
      company: "Starbucks",
      period: "March 2020 - April 2021",
      responsibilities: [
        "Developing and maintaining web applications using React.js and other related technologies.",
        "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
        "Implementing responsive design and ensuring cross-browser compatibility.",
        "Participating in code reviews and providing constructive feedback to other developers."
      ]
    },
    {
      title: "React Native Developer",
      company: "Tesla",
      period: "Jan 2021 - Feb 2022",
      responsibilities: [
        "Developing and maintaining web applications using React.js and other related technologies.",
        "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
        "Implementing responsive design and ensuring cross-browser compatibility.",
        "Participating in code reviews and providing constructive feedback to other developers."
      ]
    }
  ];

  return (
    <section className="py-16 px-4 bg-transparent max-w-4xl mx-auto">
      <div className="mx-auto">
        <div className="grid grid-cols-1 gap-12">
          
          {/* Left Column - Stats */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center p-6 border border-gray-300 rounded-lg hover:border-black transition-colors duration-300`}
                >
                  <div className="text-3xl font-bold text-black mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-700 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Work Experience */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-black mb-8">
              Work Experience.
            </h2>

            <div className="space-y-8 grid-cols-2 ">
              {experiences.map((exp, index) => (
                <div 
                  key={index}
                  className={`border-l-4 border-black pl-6 py-2 ${index+1 % 2 !== 0 ?`row-start-${index+1} col-start-1`: `row-start-${index+1} col-start-2`}`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-black">
                        {exp.title}
                      </h3>
                      <p className="text-lg text-gray-800 font-medium">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-gray-600 text-sm mt-1 sm:mt-0">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {exp.responsibilities.map((responsibility, idx) => (
                      <li 
                        key={idx}
                        className="text-gray-700 leading-relaxed flex items-start"
                      >
                        <span className="text-black mr-2">•</span>
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WorkExperienceSection;