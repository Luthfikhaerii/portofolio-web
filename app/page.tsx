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

const techStack: TechStackItem[] = [
  {
    name: 'HTML',
    description: 'Markup Language',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>'
  },
  {
    name: 'CSS',
    description: 'Styling',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/></svg>'
  },
  {
    name: 'JavaScript',
    description: 'Programming Language',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>'
  },
  {
    name: 'TypeScript',
    description: 'Type-Safe JS',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>'
  },
    {
    name: 'Golang',
    description: 'Backend Language',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07zM.047 11.306c-.047 0-.059-.023-.035-.058l.245-.316c.023-.035.082-.058.129-.058h5.328c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.07-.105.07zm2.828 1.075c-.047 0-.059-.035-.035-.07l.163-.292c.023-.035.07-.07.117-.07h2.337c.047 0 .07.035.07.082l-.023.28c0 .047-.047.082-.082.082zm12.129-2.36c-.736.187-1.239.327-1.963.514-.176.046-.187.058-.34-.117-.174-.199-.303-.327-.548-.444-.737-.362-1.45-.257-2.115.175-.795.514-1.204 1.274-1.192 2.22.011.935.654 1.706 1.577 1.835.795.105 1.46-.175 1.987-.77.105-.13.198-.27.315-.434H10.47c-.245 0-.303-.152-.222-.35.152-.362.432-.97.596-1.274a.315.315 0 01.292-.187h4.253c-.023.316-.023.631-.07.947a4.983 4.983 0 01-.958 2.29c-.841 1.11-1.94 1.8-3.33 1.986-1.145.152-2.209-.07-3.143-.77-.865-.655-1.356-1.52-1.484-2.595-.152-1.274.222-2.419.993-3.424.83-1.086 1.928-1.776 3.272-2.02 1.098-.2 2.15-.07 3.096.571.62.41 1.063.97 1.356 1.648.07.105.023.164-.117.2m3.868 6.461c-1.064-.024-2.034-.328-2.852-1.029a3.665 3.665 0 01-1.262-2.255c-.21-1.32.152-2.489.947-3.529.853-1.122 1.881-1.706 3.272-1.95 1.192-.21 2.314-.095 3.33.595.923.63 1.496 1.484 1.648 2.605.198 1.578-.257 2.863-1.344 3.962-.771.783-1.718 1.273-2.805 1.495-.315.06-.63.07-.934.106zm2.78-4.72c-.011-.153-.011-.27-.034-.387-.21-1.157-1.274-1.81-2.384-1.554-1.087.245-1.788.935-2.045 2.033-.21.912.234 1.835 1.075 2.21.643.28 1.285.244 1.905-.07.923-.48 1.425-1.228 1.484-2.233z"/></svg>'
  },
  {
    name: 'PHP',
    description: 'Server Language',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174H11.46l-.704 3.625H9.388l1.23-6.327h1.367l-.327 1.682h1.218c.767 0 1.295.134 1.586.401s.378.7.263 1.299l-.572 2.944h-1.389zm7.597-2.265a2.782 2.782 0 0 1-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 0 1-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.682h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.751zm-.921-2.817h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995s-.523-.29-1.047-.29z"/></svg>'
  },
  {
    name: 'Laravel',
    description: 'PHP Framework',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027c-.008.002-.016.008-.024.01a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 01.023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034H.53L5.043.05a.375.375 0 01.375 0L9.93 2.647h.002c.015.01.027.021.04.033l.038.027c.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.021.013.032.01.031.014.064.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098.003-.01.01-.02.013-.032a.487.487 0 01.024-.059c.007-.012.018-.02.025-.033.012-.015.021-.03.033-.043.012-.012.025-.02.037-.028.014-.01.026-.023.041-.032h.001l4.513-2.598a.375.375 0 01.375 0l4.513 2.598c.016.01.027.021.042.031.012.01.025.018.036.028.013.014.022.03.034.044.008.012.019.021.024.033.011.02.018.04.024.06.006.01.012.021.015.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283zm-4.51 7.75v-4.287l-2.147 1.225-6.126 3.498v4.325zM1.093 3.624v14.588l8.273 4.761v-4.325l-4.322-2.445-.002-.003H5.04c-.014-.01-.025-.021-.04-.031-.011-.01-.024-.018-.035-.027l-.001-.002c-.013-.012-.021-.025-.031-.04-.01-.011-.021-.022-.028-.036h-.002c-.008-.014-.013-.031-.02-.047-.006-.016-.014-.027-.018-.043a.49.49 0 01-.008-.057c-.002-.014-.006-.027-.006-.041V5.789l-2.18-1.257zM5.23.81L1.47 2.974l3.76 2.164 3.758-2.164zm1.956 13.505l2.182-1.256V3.624l-1.58.91-2.182 1.255v9.435zm11.581-10.95l-3.76 2.163 3.76 2.163 3.759-2.164zm-.376 4.978L16.21 7.087 14.63 6.18v4.283l2.182 1.256 1.58.908zm-8.65 9.654l5.514-3.148 2.756-1.572-3.757-2.163-4.323 2.489-3.941 2.27z"/></svg>'
  },
  {
    name: 'Node.js',
    description: 'JavaScript Runtime',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z"/></svg>'
  },
  {
    name: 'Express',
    description: 'Node.js Framework',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 000 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957 6.272 6.272 0 01-7.306-.933 6.575 6.575 0 01-1.64-3.858c0-.235-.08-.455-.134-.666A88.33 88.33 0 010 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278-2.882-.04-4.944 2.094-5.071 5.264z"/></svg>'
  },
  {
    name: 'Jest',
    description: 'Testing Framework',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.251 11.82a3.117 3.117 0 0 0-2.328-3.01L22.911 0H8.104L11.092 8.81a3.116 3.116 0 0 0-2.244 2.988c0 1.245.716 2.32 1.761 2.844a3.986 3.986 0 0 1-2.164 1.685 4.004 4.004 0 0 1-3.297-.304 3.996 3.996 0 0 1-1.89-2.537 3.993 3.993 0 0 1 .252-2.537L.012 5.77a9.998 9.998 0 0 0 1.108 10.659 9.997 9.997 0 0 0 9.315 3.114 9.991 9.991 0 0 0 6.59-4.82 3.117 3.117 0 0 0 2.328-3.01c0-.106-.005-.212-.014-.317l2.914-5.753z"/></svg>'
  },
  {
    name: 'React',
    description: 'UI Library',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278z"/></svg>'
  },
  {
    name: 'Next.js',
    description: 'React Framework',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0z"/></svg>'
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-First CSS',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/></svg>'
  },
  {
    name: 'NestJS',
    description: 'Node.js Framework',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.131.047c-.173 0-.334.037-.483.087.316.21.49.49.576.806.007.043.019.074.025.117a.681.681 0 0 1 .013.112c.024.545-.143.99-.42 1.336-.203.265-.476.465-.756.618l.004.01c.002 0 .004.002.006.003l.012.004c.274.11.505.26.705.444a2.18 2.18 0 0 1 .517.724c.113.27.18.57.18.874 0 .004 0 .008-.002.012a3.01 3.01 0 0 1-.09.617 2.39 2.39 0 0 1-.26.558c-.02.035-.042.068-.063.101a2.3 2.3 0 0 1-.211.297l-.001.002c-.018.023-.033.048-.051.071l-.021.023c-.036.045-.072.09-.111.134l-.004.005-.016.018a2.1 2.1 0 0 1-.163.165v.001a2.4 2.4 0 0 1-.274.212c-.016.01-.03.022-.046.032a.924.924 0 0 1-.043.032c-.024.015-.045.031-.067.046-.011.008-.022.013-.033.02-.038.021-.076.044-.116.063-.04.02-.081.04-.123.057l-.003.002-.027.012-.003-.001c-.088.034-.172.07-.252.108-.07.033-.137.065-.200.097l-.012.005-.07.033c-.013.006-.024.012-.035.018l-.011.006-.008.003a.66.66 0 0 1-.036.016c-.08.03-.16.06-.239.089-.079.03-.159.058-.24.087-.082.03-.164.058-.247.086l-.086.031c-.083.03-.168.059-.254.087-.086.029-.173.057-.262.085l-.008.002-.011.003-.015.005c-.037.011-.074.023-.111.034l-.048.015c-.014.004-.028.008-.043.012l-.02.006c-.088.027-.177.053-.269.08l-.008.002-.012.003-.011.003a3.01 3.01 0 0 1-.149.045c-.075.024-.15.047-.227.07-.077.024-.154.047-.233.069l-.05.015c-.078.023-.158.045-.238.068-.08.023-.161.045-.244.067l-.047.013c-.081.023-.163.045-.247.067l-.012.003-.018.005c-.08.021-.161.042-.244.062-.083.02-.167.04-.252.058l-.011.003-.012.003c-.08.019-.16.037-.242.054l-.013.004-.009.001c-.162.034-.326.066-.492.097l-.013.002-.029.005c-.082.017-.166.031-.25.046-.084.016-.168.031-.253.046l-.008.001-.012.002c-.084.015-.169.03-.255.043-.086.014-.173.027-.26.04l-.006.002h-.001a10.27 10.27 0 0 1-.266.038l-.009.001-.006.001c-.088.012-.177.023-.266.034l-.012.001-.013.001c-.087.011-.175.021-.263.03l-.012.002c-.09.009-.18.018-.271.026l-.011.001-.014.001c-.088.008-.177.015-.267.022l-.014.001-.01.001c-.09.007-.18.013-.271.018l-.011.001h-.014c-.089.006-.178.01-.268.015l-.013.001h-.013c-.09.003-.18.006-.272.008h-.013c-.09.002-.18.003-.271.004H8.302c-.09-.001-.18-.002-.271-.004h-.013c-.091-.002-.181-.005-.272-.008h-.013l-.013-.001c-.089-.004-.178-.009-.268-.015h-.011l-.014-.001c-.09-.005-.18-.011-.271-.018l-.01-.001-.014-.001c-.089-.007-.178-.014-.267-.022l-.011-.001-.013-.001c-.09-.008-.18-.017-.271-.026l-.012-.002c-.088-.009-.176-.019-.263-.03l-.013-.001-.012-.001c-.089-.011-.177-.022-.266-.034l-.006-.001-.009-.001c-.089-.013-.178-.025-.266-.038h-.001l-.006-.002c-.087-.013-.174-.026-.26-.04-.086-.013-.171-.028-.255-.043l-.012-.002-.008-.001c-.085-.015-.169-.03-.253-.046-.084-.015-.168-.03-.25-.046l-.029-.005-.013-.002c-.166-.031-.33-.063-.492-.097l-.009-.001-.013-.004c-.082-.017-.162-.035-.242-.054l-.012-.003-.011-.003c-.085-.018-.169-.038-.252-.058-.083-.02-.164-.041-.244-.062l-.018-.005-.012-.003c-.084-.022-.166-.044-.247-.067l-.047-.013c-.083-.022-.164-.044-.244-.067-.08-.023-.16-.045-.238-.068l-.05-.015c-.079-.022-.156-.045-.233-.069-.077-.023-.152-.046-.227-.07a3.01 3.01 0 0 1-.149-.045l-.011-.003-.012-.003-.008-.002c-.092-.027-.181-.053-.269-.08l-.02-.006-.043-.012-.048-.015c-.037-.011-.074-.023-.111-.034l-.015-.005-.011-.003-.008-.002c-.089-.028-.176-.056-.262-.085-.086-.028-.171-.057-.254-.087l-.086-.031c-.083-.028-.165-.056-.247-.086-.081-.029-.161-.057-.24-.087-.079-.029-.159-.059-.239-.089a.66.66 0 0 1-.036-.016l-.008-.003-.011-.006-.035-.018-.07-.033-.012-.005c-.063-.032-.13-.064-.2-.097-.08-.038-.164-.074-.252-.108l-.003.001-.027-.012-.003-.002c-.042-.017-.083-.037-.123-.057-.04-.019-.078-.042-.116-.063-.011-.007-.022-.012-.033-.02-.022-.015-.043-.031-.067-.046a.924.924 0 0 1-.043-.032c-.016-.01-.03-.022-.046-.032a2.4 2.4 0 0 1-.274-.212v-.001a2.1 2.1 0 0 1-.163-.165l-.016-.018-.004-.005c-.039-.044-.075-.089-.111-.134l-.021-.023-.051-.071-.001-.002a2.3 2.3 0 0 1-.211-.297c-.021-.033-.043-.066-.063-.101a2.39 2.39 0 0 1-.26-.558 3.01 3.01 0 0 1-.09-.617 1.88 1.88 0 0 1-.002-.012c0-.004 0-.008.002-.012 0-.304.067-.604.18-.874.114-.27.281-.524.517-.724.2-.184.431-.334.705-.444l.012-.004.006-.003.004-.01c-.28-.153-.553-.353-.756-.618-.277-.346-.444-.791-.42-1.336.001-.037.007-.076.013-.112.006-.043.018-.074.025-.117.086-.316.26-.595.576-.806-.149-.05-.31-.087-.483-.087z"/></svg>'
  },
  {
    name: 'Vue.js',
    description: 'Progressive Framework',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z"/></svg>'
  },
  {
    name: 'Nuxt.js',
    description: 'Vue Framework',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.724 20.272l-3.713-6.236c-.279-.464-.544-.84-.93-.84-.386 0-.651.376-.93.84l-3.713 6.236h9.286zm-8.667 0H1.599L9.88 6.384l3.177 5.36zm1.95-13.192l-2.993 5.03-3.176-5.36L9.831.72c.279-.464.544-.84.93-.84.386 0 .651.376.93.84l3.993 6.72z"/></svg>'
  },
   {
    name: 'Gin',
    description: 'Go Web Framework',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.5 8.5c0 .276-.224.5-.5.5h-2c-.276 0-.5-.224-.5-.5v-2c0-.276.224-.5.5-.5h2c.276 0 .5.224.5.5v2zm-5 0c0 .276-.224.5-.5.5h-2c-.276 0-.5-.224-.5-.5v-2c0-.276.224-.5.5-.5h2c.276 0 .5.224.5.5v2zm-5 0c0 .276-.224.5-.5.5h-2c-.276 0-.5-.224-.5-.5v-2c0-.276.224-.5.5-.5h2c.276 0 .5.224.5.5v2zM6 12c0-.552.448-1 1-1h10c.552 0 1 .448 1 1v5c0 .552-.448 1-1 1H7c-.552 0-1-.448-1-1v-5z"/></svg>'
  },
  {
    name: 'MySQL',
    description: 'Relational Database',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 00-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53z"/></svg>'
  },
  {
    name: 'PostgreSQL',
    description: 'Database',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-.7822-.1876-.1742.0879-.3244.2441-.4878.3371a.5686.5686 0 0 1-.5571.0503c-.2943-.124-.5252-.3748-.7194-.6191-.044-.0562-.0814-.1185-.1253-.1811a.9767.9767 0 0 0-.0189-.0314c.0129-.0593.0189-.1185.0314-.1811.0408-.1938.0969-.3875.1659-.5752.0783-.2058.1847-.3748.3248-.5313.2621-.2938.6158-.5126.9443-.702.0659-.0376.1253-.0814.1972-.1189.016-.0066.0345-.0126.0503-.0189.1349-.0533.2697-.0939.4109-.1253.0533-.0095.1095-.016.166-.0189.0314 0 .0627-.0063.0972-.0063.0157 0 .0346 0 .0534.0063.1028.0063.2059.0157.3088.0346z"/></svg>'
  },
  {
    name: 'MongoDB',
    description: 'NoSQL Database',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"/></svg>'
  },
  {
    name: 'Firebase',
    description: 'Backend Platform',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z"/></svg>'
  },
  {
    name: 'Redis',
    description: 'In-Memory Database',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 2.661l.54.997-1.797.644 2.409.218.748 1.246a23.656 23.656 0 012.444-1.455L12 2.4zm1.906 8.41l-.452-.177.011-.107c-.034.08-.063.16-.102.24v.004l-.024.048c-.05.11-.102.22-.155.33l-.008.017-.015.03c-.093.182-.194.363-.298.543l-.011.02-.013.022c-.077.135-.155.27-.235.403l-.028.045-.02.03c-.012.024-.026.047-.04.07-.092.147-.186.292-.282.437l-.048.07a12.54 12.54 0 01-.176.256l-.05.07-.05.067a17.001 17.001 0 01-.363.456l-.012.015a5.029 5.029 0 01-.23.26l-.065.07c-.095.1-.192.198-.29.296l-.04.04-.088.084-.074.068a10.117 10.117 0 01-.36.314l-.05.042-.02.016c-.188.156-.38.308-.576.455l-.02.015-.02.015c-.062.047-.125.093-.189.138l-.066.046-.021.015c-.098.07-.197.137-.297.204l-.015.01-.04.026c-.14.092-.281.182-.424.268l-.024.015-.024.014c-.074.045-.15.09-.226.133l-.012.006a9.988 9.988 0 01-.539.287l-.042.02c-.153.076-.307.15-.463.221l-.01.004c-.106.048-.213.095-.321.14l-.028.011c-.135.056-.27.11-.407.162l-.01.004a12.959 12.959 0 01-.59.21l-.014.005c-.117.04-.235.078-.354.115l-.024.007c-.157.048-.315.094-.474.138l-.01.002c-.115.032-.231.063-.348.092l-.04.01c-.136.034-.273.066-.411.096l-.01.002c-.106.024-.213.046-.32.067l-.055.01c-.138.027-.277.053-.416.076l-.005.001a20.154 20.154 0 01-.648.094l-.015.002c-.118.015-.237.028-.356.04l-.07.007c-.136.013-.273.025-.41.035h-.013c-.107.008-.214.015-.321.02l-.092.005c-.14.006-.281.01-.422.012h-.031a22.07 22.07 0 01-.606-.004h-.006l-.024-.001a20.597 20.597 0 01-.548-.023l-.005-.001a18.41 18.41 0 01-.487-.037l-.03-.003a16.927 16.927 0 01-.465-.055l-.028-.004a14.826 14.826 0 01-.436-.067l-.034-.006a12.955 12.955 0 01-.4-.076l-.04-.008a10.61 10.61 0 01-.357-.084l-.044-.011a8.597 8.597 0 01-.31-.086l-.047-.014a6.91 6.91 0 01-.26-.084l-.048-.017a5.425 5.425 0 01-.208-.079l-.047-.019a4.077 4.077 0 01-.157-.066l-.042-.019a2.865 2.865 0 01-.105-.05l-.033-.016-.048-.028-.029-.015a.694.694 0 01-.023-.015l-.008-.005-.014-.01.005-.002.055-.027.007-.004.065-.03.013-.007.074-.033.015-.007.082-.036.016-.007.09-.038.013-.005.094-.039.01-.004.1-.04.008-.003.104-.04.005-.002.106-.04h.002l.108-.038.005-.002.11-.036.004-.001.11-.034.002-.001.113-.032h.001l.113-.03.112-.027.005-.001.112-.024h.001l.112-.021.112-.019.004-.001.111-.016.005-.001.11-.012.11-.01h.002l.109-.007.004-.001.107-.003h.105l.103.002.101.004.098.006.095.008.092.01.088.012.085.015.081.017.076.02.072.022.067.024.062.026.056.028.052.03.045.03.04.033.034.034.028.035.022.036.015.038.008.038.002.038-.005.038-.011.037-.017.037-.023.035-.03.035-.035.033-.04.031-.046.03-.05.027-.056.025-.062.023-.066.021-.072.019-.076.016-.081.015-.085.012-.089.01-.093.008-.097.005-.101.003-.105.001-.107-.001-.11-.003-.113-.006-.115-.008-.117-.011-.118-.013-.121-.016-.122-.018-.124-.02-.125-.023-.126-.026-.126-.028-.127-.03-.127-.034-.127-.036-.126-.038-.126-.04-.124-.043-.123-.045-.121-.048-.12-.05-.117-.052-.114-.054-.111-.056-.108-.059-.104-.06-.1-.062-.095-.065-.09-.067-.086-.068-.08-.07-.075-.073-.069-.074-.063-.076-.057-.078-.05-.08-.044-.08-.037-.083-.03-.083-.023-.085-.016-.086-.01-.087-.002-.087.005-.087.012-.088.018-.087.025-.087.032-.086.038-.086.044-.085.05-.084.056-.083.062-.081.068-.08.073-.078.078-.076.083-.074.089-.072.093-.069.098-.067.102-.064.106-.061.11-.058.114-.056.117-.052.121-.05.125-.046.128-.044.13-.04.134-.038.136-.034.139-.032.141-.028.143-.026.145-.022.147-.02.148-.016.15-.014.151-.01.152-.008.153-.004.154-.002.154.002.154.004.154.008.153.012.152.016.15.02.15.023.148.027.146.031.144.035.141.039.14.042.137.046.134.05.131.053.128.056.125.06.121.062.117.066.114.068.109.072.105.074.101.078.096.08.091.084.086.086.081.09.075.092.07.095.064.098.058.1.051.103.046.105.039.108.033.11.026.112.02.114.013.116.006.117v.12l-.007.119-.013.12-.02.12-.026.118-.033.118-.039.117-.045.115-.052.114-.058.113-.064.11-.07.109-.075.106-.082.105-.087.102-.093.1-.099.096-.105.094-.11.09-.116.087-.121.083-.126.08-.131.075-.135.073-.14.068-.145.065-.149.06-.153.057-.157.052-.161.049-.165.044-.168.04-.172.035-.175.031-.178.026-.182.022-.184.017-.188.012-.19.008-.193.003h-.196l-.198-.004-.2-.008-.202-.013-.205-.017-.206-.022-.208-.026-.21-.03-.211-.035-.213-.039-.214-.043-.215-.048-.216-.052-.217-.055-.217-.06-.217-.063-.217-.067-.216-.07-.216-.074-.215-.078-.213-.081-.212-.085-.211-.088-.209-.091-.207-.095-.204-.098-.202-.101-.199-.104-.196-.107-.193-.11-.189-.113-.186-.115-.182-.118-.178-.121-.175-.124-.17-.126-.166-.128-.161-.131-.157-.133-.152-.136-.147-.137-.142-.14-.137-.142-.131-.144-.126-.145-.12-.147-.114-.149-.108-.15-.102-.152-.096-.153-.089-.154-.083-.155-.077-.156-.07-.157-.064-.157-.057-.158-.051-.158-.044-.158-.037-.158-.03-.158-.023-.157-.016-.157-.009-.156-.002-.155.005-.155.011-.155.018-.154.024-.153.03-.153.037-.152.043-.15.049-.15.055-.148.061-.148.067-.146.072-.145.078-.143.083-.141.089-.14.094-.137.099-.136.105-.133.109-.131.115-.129.119-.126.125-.124.129-.121.134-.118.138-.116.143-.113.147-.11.151-.107.155-.103.159-.1.162-.096.166-.093.169-.089.173-.085.176-.081.179-.077.182-.072.185-.069.187-.064.19-.06.192-.056.194-.051.196-.047.198-.042.2-.038.201-.033.203-.028.204-.023.205-.019.206-.014.206-.009.207-.004.207.001.207.005.206.01.206.015.205.019.204.024.202.028.201.033.199.037.197.041.195.046.192.05.189.054.186.058.183.062.179.066.176.07.172.073.168.077.163.081.159.084.154.088.149.091.143.094.138.097.132.1.126.103.12.106.113.108.106.111.1.113.092.116.085.117.077.12.07.121.062.123.053.124.045.125.037.126.028.127.019.127.01.127.001.127v.252l-.01.126-.019.126-.028.125-.036.125-.046.124-.054.123-.063.122-.072.121-.081.119-.089.117-.098.116-.106.113-.115.111-.123.108-.131.106-.14.102-.148.1-.155.096-.163.093-.171.089-.178.084-.186.081-.193.076-.2.073-.206.068-.213.064-.219.06-.226.055-.232.05-.237.046-.243.041-.248.036-.253.031-.257.026-.262.02-.266.016-.27.01-.274.005-.277-.001-.281-.006-.284-.012-.287-.017-.29-.023-.293-.028-.295-.034-.297-.039-.299-.044-.301-.05-.302-.055-.303-.06-.304-.065-.305-.07-.305-.075-.304-.08-.304-.084-.303-.089-.302-.093-.3-.098-.299-.102-.296-.106-.294-.111-.291-.115-.288-.119-.284-.123-.281-.126-.277-.131-.272-.134-.268-.138-.263-.141-.258-.145-.253-.148-.247-.151-.241-.155-.235-.157-.229-.16-.222-.163-.215-.166-.208-.168-.2-.171-.192-.173-.184-.175-.175-.176-.166-.179-.157-.18-.148-.182-.138-.183-.128-.185-.118-.186-.107-.187-.096-.188-.085-.189-.073-.19-.062-.19-.05-.191-.038-.191-.026-.191-.013-.191-.001-.191.011-.191.024-.191.036-.19.048-.19.06-.189.072-.188.084-.187.095-.185.107-.184.118-.182.13-.18.14-.178.152-.176.162-.173.173-.17.184-.167.194-.163.204-.16.213-.155.223-.151.232-.146.241-.141.25-.136.258-.13.266-.125.273-.118.281-.113.287-.106.294-.1.3-.093.305-.086.31-.079.316-.071.32-.064.324-.056.327-.048.33-.04.332-.031.334-.023.335-.015.336-.006.336.003.336.011.335.02.334.028.333.037.33.045.328.054.326.062.322.07.319.078.315.086.31.094.306.102.3.109.295.117.289.125.283.133.276.14.269.148.262.155.254.163.245.17.237.177.227.185.218.192.207.199.197.206.186.213.175.219.163.226.151.232.139.238.126.244.113.25.1.255.086.26.072.265.058.27.043.274.028.278.013.282-.002.285-.017.289-.032.292-.047.295-.062.297-.077.3-.091.302-.106.303-.12.305-.134.306-.148.306-.162.307-.176.307-.189.307-.203.306-.216.305-.229.304-.242.302-.255.3-.267.297-.279.294-.29.291-.302.286-.313.282-.324.277-.334.271-.344.265-.354.258-.363.251-.371.244-.38.236-.387.227-.395.219-.401.21-.408.2-.414.19-.42.18-.424.17-.43.158-.434.147-.438.136-.441.123-.444.111-.446.098-.448.084-.449.07-.45.056-.45.041-.449.026-.448.01-.446-.006-.444-.021-.441-.037-.438-.052-.434-.068-.43-.083-.424-.098-.419-.113-.412-.127-.405-.142-.397-.155-.389-.17-.38-.183-.371-.196-.361-.21-.351-.222-.34-.235-.329-.247-.317-.259-.304-.271-.291-.282-.277-.294-.263-.304-.248-.315-.232-.325-.216-.334-.199-.343-.182-.351-.164-.359-.145-.366-.127-.373-.107-.379-.087-.384-.067-.39-.046-.394-.024-.398-.003-.4.019-.402.041-.403.062-.403.084-.403.106-.402.127-.4.149-.397.17-.394.191-.391.211-.386.232-.38.252-.375.271-.368.291-.36.31-.353.329-.343.347-.334.365-.323.382-.312.399-.3.415-.288.43-.274.445-.26.458-.245.471-.229.482-.213.492-.196.501-.178.509-.16.516-.141.521-.121.526-.101.529-.08.531-.058.532-.036.532-.014.53.009.528.031.524.053.52.075.514.096.508.117.5.137.492.156.482.175.472.193.461.211.449.227.436.243.422.258.408.272.392.286.376.299.359.311.341.322.323.333.303.342.283.351.262.359.24.366.217.372.194.377.17.381.145.384.12.386.094.387.067.386.04.385.012.383-.016.38-.044.376-.072.371-.099.365-.126.358-.153.35-.179.341-.204.33-.229.319-.254.306-.277.292-.301.277-.323.261-.345.244-.366.226-.386.207-.405.187-.423.166-.439.144-.455.121-.469.098-.482.073-.494.048-.504.022-.513-.004-.521-.03-.527-.056-.532-.081-.536-.106-.539-.13-.54-.154-.540-.178-.538-.201-.535-.223-.531-.245-.525-.266-.518-.286-.51-.305-.5-.324-.49-.341-.478-.357-.465-.373-.451-.388-.436-.401-.42-.414-.403-.426-.384-.437-.365-.447-.344-.456-.323-.464-.3-.471-.277-.477-.253-.482-.228-.486-.203-.489-.177-.491-.15-.492-.123-.492-.095-.491-.067-.489-.038-.486-.009-.482.02-.477.05-.472.079-.465.108-.458.136-.45.165-.44.192-.43.22-.42.246-.408.272-.395.298-.382.323-.368.347-.352.371-.336.394-.319.416-.301.437-.282.458-.262.477-.241.495-.22.512-.197.528-.173.542-.149.555-.124.567-.098.577-.071.586-.044.593-.016.6.012.605.04.609.068.612.096.614.123.615.15.614.176.613.201.61.226.606.25.602.273.596.296.589.317.581.338.572.358.562.377.551.395.539.412.526.428.512.443.497.457.481.47.464.482.446.494.427.504.407.513.386.522.365.529.342.536.319.541.295.546.27.549.245.552.219.553.192.554.165.553.137.551.109.548.08.544.051.539.021.533-.009.527-.039.519-.069.511-.098.501-.127.491-.156.479-.184.467-.212.454-.238.44-.265.425-.29.409-.315.392-.339.374-.362.355-.385.335-.406.314-.427.292-.447.269-.466.246-.483.221-.5.196-.515.169-.529.143-.542.115-.554.086-.564.057-.573.027-.581-.003-.588-.034-.593-.064-.597-.094-.6-.123-.602-.152-.602-.181-.601-.209-.599-.236-.595-.263-.59-.289-.584-.314-.576-.338-.567-.361-.557-.383-.546-.404-.533-.424-.52-.443-.505-.461-.489-.478-.472-.494-.454-.508-.434-.522-.414-.534-.392-.546-.37-.556-.346-.565-.322-.573-.297-.58-.271-.585-.244-.59-.216-.593-.188-.595-.159-.596-.129-.595-.098-.593-.067-.59-.035-.586-.003-.58.029-.574.061-.566.093-.557.124-.547.155-.536.185-.523.214-.51.243-.495.27-.48.297-.463.323-.445.348-.426.372-.406.395-.385.416-.363.437-.34.456-.316.474-.291.491-.265.507-.238.521-.21.534-.181.546-.152.556-.121.565-.09.572-.058.578-.026.583.007.586.039.589.071.59.103.59.134.589.165.586.195.582.224.577.252.571.279.563.306.554.331.544.355.533.378.52.4.507.421.492.44.476.459.459.476.441.492.422.507.401.52.38.532.357.543.334.552.31.561.285.568.259.574.232.578.205.582.176.584.147.585.117.584.087.583.056.58.024.577-.008.572-.04.566-.072.559-.103.551-.134.541-.164.531-.194.519-.223.507-.251.493-.279.478-.305.462-.331.445-.355.427-.378.408-.4.388-.42.367-.44.345-.458.322-.475.298-.491.273-.506.247-.519.22-.531.192-.542.163-.551.133-.559.103-.566.071-.571.039-.576.007-.579-.025-.581-.058-.582-.09-.581-.122-.579-.153-.576-.184-.572-.213-.567-.242-.56-.27-.553-.297-.544-.323-.534-.348-.523-.372-.51-.395-.497-.417-.482-.438-.467-.458-.45-.476-.433-.494-.414-.51-.395-.525-.374-.539-.353-.552-.33-.563-.307-.573-.283-.582-.258-.589-.232-.595-.206-.6-.179-.604-.151-.607-.123-.608-.094-.608-.065-.607-.035-.605-.005-.601.025-.596.056-.59.086-.583.115-.575.145-.566.173-.556.201-.545.229-.533.256-.52.282-.506.307-.49.332-.474.355-.456.378-.438.4-.418.42-.398.44-.377.458-.354.475-.331.491-.307.506-.282.52-.256.532-.229.543-.201.553-.173.562-.144.569-.114.575-.084.58-.053.584-.022.587.01.588.04.589.071.588.101.586.131.583.16.578.189.572.217.565.244.556.271.546.296.535.321.522.345.508.368.493.39.476.411.459.431.44.45.42.467.4.484.378.499.355.513.331.525.306.537.281.547.254.556.227.564.198.57.169.575.139.579.109.582.077.583.046.584.013.583-.019.581-.051.577-.083.573-.114.567-.145.56-.175.551-.205.541-.234.53-.262.517-.29.503-.316.488-.342.471-.367.454-.39.435-.413.416-.434.395-.454.373-.473.35-.491.326-.507.301-.523.275-.537.248-.55.22-.562.191-.572.161-.581.13-.589.099-.595.067-.601.034-.605.001-.609-.033-.611-.066-.612-.1-.612-.133-.61-.165-.608-.197-.604-.228-.599-.258-.593-.287-.586-.315-.577-.342-.567-.368-.556-.393-.543-.417-.53-.44-.515-.462-.499-.483-.482-.503-.463-.521-.444-.538-.423-.554-.402-.568-.379-.581-.356-.593-.331-.604-.306-.613-.28-.621-.253-.628-.225-.634-.196-.638-.166-.641-.136-.643-.105-.644-.073-.643-.041-.641-.009-.638.024-.633.056-.627.088-.62.12-.611.151-.601.181-.59.21-.578.239-.564.267-.55.294-.534.319-.517.344-.499.368-.48.39-.46.412-.438.433-.416.452-.392.471-.368.488-.342.504-.316.519-.289.532-.261.544-.232.555-.202.564-.172.572-.14.578-.108.584-.075.588-.041.591-.007.593.028.594.062.593.097.591.131.588.164.583.197.577.229.57.26.562.29.553.319.542.347.53.374.517.4.502.425.487.449.47.471.452.493.433.513.412.532.391.55.368.566.345.581.32.595.295.607.268.618.241.628.213.636.184.643.154.649.123.653.092.657.06.659.027.66-.006.659-.04.657-.074.654-.107.649-.141.643-.173.636-.205.627-.236.617-.266.606-.295.593-.323.58-.35.565-.375.549-.4.531-.423.513-.445.493-.466.472-.486.45-.504.427-.521.402-.537.377-.551.35-.564.322-.576.294-.586.264-.595.234-.602.202-.608.17-.613.137-.616.103-.619.068-.619.033-.619-.003-.617-.038-.615-.074-.61-.109-.605-.143-.598-.177-.59-.21-.581-.242-.57-.273-.559-.303-.546-.332-.532-.36-.517-.386-.5-.412-.483-.436-.464-.459-.444-.481-.423-.502-.401-.522-.378-.54-.354-.557-.329-.572-.303-.586-.276-.599-.248-.61-.219-.62-.189-.628-.159-.635-.127-.64-.095-.644-.062-.647-.029-.648.005-.648.038-.647.072-.644.105-.64.138-.635.17-.628.202-.62.233-.611.263-.6.292-.588.32-.575.347-.56.373-.544.398-.527.421-.509.444-.49.465-.469.485-.448.503-.425.52-.401.536-.377.55-.351.563-.325.574-.298.584-.27.593-.241.6-.211.606-.18.61-.149.613-.116.614-.083.614-.05.613-.015.61.019.606.053.601.087.595.12.588.152.579.184.57.215.559.245.547.274.534.302.52.329.505.355.488.38.471.403.452.426.432.447.411.467.389.486.366.503.342.52.317.535.291.549.264.561.236.573.207.583.177.591.146.599.114.605.081.61.048.614.014.616-.02.617-.054.617-.088.615-.122.612-.155.608-.188.603-.22.596-.251.589-.282.58-.311.57-.34.559-.367.547-.394.533-.42.519-.444.503-.468.486-.49.468-.511.449-.531.429-.55.407-.567.385-.583.361-.598.336-.612.311-.624.284-.635.256-.645.228-.653.198-.66.168-.666.136-.67.104-.674.071-.676.038-.678.003-.678-.031-.677-.065-.675-.099-.672-.132-.668-.164-.663-.196-.656-.227-.649-.257-.64-.286-.631-.314-.62-.341-.608-.367-.595-.392-.581-.416-.566-.439-.549-.46-.532-.481-.513-.501-.493-.52-.472-.538-.45-.555-.427-.57-.403-.585-.378-.598-.352-.61-.325-.621-.297-.63-.268-.639-.237-.645-.206-.651-.174-.656-.141-.659-.107-.661-.073-.662-.038-.662-.003-.66.033-.657.068-.653.103-.648.137-.641.171-.634.204-.625.236-.615.267-.604.297-.592.326-.579.354-.564.381-.549.407-.532.432-.514.455-.495.478-.475.499-.453.519-.431.538-.408.555-.383.572-.358.587-.331.601-.304.614-.275.625-.246.635-.215.644-.184.651-.151.658-.118.663-.084.667-.049.67-.014.671.022.67.057.669.093.666.128.661.163.656.197.649.23.641.262.632.294.621.324.61.354.597.382.582.41.567.437.55.462.532.487.513.51.493.532.472.553.449.572.426.59.401.607.376.623.349.637.321.65.293.662.263.672.233.681.201.689.169.695.136.701.102.705.068.708.032.71-.004.71-.041.709-.077.707-.113.703-.149.698-.184.692-.218.685-.252.676-.284.666-.316.655-.346.643-.376.629-.404.615-.431.599-.457.582-.482.564-.506.545-.528.525-.549.503-.569.481-.587.457-.604.432-.62.407-.634.38-.648.352-.66.323-.671.293-.68.262-.689.23-.696.197-.702.163-.707.128-.711.092-.714.056-.716.019-.716-.018-.716-.055-.714-.092-.712-.129-.708-.165-.703-.201-.697-.236-.69-.27-.682-.303-.672-.335-.662-.366-.65-.396-.637-.425-.623-.453-.608-.48-.591-.506-.574-.53-.555-.554-.535-.576-.514-.597-.492-.617-.469-.636-.445-.653-.42-.669-.394-.684-.368-.697-.34-.709-.311-.72-.282-.729-.252-.737-.22-.744-.188-.75-.155-.754-.121-.757-.087-.759-.051-.759-.016-.759.02-.757.056-.755.092-.751.127-.746.163-.74.197-.733.231-.724.264-.715.296-.704.328-.692.358-.679.387-.665.415-.65.443-.633.469-.616.494-.597.519-.577.542-.556.564-.535.585-.512.604-.488.623-.463.64-.438.656-.411.671-.383.684-.355.696-.325.707-.295.717-.264.725-.231.732-.198.738-.165.743-.13.747-.095.75-.059.752-.023.752.014.751.05.749.086.745.122.741.157.735.192.728.226.72.259.711.291.7.322.689.352.676.381.662.409.647.436.631.462.614.487.595.511.576.534.556.556.534.577.512.596.488.615.464.632.439.648.412.663.385.677.357.69.327.701.297.711.265.72.233.727.2.734.166.739.131.743.095.746.059.748.022.749-.015.748-.051.747-.088.744-.124.739-.16.734-.195.727-.23.719-.264.71-.297.7-.329.688-.36.676-.39.662-.419.647-.447.631-.474.614-.5.596-.525.577-.548.557-.571.536-.592.514-.612.491-.631.467-.649.442-.665.416-.68.389-.694.361-.706.333-.718.303-.727.273-.736.241-.744.209-.75.176-.755.143-.759.108-.762.073-.764.038-.765.001-.764-.035-.763-.071-.76-.107-.757-.142-.752-.177-.747-.211-.74-.245-.732-.277-.723-.309-.713-.34-.701-.37-.689-.398-.675-.426-.661-.453-.645-.479-.628-.504-.61-.528-.591-.551-.571-.573-.55-.594-.528-.613-.506-.632-.482-.649-.458-.665-.432-.68-.406-.694-.378-.707-.35-.718-.321-.729-.291-.738-.26-.746-.228-.753-.195-.759-.161-.763-.127-.767-.092-.77-.056-.771-.021-.772.015-.771.051-.769.087-.766.123-.762.158-.757.193-.751.227-.744.26-.736.292-.726.323-.716.353-.705.382-.692.41-.679.437-.665.463-.649.488-.633.512-.615.535-.597.557-.578.578-.557.598-.536.616-.513.634-.49.65-.465.665-.44.679-.413.692-.386.703-.358.714-.329.723-.299.732-.268.739-.236.745-.203.751-.17.755-.135.758-.1.76-.065.761-.029.761.007.76.043.758.079.754.114.75.149.745.183.738.217.731.25.722.282.713.313.702.343.691.371.678.399.665.426.65.451.635.476.618.5.6.522.582.544.562.565.542.584.52.603.498.62.475.636.451.652.426.666.4.679.373.691.345.702.316.712.286.721.255.728.223.735.19.741.156.745.122.749.086.751.05.753.014.753-.022.752-.059.75-.095.746-.131.742-.166.737-.201.731-.235.723-.268.715-.3.705-.331.694-.361.683-.39.67-.418.656-.445.641-.471.625-.497.607-.521.589-.545.569-.567.549-.589.527-.609.505-.628.481-.646.457-.663.431-.679.405-.694.377-.707.349-.72.32-.731.289-.741.258-.749.226-.757.193-.763.159-.769.124-.773.089-.776.053-.778.017-.779-.02-.778-.056-.777-.092-.775-.128-.771-.163-.767-.197-.761-.232-.754-.265-.747-.297-.738-.329-.728-.36-.717-.39-.705-.419-.691-.447-.677-.475-.661-.501-.645-.526-.628-.55-.61-.573-.591-.595-.571-.616-.55-.636-.528-.655-.505-.672-.482-.688-.457-.704-.432-.718-.405-.732-.378-.744-.35-.756-.32-.766-.29-.775-.259-.783-.227-.79-.194-.796-.16-.801-.126-.804-.091-.807-.055-.808-.019-.809.017-.809.054-.807.09-.805.126-.801.161-.797.196-.791.23-.784.263-.776.295-.767.326-.757.356-.746.385-.733.413-.72.44-.706.466-.691.492-.674.516-.657.539-.639.561-.619.583-.599.603-.577.622-.555.64-.531.657-.507.673-.482.687-.456.701-.429.713-.401.724-.372.734-.343.743-.312.75-.281.757-.248.762-.215.767-.181.771-.146.773-.111.775-.074.776-.038.776v.762z"/></svg>'
  },
  {
    name: 'GitHub',
    description: 'Version Control',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>'
  },
  {
    name: 'Docker',
    description: 'Containerization',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.03-1.01.089-1.161-7.155-7.654-7.155-7.654-7.155v.1c-1.046.262-2.035.625-2.947 1.084L9.884 3.2c-.318.062-.63.152-.93.265-.263.098-.514.214-.754.346l-.005.002v.003c-.043.023-.084.048-.125.073-.362.201-.71.424-1.043.667v.001c-.002.002-.004.003-.006.004-.226.155-.446.318-.658.491-.024.02-.046.042-.068.063-.018.016-.036.033-.054.05l-.005.005-.005.004c-.124.118-.245.239-.363.363-.013.012-.026.025-.038.038a10.46 10.46 0 00-.337.363c-.01.012-.02.023-.03.035-.123.14-.24.284-.354.432-.008.01-.015.02-.023.03-.01.013-.02.026-.03.039v.001a10.48 10.48 0 00-.31.448l-.001.001-.002.003a8.953 8.953 0 00-.271.424l-.002.003-.001.002c-.107.18-.208.367-.305.558l-.002.004-.001.002c-.006.012-.013.024-.019.037-.095.183-.185.37-.27.562l-.002.006-.001.002c-.083.188-.161.38-.234.575l-.002.006-.001.002c-.071.19-.138.384-.2.58l-.002.005v.002c-.06.195-.117.393-.168.593l-.001.005-.001.002c-.051.2-.097.403-.139.608l-.001.005v.002c-.041.204-.078.41-.11.618l-.001.005v.002c-.032.207-.06.416-.083.626l-.001.005v.003c-.022.209-.039.42-.051.632l-.001.004v.003c-.012.21-.019.422-.019.635v.005.003c0 .211.007.422.019.632v.003l.001.004c.012.21.029.421.051.631v.003l.001.005c.023.21.051.419.083.626v.002l.001.005c.032.208.069.414.11.618v.002l.001.005c.042.205.088.408.139.608l.001.002.001.005c.051.2.108.398.168.593v.002l.002.005c.062.196.129.39.2.58l.001.002.002.006c.073.195.151.387.234.575l.001.002.002.006c.085.192.175.379.27.562l.001.002.002.004c.019.037.038.074.058.111l.001.002.002.004c.097.19.198.376.305.558l.001.002.002.003c.089.141.18.279.273.416l.002.003.001.002.03.039.001.001.001.002c.114.148.231.292.354.432l.03.035c.097.12.197.238.301.354l.006.007.005.005c.012.013.025.026.038.038.118.124.239.245.363.363l.005.004.005.005c.018.017.036.034.054.05.022.021.044.043.068.063.212.173.432.336.658.491.002.001.004.002.006.004v.001c.333.243.681.466 1.043.667.041.025.082.05.125.073v.003l.005.002c.24.132.491.248.754.346.3.113.612.203.93.265l.313.296c.897.45 1.871.803 2.906 1.065v.1s6.493 0 7.654-7.155c.334.059.672.089 1.01.089 1.282 0 1.889-.459 1.954-.51a7.603 7.603 0 001.592-4.48c-.002-2.152-.88-4.096-2.294-5.497z"/></svg>'
  },
  {
    name: 'Supabase',
    description: 'Backend Platform',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.277 23.993c-.338.655-1.295.593-1.533-.099l-5.181-15.048h10.696c.85 0 1.344.986.839 1.673l-4.821 13.474zm-8.55-13.474l5.181-15.048c.238-.692 1.195-.754 1.533-.099l4.821 13.474H4.565c-.85 0-1.344-.986-.839-1.673l.001-.001z"/></svg>'
  },
  {
    name: 'GitHub Action',
    description: 'CI/CD Pipeline',
    icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>'
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