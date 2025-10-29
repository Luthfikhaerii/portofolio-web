import { ExternalLink, Github } from "lucide-react";


const projects = [
    {
        title: "E-Commerce Platform",
        description: "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
        image: "gradient-to-br from-blue-500 to-cyan-500",
        tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
        liveUrl: "#",
        githubUrl: "#",
    },
    {
        title: "Social Media Dashboard",
        description: "Analytics dashboard for managing multiple social media accounts with real-time data visualization.",
        image: "gradient-to-br from-purple-500 to-pink-500",
        tags: ["Next.js", "TypeScript", "Chart.js", "API"],
        liveUrl: "#",
        githubUrl: "#",
    },
    {
        title: "Mobile Fitness App",
        description: "Cross-platform mobile app for workout tracking, nutrition planning, and progress monitoring.",
        image: "gradient-to-br from-green-500 to-emerald-500",
        tags: ["React Native", "Firebase", "Redux", "Maps"],
        liveUrl: "#",
        githubUrl: "#",
    },
    {
        title: "AI Content Generator",
        description: "AI-powered tool for generating marketing content, blog posts, and social media captions.",
        image: "gradient-to-br from-orange-500 to-red-500",
        tags: ["React", "OpenAI", "Python", "FastAPI"],
        liveUrl: "#",
        githubUrl: "#",
    },
    {
        title: "Project Management Tool",
        description: "Collaborative project management platform with task tracking, team communication, and reporting.",
        image: "gradient-to-br from-indigo-500 to-blue-500",
        tags: ["Vue.js", "Express", "MongoDB", "Socket.io"],
        liveUrl: "#",
        githubUrl: "#",
    },
    {
        title: "Portfolio Builder",
        description: "Drag-and-drop portfolio builder with customizable templates and one-click deployment.",
        image: "gradient-to-br from-yellow-500 to-orange-500",
        tags: ["React", "Tailwind", "Supabase", "Vercel"],
        liveUrl: "#",
        githubUrl: "#",
    },
];

const Projects = () => {
    return (
        <section id="projects" className="py-24 bg-[#C3DDF0]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl text-blue-tua font-extrabold mb-4">Featured Projects</h2>
                    <p className="text-blue-tua text-lg max-w-2xl mx-auto">
                        A showcase of my recent work and personal projects
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="rounded-lg border bg-white text-gray-600 shadow-sm overflow-hidden bg-card border-border group card-hover animate-scale-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`h-48 bg-${project.image} flex items-center justify-center`}>
                                <div className="text-4xl font-bold text-gray-600">
                                    {project.title.split(' ')[0].slice(0, 3).toUpperCase()}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-muted-foreground mb-4 text-sm">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map((tag, tagIndex) => (
                                        <span
                                            key={tagIndex}
                                            className="px-2 py-1 text-xs bg-primary/10 text-primary rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                      
                                        className="flex-1"
                                        
                                    >
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Live
                                        </a>
                                    </button>
                                    <button
                                        
                                       
                                        className="flex-1"
                                        
                                    >
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                            
                                            Code
                                        </a>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;