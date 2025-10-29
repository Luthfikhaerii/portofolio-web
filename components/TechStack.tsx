const technologies = [
    "/stack/stack1.png",
    "/stack/stack1.png",
    "/stack/stack1.png",
    "/stack/stack1.png",
    "/stack/stack1.png",
    "/stack/stack1.png",
    "/stack/stack1.png",
    "/stack/stack1.png",
    "/stack/stack1.png",
    "/stack/stack1.png",
]

const TechStack = () => {
  return (
    <section className="py-24 bg-putih w-full">
      <div className="container mx-auto px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-tua ">Tech Stack</h2>
          <p className="text-lg max-w-2xl text-blue-tua mx-auto">
            Tools and technologies I use to bring ideas to life
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {technologies.map((tech, index) => {
            return (
              <div
                key={index}
                className="bg-white hover:bg-accent/50 rounded-2xl p-6 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md animate-scale-in aspect-square border border-border"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <img className="w-14 h-14 text-foreground" src={tech} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStack;