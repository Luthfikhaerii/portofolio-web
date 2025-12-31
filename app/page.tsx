'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface TechStackItem {
  name: string
  description: string
  icon: string
}

interface Experience {
  title: string
  company: string
  period: string
  responsibilities: string[]
}

interface Project {
  title: string
  tags: string[]
  description: string
  icon: string
}

interface ContactInfo {
  icon: string
  label: string
  value: string
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<string>('home')
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorOutlineRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animated particles background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = 80

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      canvasWidth: number
      canvasHeight: number

      constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > this.canvasWidth) this.x = 0
        if (this.x < 0) this.x = this.canvasWidth
        if (this.y > this.canvasHeight) this.y = 0
        if (this.y < 0) this.y = this.canvasHeight
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height))
    }

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas?.width||0, canvas?.height||0)
      
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // Connect particles
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            if (!ctx) return
            ctx.strokeStyle = `rgba(0, 0, 0, ${0.1 * (1 - distance / 120)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // Update particle canvas dimensions
      particles.forEach(particle => {
        particle.canvasWidth = canvas.width
        particle.canvasHeight = canvas.height
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorDotRef.current && cursorOutlineRef.current) {
        cursorDotRef.current.style.left = e.clientX + 'px'
        cursorDotRef.current.style.top = e.clientY + 'px'
        cursorOutlineRef.current.style.left = (e.clientX - 20) + 'px'
        cursorOutlineRef.current.style.top = (e.clientY - 20) + 'px'
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      document.documentElement.style.setProperty('--scroll-progress', scrolled + '%')

      // Update active section
      const sections = document.querySelectorAll('section[id]')
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop
        if (window.scrollY >= (sectionTop - 200)) {
          setActiveSection(section.getAttribute('id') || 'home')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="relative min-h-screen bg-white text-black overflow-x-hidden">
      {/* Animated particles background */}
      <canvas 
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Custom Cursor */}
      <div ref={cursorDotRef} className="cursor-dot" style={{ zIndex: 9999 }} />
      <div ref={cursorOutlineRef} className="cursor-outline" style={{ zIndex: 9998 }} />

      {/* Scroll Progress */}
      <div className="scroll-indicator" style={{ zIndex: 101 }} />

      {/* Navigation */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[900px] px-4 md:px-8 py-3 md:py-4 bg-white/90 backdrop-blur-xl border-2 border-black shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)] rounded-full" style={{ zIndex: 100 }}>
        <div className="flex justify-between items-center">
          <div className="text-xl md:text-2xl font-black font-playfair relative">
            LKI.
            <div className="absolute bottom-[-3px] left-0 w-full h-[2px] md:h-[3px] bg-black" />
          </div>
          <ul className="hidden md:flex gap-2 list-none">
            {['home', 'tech', 'experience', 'portfolio', 'contact'].map(section => (
              <li key={section}>
                <button
                  onClick={() => scrollToSection(section)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all capitalize ${
                    activeSection === section 
                      ? 'bg-black text-white' 
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {section}
                </button>
              </li>
            ))}
          </ul>
          
          {/* Mobile menu button */}
          <button className="md:hidden px-4 py-2 text-sm font-semibold">
            Menu
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center pt-24 md:pt-32 pb-12 relative">
        <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
          <div className="gap-8 md:gap-16 items-center">
            {/* Right Side - Portrait (Mobile First) */}
            {/* <div className="relative order-first md:order-last">
              <div className="relative  h-[50vh] md:h-[50vh] max-h-[400px] md:max-h-[600px] overflow-hidden group">
                <Image
                  src="/orang.png"
                  alt="Portrait"
                  fill
                  className="object-cover object-center grayscale contrast-110 transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30 pointer-events-none" />
              </div>
            </div> */}

            {/* Left Side */}
            <div className="flex flex-col gap-6 md:gap-8 order-last md:order-first">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 border-2 border-black w-fit text-xs md:text-sm font-semibold">
                <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                Available for work
              </div>

              <h1 className="font-playfair text-5xl md:text-7xl lg:text-7xl font-black leading-[0.9] tracking-[-2px] md:tracking-[-4px]">
                Luthfi Khaeri Ihsan<sup className="text-xl md:text-3xl font-normal">®</sup>
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-2">
                <div className="flex flex-col gap-1 md:gap-2">
                  <span className="font-playfair text-lg md:text-xl font-bold">©2025</span>
                  <p className="text-xs md:text-sm leading-relaxed text-gray-600">
                    Designing digital experiences that captivate, connect, and convert.
                  </p>
                </div>
                <div className="flex flex-col gap-1 md:gap-2">
                  <span className="font-playfair text-lg md:text-xl font-bold">Brand</span>
                  <p className="text-xs md:text-sm leading-relaxed text-gray-600">
                    We craft bold, memorable brand identities that tell your story.
                  </p>
                </div>
                <div className="flex flex-col gap-1 md:gap-2">
                  <span className="font-playfair text-lg md:text-xl font-bold">UI/UX</span>
                  <p className="text-xs md:text-sm leading-relaxed text-gray-600">
                    User-focused interfaces that elevate engagement and drive interactions.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button 
                  onClick={() => scrollToSection('portfolio')}
                  className="px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-sm md:text-base border-2 border-black bg-black text-white transition-all hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
                >
                  View Work
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-sm md:text-base border-2 border-black bg-transparent text-black transition-all hover:bg-black hover:text-white hover:-translate-y-1"
                >
                  Get In Touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 tracking-[-1px] md:tracking-[-2px]">
              Tech Stack
            </h2>
            <p className="text-gray-600 text-base md:text-lg">Tools dan teknologi yang saya kuasai</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {techStack.map((tech, index) => (
              <TechItem key={index} {...tech} />
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 tracking-[-1px] md:tracking-[-2px]">
              Experience
            </h2>
            <p className="text-gray-600 text-base md:text-lg">Perjalanan karir profesional saya</p>
          </div>

          <div className="relative pl-8 md:pl-12 border-l-[2px] md:border-l-[3px] border-black">
            {experiences.map((exp, index) => (
              <ExperienceItem key={index} {...exp} />
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 tracking-[-1px] md:tracking-[-2px]">
              Portfolio
            </h2>
            <p className="text-gray-600 text-base md:text-lg">Project yang telah saya kerjakan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 tracking-[-1px] md:tracking-[-2px]">
              Contact
            </h2>
            <p className="text-gray-600 text-base md:text-lg">Mari bekerja sama</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h3 className="font-playfair text-3xl md:text-4xl font-extrabold mb-6 md:mb-8">Hubungi Saya</h3>
              
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 p-4 md:p-5 bg-white border-2 border-black transition-all hover:translate-x-2 md:hover:translate-x-3 hover:shadow-[4px_4px_0_#000] md:hover:shadow-[6px_6px_0_#000]"
                >
                  <span className="text-xl md:text-2xl">{info.icon}</span>
                  <div>
                    <div className="font-bold text-sm md:text-base">{info.label}</div>
                    <div className="text-gray-700 text-xs md:text-sm">{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 md:p-10 border-[3px] border-black">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4 md:mb-6">
                  <label className="block mb-2 font-bold font-playfair text-base md:text-lg">Nama</label>
                  <input 
                    type="text" 
                    placeholder="Nama Anda"
                    className="w-full p-3 md:p-4 bg-gray-100 border-2 border-black text-sm md:text-base focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#000] transition-all"
                  />
                </div>
                <div className="mb-4 md:mb-6">
                  <label className="block mb-2 font-bold font-playfair text-base md:text-lg">Email</label>
                  <input 
                    type="email" 
                    placeholder="email@example.com"
                    className="w-full p-3 md:p-4 bg-gray-100 border-2 border-black text-sm md:text-base focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#000] transition-all"
                  />
                </div>
                <div className="mb-4 md:mb-6">
                  <label className="block mb-2 font-bold font-playfair text-base md:text-lg">Pesan</label>
                  <textarea 
                    placeholder="Tulis pesan Anda..."
                    rows={5}
                    className="w-full p-3 md:p-4 bg-gray-100 border-2 border-black text-sm md:text-base resize-y focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#000] transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-sm md:text-base border-2 border-black bg-black text-white transition-all hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t-4 border-black">
        <div className="container mx-auto px-8 max-w-[1200px] text-center">
          <div className="flex justify-center gap-4 mb-6">
            {['💼', '🐙', '🐦', '📸'].map((icon, index) => (
              <a
                key={index}
                href="#"
                className="w-12 h-12 bg-white flex items-center justify-center text-black text-xl border-2 border-black transition-all hover:bg-black hover:text-white hover:-translate-y-2 hover:rotate-12"
              >
                {icon}
              </a>
            ))}
          </div>
          <p>&copy; 2025 John Doe. All rights reserved.</p>
        </div>
      </footer>
      </div>
      {/* End Main Content */}

 
    </div>
  )
}

// Tech Item Component
function TechItem({ name, description, icon }: TechStackItem) {
  return (
    <div className="bg-white p-4 md:p-6 border-2 border-black text-center transition-all cursor-pointer hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] group relative overflow-hidden">
      <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-400 z-0" />
      <div className="relative z-10">
        <div className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-4 fill-black group-hover:fill-white transition-colors" dangerouslySetInnerHTML={{ __html: icon }} />
        <h3 className="text-sm md:text-base lg:text-lg mb-0.5 md:mb-1 font-bold font-playfair group-hover:text-white transition-colors">{name}</h3>
        <p className="text-xs md:text-sm text-gray-600 group-hover:text-white transition-colors">{description}</p>
      </div>
    </div>
  )
}

// Experience Item Component
function ExperienceItem({ title, company, period, responsibilities }: Experience) {
  return (
    <div className="relative mb-8 md:mb-12 bg-white p-4 md:p-6 lg:p-8 border-2 border-black transition-all cursor-pointer hover:translate-x-2 md:hover:translate-x-3 hover:shadow-[4px_4px_0_#000] md:hover:shadow-[8px_8px_0_#000] before:content-[''] before:absolute before:left-[-2.4rem] md:before:left-[-3.6rem] before:top-4 md:before:top-8 before:w-3 before:h-3 md:before:w-4 md:before:h-4 before:bg-black before:border-2 md:before:border-4 before:border-white before:rounded-full before:shadow-[0_0_0_2px_#000] md:before:shadow-[0_0_0_3px_#000]">
      <div className="mb-3 md:mb-4">
        <h3 className="text-xl md:text-2xl font-extrabold font-playfair mb-1 md:mb-2">{title}</h3>
        <div className="text-base md:text-lg text-gray-700 font-semibold">{company}</div>
        <div className="text-xs md:text-sm text-gray-600 font-medium">{period}</div>
      </div>
      <ul className="list-none space-y-2 md:space-y-3">
        {responsibilities.map((resp, index) => (
          <li key={index} className="pl-4 md:pl-6 relative text-sm md:text-base text-gray-700 before:content-['▪'] before:absolute before:left-0 before:text-lg md:before:text-xl">
            {resp}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Project Card Component
function ProjectCard({ title, tags, description, icon }: Project) {
  return (
    <div className="bg-white border-[2px] md:border-[3px] border-black overflow-hidden transition-all cursor-pointer hover:-translate-y-2 md:hover:-translate-y-3 hover:-rotate-1 hover:shadow-[8px_8px_0_#000] md:hover:shadow-[12px_12px_0_#000] group relative">
      <div className="absolute inset-0 bg-black transform scale-0 group-hover:scale-100 transition-transform duration-400 z-0" />
      
      <div className="relative z-10">
        <div className="h-[180px] md:h-[250px] bg-gray-200 flex items-center justify-center border-b-[2px] md:border-b-[3px] border-black">
          <div className="w-16 h-16 md:w-20 md:h-20 fill-black" dangerouslySetInnerHTML={{ __html: icon }} />
        </div>

        <div className="p-5 md:p-8">
          <h3 className="text-xl md:text-2xl font-extrabold font-playfair mb-3 md:mb-4 group-hover:text-white transition-colors">
            {title}
          </h3>
          <div className="flex gap-2 mb-3 md:mb-4 flex-wrap">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 md:px-3 py-1 border-2 border-black font-bold text-[10px] md:text-xs transition-all group-hover:bg-white group-hover:text-black"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-gray-700 text-sm md:text-base mb-3 md:mb-4 leading-relaxed group-hover:text-white transition-colors">
            {description}
          </p>
          <a href="#" className="text-black text-sm md:text-base font-bold inline-flex items-center gap-2 group-hover:text-white transition-colors">
            View Project →
          </a>
        </div>
      </div>
    </div>
  )
}

// Data
const techStack: TechStackItem[] = [
  {
    name: 'Next.js',
    description: 'React Framework',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/></svg>'
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-First CSS',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/></svg>'
  },
  {
    name: 'React',
    description: 'UI Library',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278z"/></svg>'
  },
  {
    name: 'TypeScript',
    description: 'Type-Safe JS',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>'
  },
  {
    name: 'PostgreSQL',
    description: 'Database',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-.7822-.1876-.1742.0879-.3244.2441-.4878.3371a.5686.5686 0 0 1-.5571.0503c-.2943-.124-.5252-.3748-.7194-.6191-.044-.0562-.0814-.1185-.1253-.1811a.9767.9767 0 0 0-.0189-.0314c.0129-.0593.0189-.1185.0314-.1811.0408-.1938.0969-.3875.1659-.5752.0783-.2058.1847-.3748.3248-.5313.2621-.2938.6158-.5126.9443-.702.0659-.0376.1253-.0814.1972-.1189.016-.0066.0345-.0126.0503-.0189.1349-.0533.2697-.0939.4109-.1253.0533-.0095.1095-.016.166-.0189.0314 0 .0627-.0063.0972-.0063.0157 0 .0346 0 .0534.0063.1028.0063.2059.0157.3088.0346z"/></svg>'
  },
  {
    name: 'Prisma',
    description: 'ORM',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.25 5h-2a.75.75 0 0 0 0 1.5h1.5v1.75h-3v-1.75a.75.75 0 0 0-1.5 0v2.5c0 .414.336.75.75.75h3.5v1.75H8a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5H14a.75.75 0 0 0 0-1.5h-1.25v-1.75h3.5a.75.75 0 0 0 .75-.75v-2.5a.75.75 0 0 0-1.5 0v1.75h-3V6.5h1.5a.75.75 0 0 0 0-1.5z"/></svg>'
  }
]

const experiences: Experience[] = [
  {
    title: 'Full Stack Developer',
    company: 'PT Saptaloka Digital Indonesia',
    period: 'Apr 2023 - Sep 2024',
    responsibilities: [
      'Developed ERP System backend for Manufacturing Machine Maintenance module',
      'Built Inventory Management System for telecommunications spare parts and cable stock control',
      'Led frontend training for team to implement Next.js and created reusable components',
      'Mentored web development interns during Vocational High School internship program'
    ]
  },
    {
    title: 'Full Stack Developer',
    company: 'Universitas Pendidikan Indonesia',
    period: 'Nov 2023 - Sekarang',
    responsibilities: [
      'Collaborated with university lecturers on academic and operational digitalization projects',
      'Developed Chemical Laboratory Order Management System for equipment and materials request',
      'Built CMS & Web Application for Teacher Competency Testing with assessment and scoring features',
      'Created Inventory Management System for lab tools tracking and borrowing management'
    ]
  },
  {
    title: 'Digital Marketing Intern',
    company: 'Forkey Creative',
    period: 'Mei 2024 - Jul 2024',
    responsibilities: [
      'Planned and executed digital marketing campaigns across social media platforms',
      'Managed Meta Ads (Facebook & Instagram) with audience targeting and budget allocation',
      'Analyzed campaign performance and created reports to drive better marketing outcomes',
      'Collaborated with social media and creative teams on integrated campaign workflows'
    ]
  }
]

const projects: Project[] = [
  {
    title: 'CMS LUPIC',
    tags: ['NEXT.JS', 'REACT', 'MONGODB', 'EXPRESS', 'NODE.JS'],
    description: 'Content Management System for Leading University Project for International Cooperation (LUPIC) Website.',
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9h2v6h-2v-6zm0-4h2v2h-2V7z" fill="currentColor"/></svg>'
  },
  {
    title: 'ERP Manufacture PT CBL',
    tags: ['NODE.JS', 'EXPRESS', 'MYSQL', 'REACT', 'VITE'],
    description: 'Enterprise Resource Planning system for PT Citra Berlian Lestari manufacturing operations and management.',
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7v-7zm4-3h2v10h-2V7zm4 6h2v4h-2v-4z" fill="currentColor"/></svg>'
  },
  {
    title: 'Event Booking Langkahsana',
    tags: ['NUXT.JS', 'VUE.JS', 'TAILWIND', 'TYPESCRIPT', 'POSTGRESQL'],
    description: 'Event booking platform for hiking community with schedule management and member registration system.',
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z" fill="currentColor"/></svg>'
  },
  {
    title: 'Inventory PT Indolakto',
    tags: ['FLUTTER', 'DART', 'FIREBASE'],
    description: 'Mobile inventory management system for PT Indolakto to track machine downtime and maintenance schedules.',
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" fill="currentColor"/></svg>'
  },
  {
    title: 'Morael Fashion Ecommerce',
    tags: ['VUE.JS', 'NESTJS', 'POSTGRESQL', 'TAILWIND'],
    description: 'Full-featured fashion e-commerce platform with product catalog, shopping cart, and order management.',
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/></svg>'
  },
  {
    title: 'Order Management Lab UPI',
    tags: ['NEXT.JS', 'REACT', 'NODE.JS', 'EXPRESS', 'MONGODB'],
    description: 'Laboratory order management system for Chemistry Instrumentation Lab at Universitas Pendidikan Indonesia.',
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 4.08-3.05 7.44-7 7.93v2.02c5.05-.5 9-4.76 9-9.95s-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm-1-11v6l5.25 3.15.75-1.23-4.5-2.67V8H11z" fill="currentColor"/></svg>'
  },
  {
    title: 'POS Coffee Shop',
    tags: ['LARAVEL', 'PHP', 'POSTGRESQL', 'TAILWIND'],
    description: 'Point of Sales system for coffee shop with inventory management, sales reporting, and cashier interface.',
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 17h20v2H2v-2zm11.84-9.21c.1-.24.16-.51.16-.79 0-1.1-.9-2-2-2s-2 .9-2 2c0 .28.06.55.16.79C9.25 8.6 8.12 9.68 8.12 11h.63c0-1.22.88-2.18 2.06-2.18s2.06.96 2.06 2.18h.63c0-1.32-1.13-2.4-2.66-3.21zM20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4v-2z" fill="currentColor"/></svg>'
  },
  {
    title: 'Spare Cable PT Telkom',
    tags: ['EXPRESS', 'NODE.JS', 'MONGODB'],
    description: 'Cable inventory and tracking management system for PT Telkom Infra spare parts distribution.',
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>'
  },
  {
    title: 'Webter Company Profile',
    tags: ['NEXT.JS', 'TAILWIND'],
    description: 'Modern and responsive company profile website for Webter Software Development showcasing services and portfolio.',
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" fill="currentColor"/></svg>'
  }
]

const contactInfo: ContactInfo[] = [
  { icon: '📧', label: 'Email', value: 'john.doe@example.com' },
  { icon: '📱', label: 'Phone', value: '+62 812 3456 7890' },
  { icon: '📍', label: 'Location', value: 'Jakarta, Indonesia' }
]