/* ============================================================================
   KHALED: THE GAME · all words in one place.
   Edit text here, save, reload the page. Each level has `notes` per click
   (beat): the lines you say. Press N (overlay) or P (presenter window).
   ========================================================================== */
window.GAME = {

  player: {
    name: "Khaled Abdelhadi",
    first: "KHALED",
    last: "ABDELHADI",
    tagline: "From cooling trucks to closing deals.",
    event: "BVS Sales School · Introduction",
    email: "kabdelhadi795@gmail.com",
    linkedin: "linkedin.com/in/khaled-de",
    site: "k95-de.github.io/cv"
  },

  /* time budget in seconds per level (presenter timer). Total = 600 = 10 min */
  levels: [
    { id: "title",     world: 0, name: "Press Start",      topic: "",                         secs: 25 },
    { id: "origins",   world: 1, name: "Origins",          topic: "Personal background",      secs: 65 },
    { id: "blueprint", world: 2, name: "The Blueprint",    topic: "Education",                secs: 40 },
    { id: "plant",     world: 3, name: "The Plant",        topic: "Professional experience",  secs: 140 },
    { id: "skills",    world: 4, name: "Skill Tree",       topic: "Training & certificates",  secs: 55 },
    { id: "arcade",    world: 5, name: "Arcade",           topic: "Hobbies & interests",      secs: 90 },
    { id: "stats",     world: 6, name: "Player Stats",     topic: "Strengths & development",  secs: 75 },
    { id: "mission",   world: 7, name: "Next Mission",     topic: "Sales School objectives",  secs: 110 }
  ],

  notes: {
    title: [
      "Hi everyone. Instead of slides, I built you a small game. Let me press start.",
      "Seven worlds, one for each part of my story. Background, education, experience, training, hobbies, strengths, and what I want from Sales School. Let's go."
    ],
    origins: [
      "I'm Khaled. German-Egyptian, but born and raised in Riyadh, Saudi Arabia. That's little me, and me with my dad. I went to high school at Choueifat. Today I live in Nuremberg, and I speak Arabic, English and German.",
      "After school I started engineering in 2013 at METU in Northern Cyprus, then went back to Riyadh and finished my Bachelor's at Alfaisal University.",
      "During university we built and raced an eco car at Shell Eco-marathon Asia in Singapore. That's where I got hooked on building things.",
      "In 2019 I moved to Germany for my Master's in Esslingen, and from 2020 I worked in Nuremberg for MAN and TRATON.",
      "And now the next stop is BVS."
    ],
    blueprint: [
      "Bachelor's in Mechanical Engineering. Started at METU, finished at Alfaisal University in Riyadh in 2018.",
      "Master's in Design and Development, Mechanical and Automotive Engineering, at Hochschule Esslingen, 2019 to 2021. My final project was at MAN.",
      "Two degrees, two countries. Approved."
    ],
    plant: [
      "This is my work experience as a piping system. I spent five years making fluids flow, so this felt right. First station: student years. I built a carbon-fibre car body for Shell Eco-marathon and steel moulds at Alfanar.",
      "2020 in Germany. At A123 Systems I turned JIRA data into project KPIs. At Formula Student I made the carbon chassis lighter and stiffer.",
      "Then MAN Truck & Bus. I built the e-motor cooling model for an electric bus from scratch. It became the base for later studies. I also found hotspots before hardware testing.",
      "From 2022 to 2026, vehicle cooling systems at MAN and TRATON, for trucks and buses, from engineer to expert. Electric, diesel and hydrogen. I presented results to project leads and customers, and wrote the method guide the team uses.",
      "And at the end of every cooling circuit sits the radiator. Heat out, ready for the next job."
    ],
    skills: [
      "I never stopped learning. Here is my skill tree.",
      "On the engineering side: industrial piping design, applied CFD with Siemens, BIM, and simulation automation.",
      "On the digital side: AI for design, Python with IBM, and Claude 101 and Claude Code from Anthropic. And this month I start CATIA and 3D printing at the IHK.",
      "And I use it. I built this presentation myself, plus my interactive CV and a trainer to learn the BVS and IBM portfolio."
    ],
    arcade: [
      "Now the fun part. These are my hobbies.",
      "Ping pong first. Here's a quick match. Khaled versus the computer.",
      "I'm a car enthusiast. On Xbox I play a lot of Forza Horizon.",
      "Training mode. I go to the gym, and I love jumping rope, boxing style.",
      "And when I relax: the ukulele. I also cycle and swim."
    ],
    stats: [
      "My strengths, each with a real example from my work.",
      "And where I'm levelling up. My job will be to sit with the client, understand the problem, and pick the right technology with its pros and cons. For that I'm learning the BVS portfolio and the client side of the work."
    ],
    mission: [
      "My objective: help BVS hit its growth targets. Here's my plan for the first few months.",
      "What I expect from Sales School, and what I bring to the team.",
      "Player one is ready. Thank you. I'm happy to take your questions."
    ]
  },

  origins: {
    profile: {
      kicker: "Player profile",
      lines: [
        ["Citizenship", "German · Egyptian"],
        ["Born & raised", "Riyadh, Saudi Arabia"],
        ["Home base", "Nuremberg, Germany"],
        ["Languages", "Arabic (native) · English (fluent) · German (professional)"]
      ]
    },
    places: {
      egypt:     { lon: 31.24, lat: 30.04, label: "Egypt",        sub: "Roots" },
      cyprus:    { lon: 32.98, lat: 35.25, label: "N. Cyprus",    sub: "METU · 2013" },
      riyadh:    { lon: 46.68, lat: 24.71, label: "Riyadh",       sub: "Born & raised · Choueifat · Alfaisal" },
      singapore: { lon: 103.82, lat: 1.35, label: "Singapore",    sub: "Shell Eco-marathon Asia" },
      esslingen: { lon: 9.31,  lat: 48.74, label: "Esslingen",    sub: "Master's · 2019" },
      nuremberg: { lon: 11.08, lat: 49.45, label: "Nuremberg",    sub: "MAN · TRATON · 2020–26" },
      bvs:       { lon: 31.24, lat: 30.04, label: "BVS",          sub: "Next stop · 2027" }
    },
    /* one entry per click after the first */
    steps: [
      { arcs: [["riyadh", "cyprus"], ["cyprus", "riyadh", "low"]], year: "2013 → 2018",
        title: "Engineering starts", text: "After high school at Choueifat in Riyadh: first semesters at METU in Northern Cyprus, then back to Riyadh for my B.Sc. at Alfaisal." },
      { arcs: [["riyadh", "singapore"], ["singapore", "riyadh", "low"]], year: "2016 → 2018",
        title: "Singapore", text: "Projects in Singapore, including Shell Eco-marathon Asia with my university team. Then back to Riyadh." },
      { arcs: [["riyadh", "esslingen"], ["esslingen", "nuremberg"]], year: "2019 → 2026",
        title: "Germany", text: "Master's in Esslingen. Then six years in Nuremberg with MAN Truck & Bus and TRATON." },
      { arcs: [["nuremberg", "bvs"]], dashed: true, year: "2027 →",
        title: "Next stop: BVS", text: "Engineering brought me here. Next, I help clients choose the right technology." }
    ]
  },

  education: [
    { degree: "B.Sc. Mechanical Engineering", school: "Alfaisal University", place: "Riyadh, Saudi Arabia",
      years: "2013 – 2018", note: "Started at METU Northern Cyprus Campus (2013–15)", logos: ["metu", "alfaisal"] },
    { degree: "M.Eng. Design & Development", degree2: "Mechanical & Automotive Engineering",
      school: "Hochschule Esslingen", place: "Esslingen, Germany",
      years: "2019 – 2021", note: "Final project at MAN Truck & Bus: e-motor cooling", logos: ["esslingen"] }
  ],

  plant: [
    { years: "2016 – 2018", label: "Student builds", img: "assets/jobs/aero_clean.webp",
      orgs: [
        { logo: "shell", org: "Shell Eco-marathon Asia", place: "Singapore", role: "CFRP Design & Manufacturing" },
        { logo: "alfanar", org: "Alfanar Electric", place: "Riyadh", role: "Plastic Mould Design & Manufacturing" }
      ],
      bullets: [
        "Designed the car body in Creo, built carbon-fibre moulds and led the lay-up.",
        "Designed and machined steel injection moulds, programmed the CNC."
      ],
      tools: ["PTC Creo", "CNC", "Carbon fibre", "Flow simulation"] },

    { years: "2020", label: "Germany", img: "assets/jobs/battery.webp",
      orgs: [
        { logo: "a123", org: "A123 Systems", place: "Stuttgart", role: "Engineering Development & Management" },
        { logo: "rennstall", org: "Esslingen Rennstall", place: "Formula Student", role: "CFRP Monocoque Simulation" }
      ],
      bullets: [
        "Turned JIRA tickets into project KPIs for milestone forecasting.",
        "Made the carbon chassis lighter and stiffer in Altair HyperWorks."
      ],
      tools: ["JIRA", "ASPICE", "Battery systems", "FEA"] },

    { years: "2020 – 2022", label: "E-motor cooling", img: "assets/jobs/emotor.webp", img2: "assets/jobs/bus.webp",
      orgs: [
        { logo: "man", org: "MAN Truck & Bus", place: "Nuremberg", role: "1D Simulation Student → Engineer" }
      ],
      bullets: [
        "Built the bus e-motor cooling model from scratch. It became the base for later studies.",
        "Found thermal hotspots and demagnetisation risk before hardware tests."
      ],
      tools: ["GT-SUITE", "ANSYS Maxwell", "Loss maps", "Test validation"] },

    { years: "2022 – 2026", label: "Trucks & buses", img: "assets/jobs/network.webp",
      orgs: [
        { logo: "man", org: "MAN Truck & Bus", place: "Nuremberg", role: "1D Simulation Engineer" },
        { logo: "traton", org: "TRATON R&D", place: "Nuremberg", role: "1D Simulation Expert" }
      ],
      bullets: [
        "Cooling simulation for electric, diesel and hydrogen trucks and buses.",
        "Presented results to project leads and customers.",
        "Wrote the method guide the team uses and onboarded new engineers."
      ],
      tools: ["GT-SUITE", "3D → 1D", "Pump sizing", "Supplier data"] }
  ],

  skills: {
    root: { title: "Mechanical Engineer", sub: "B.Sc. · M.Eng." },
    branches: [
      { name: "Engineering", color: "#2FD3C8", nodes: [
        { logo: "lnt", title: "Design of Industrial Piping Systems", by: "L&T EduTech · Coursera", date: "Feb 2026" },
        { logo: "siemens", title: "Applied Computational Fluid Dynamics", by: "Siemens · Coursera", date: "Jan 2026" },
        { logo: "coursera", title: "Computational Fluid Mechanics", by: "Coursera project", date: "Mar 2026" },
        { logo: "lnt", title: "BIM Fundamentals for Engineers", by: "L&T EduTech · Coursera", date: "Mar 2026" },
        { logo: "", icon: "gear", title: "SimOps Fundamentals", by: "Simulation automation", date: "Jan 2025" }
      ]},
      { name: "Digital & AI", color: "#A77BFF", nodes: [
        { logo: "umich", title: "AI for Design and Optimization", by: "University of Michigan · Coursera", date: "Mar 2026" },
        { logo: "ibm", title: "Python for Data Science, AI & Development", by: "IBM · Coursera", date: "Mar 2026" },
        { logo: "anthropic", title: "Claude 101", by: "Anthropic Academy", date: "Aug 2026" },
        { logo: "anthropic", title: "Claude Code 101", by: "Anthropic Academy", date: "Aug 2026" }
      ]}
    ],
    next: { when: "Oct 2026", items: ["CATIA", "3D Printing"] },
    quests: {
      title: "Side quests · things I built myself",
      items: [
        { t: "This presentation", d: "Designed and coded with Claude Code" },
        { t: "Interactive CV", d: "k95-de.github.io/cv" },
        { t: "Portfolio trainer", d: "A quiz app I built to learn BVS & IBM" }
      ]
    }
  },

  hobbies: [
    { id: "pong",   name: "Ping Pong" },
    { id: "bike",   name: "Cycling" },
    { id: "swim",   name: "Swimming" },
    { id: "gym",    name: "Gym" },
    { id: "rope",   name: "Jump Rope", sub: "boxing style" },
    { id: "uke",    name: "Ukulele" },
    { id: "pad",    name: "Xbox", sub: "Forza Horizon" },
    { id: "car",    name: "Cars", sub: "enthusiast" }
  ],

  stats: {
    klass: "Engineer → Technology advisor",
    strengths: [
      { name: "Technical understanding", ex: "Cooling systems for electric, diesel and hydrogen trucks and buses." },
      { name: "Clear explanations",      ex: "Presented simulation results to project leads and customers." },
      { name: "Learning fast",           ex: "New fields in short time: e-motors, piping, AI tools." },
      { name: "Working across teams",    ex: "Daily with testing, design, CFD and suppliers." }
    ],
    growth: [
      { name: "The client side",         xp: 0.25, how: "First customer-facing role. Learning how BVS works with its clients." },
      { name: "Matching tech to needs",  xp: 0.35, how: "Hear the client's problem, pick the right technology, show the pros, cons and benefits." },
      { name: "BVS & IBM portfolio",     xp: 0.3,  how: "Learning the portfolio and what the market offers, to advise with confidence." }
    ]
  },

  mission: {
    title: "Help BVS hit its growth targets",
    sub: "My plan · the first few months",
    quarters: [
      { q: "1", name: "Learn",      text: "Master the BVS portfolio and the technologies behind it." },
      { q: "2", name: "Practise",   text: "Practise the pitch. Get to know our clients and their problems." },
      { q: "3", name: "Contribute", text: "Join client discussions. Close the gaps in my own process and build on it." },
      { q: "4", name: "Deliver",    text: "Grow my network, understand the industry, and help BVS win more clients." }
    ],
    expect: [
      "A clear method: understand the client, present the solution, answer the questions",
      "Real practice: role plays and honest feedback",
      "Deep knowledge of the IBM and BVS portfolio",
      "Mentors to learn from, and a team to win with"
    ],
    bring: [
      "Technical depth clients can trust",
      "Explaining complex technology simply",
      "Fast learning, shown by my courses",
      "Arabic, English and German for MEA and Europe"
    ]
  }
};
