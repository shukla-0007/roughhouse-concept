export const media = (p) => encodeURI(`${import.meta.env.BASE_URL}media/${p}`)
const SITE = 'https://roughhousemedia.co.uk'

/* ── Hero monitor wall: 5 × 3, row-major from the top-left ─────────────── */
export const SCREENS = [
  { kind: 'img', src: 'photos/radio-studio.jpg', label: 'Media training', target: '#channels' },
  { kind: 'bars' },
  { kind: 'img', src: 'photos/running-order.jpg', label: 'Production', target: '#channels' },
  { kind: 'onair' },
  { kind: 'img', src: 'photos/blog-radio-mic.jpg', label: 'Roughly Speaking', target: '#journal' },

  { kind: 'img', src: 'photos/founders.jpg', label: 'Meet the team', target: '#team' },
  { kind: 'img', src: 'photos/editing.jpg', label: 'Video production', target: '#channels' },
  { kind: 'img', src: 'photos/hero-interview.jpg', label: 'Media training', target: '#channels' },
  { kind: 'img', src: 'photos/press-conference.jpg', label: 'Crisis comms', target: '#crisis' },
  { kind: 'img', src: 'photos/team-montage.jpg', label: 'Meet the team', target: '#team' },

  { kind: 'rec' },
  { kind: 'img', src: 'photos/crisis-plan.jpg', label: 'Crisis comms', target: '#crisis' },
  { kind: 'standby' },
  { kind: 'img', src: 'photos/studio-bg.jpg', label: 'Tailored courses', target: '#channels' },
  { kind: 'img', src: 'photos/blog-consumer-unit.jpg', label: 'Roughly Speaking', target: '#journal' },
]

/* ── Services as TV channels ──────────────────────────────────────────── */
export const CHANNELS = [
  {
    id: 'training',
    ch: '01',
    title: 'Training',
    kicker: 'Communicate confidently, clearly and with impact.',
    body: 'Bespoke courses built around your people, your sector and the questions you dread. Every session mixes theory with realistic, on-camera exercises, and everyone leaves with the RHM Toolkit.',
    items: ['Media training', 'Crisis communications', 'Presentation skills', 'Panel facilitation', 'Smartphone video', 'Media relations', 'Writing'],
    img: 'photos/radio-studio.jpg',
    href: `${SITE}/services/media-training/`,
  },
  {
    id: 'crisis',
    ch: '02',
    title: 'Crisis',
    kicker: 'Could you cope if a bad news story went viral?',
    body: 'We work with your senior team to build a crisis communications plan that holds up in today’s media and social landscape, then rehearse it until it is second nature.',
    items: ['Crisis strategy & plans', 'On-the-spot crisis support', 'Training & live simulations'],
    img: 'photos/press-conference.jpg',
    href: `${SITE}/services/crisis-communications/`,
  },
  {
    id: 'production',
    ch: '03',
    title: 'Production',
    kicker: 'Videos which connect, captivate and inspire.',
    body: 'Made by a team who have produced for the BBC and ITV: ideas, research, scripting, filming and edit, all shaped around your story, your values and your budget.',
    items: ['Campaign films', 'Internal & safeguarding video', 'Podcasts', 'Scripting & edit'],
    img: 'photos/editing.jpg',
    href: `${SITE}/services/production-communications/`,
  },
]

/* ── Crisis "golden hour" timeline (minutes) ──────────────────────────── */
export const CRISIS = [
  { t: 0, title: 'A story breaks', body: 'A post, a leak, a phone call from a newsdesk.' },
  { t: 8, title: 'It’s shared thousands of times', body: 'Social media sets the pace, not your press office.' },
  { t: 18, title: 'The first journalist calls', body: 'Then five more. Each one wants a comment by the hour.' },
  { t: 30, title: 'Silence starts to look like guilt', body: 'The story is being written, with or without you.' },
  { t: 44, title: 'Your statement is out, on message', body: 'Because the plan, the roles and the lines were ready.', good: true },
  { t: 58, title: 'Your spokesperson goes on air', body: 'Calm, briefed and rehearsed, because they have done this before.', good: true },
]

/* ── Team ─────────────────────────────────────────────────────────────── */
export const TEAM = [
  { name: 'Ann Wright', role: 'Co-founder', img: 'team/ann-wright.jpg', outlets: ['BBC', 'Print'], bio: 'Print journalist turned BBC producer on high-profile programmes. Shapes our strategy and crisis work.' },
  { name: 'Graham Fitzgerald', role: 'Co-founder', img: 'team/graham-fitzgerald.jpg', outlets: ['BBC', 'ITV', 'Sky News'], bio: 'News and current affairs producer. Has built courses for Nokia, the RAF Benevolent Fund and the CAA.' },
  { name: 'Paul Curran', role: 'Trainer & producer', img: 'team/paul-curran.jpg', outlets: ['BBC'], bio: 'Two decades at the BBC interviewing prime ministers and CEOs. Leads our smartphone video courses.' },
  { name: 'Sarah Morris-Beale', role: 'Media trainer', img: 'team/sarah-morris-beale.jpg', outlets: ['BBC', 'Channel 4 News'], bio: 'Reported from London, Brussels and Washington, then moved into charity-sector PR.' },
  { name: 'Sue Carruthers', role: 'Presentation coach', img: 'team/sue-carruthers.jpg', outlets: ['Coaching'], bio: 'Twenty years coaching presenters and small groups to speak with impact and self-belief.' },
  { name: 'Simon Brooke', role: 'Writing & media trainer', img: 'team/simon-brooke.jpg', outlets: ['National press'], bio: 'Writes and edits for national newspapers; 25 years in communications training.' },
  { name: 'Rob Curling', role: 'Presenter & trainer', img: 'team/rob-curling.jpg', outlets: ['BBC', 'Sky'], bio: 'Presenter and commentator at the Olympics, Wimbledon and the Six Nations. Hosts a top aviation podcast.' },
  { name: 'Sarah Deech', role: 'Reporter & producer', img: 'team/sarah-deech.jpg', outlets: ['BBC TV', 'BBC Radio'], bio: 'Covered two US elections from Washington and series-produced the documentary strand Our World.' },
  { name: 'Martine Croxall', role: 'Presenter & chair', img: 'team/martine-croxall.jpg', outlets: ['BBC News'], bio: 'BBC News Channel presenter. Chairs high-level discussions and coaches presentation skills.' },
  { name: 'Graeme Bowd', role: 'Trainer & producer', img: 'team/graeme-bowd.jpg', outlets: ['ITV', 'Daily Mail', 'Express'], bio: 'Fifteen years and hundreds of live broadcasts at ITV. Has trained NATO and Kenya Airways.' },
  { name: 'Jacky Rowland', role: 'Media trainer', img: 'team/jacky-rowland.jpg', outlets: ['BBC', 'Al Jazeera'], bio: 'Foreign correspondent and arts writer, fluent in French after six years based in Paris.' },
  { name: 'Sumit Bose', role: 'Media trainer', img: 'team/sumit-bose.jpg', outlets: ['BBC', 'ITV', 'Sky', 'The Times'], bio: 'Science, environment and energy reporter. Founder of Energy Live News and Future Net Zero.' },
  { name: 'Paul Brennan', role: 'Trainer & producer', img: 'team/paul-brennan.jpg', outlets: ['BBC', 'ITV', 'Channel 5', 'Reuters'], bio: 'Journalist and presenter for 25 years; presentation coach and corporate video producer.' },
  { name: 'Andy Ivy', role: 'Presenter & trainer', img: 'team/andy-ivy.jpg', outlets: ['Sky News', 'LBC'], bio: 'Produced live TV at Sky News, launched a national radio service, now presents news on LBC.' },
  { name: 'Ben Holloway', role: 'Camera & edit', img: 'team/ben-holloway.jpg', outlets: ['Sunday Times', 'Charities'], bio: 'Camera operator and editor for 25 years. Brings the view from behind the lens to our courses.' },
  { name: 'Alyx Barker', role: 'Reporter & editor', img: 'team/alyx-barker.jpg', outlets: ['Channel 5', 'ITV', 'TRT World'], bio: 'Presenter, reporter and programme editor; currently on a weekly UK politics show for TRT World.' },
]

/* ── Vox pops (short excerpts) ────────────────────────────────────────── */
export const QUOTES = [
  { q: 'Delivered with authority, but also with bags of empathy.', who: 'Victoria Ribbans', org: 'Westminster Abbey' },
  { q: 'Testing, engaging and fun.', who: 'Chris Steel', org: 'Director of Comms, Avenues' },
  { q: 'Our senior management team found it incredibly useful.', who: 'Stephanie Williams', org: 'Kew Gardens' },
  { q: 'Rough House made them feel at ease in front of the camera.', who: 'Francesca Corbett', org: 'Bowel Cancer UK' },
  { q: 'A genuine day to remember.', who: 'Michelle North', org: 'Chartered Management Institute' },
  { q: 'Practical, accessible media training that boosts confidence.', who: 'Caroline Mallan', org: 'Charities Aid Foundation' },
  { q: 'Premium training delivered by highly experienced professionals.', who: 'Niall Scott', org: 'University of St Andrews' },
  { q: 'Their advice and tips on dealing with crisis comms were invaluable.', who: 'Sarah Tridgell', org: 'Astroscale' },
  { q: 'Rough House went over and above the original brief.', who: 'Damaris Villenueva', org: 'The Leprosy Mission' },
]

export const CLIENTS = [
  'Westminster Abbey', 'Kew Gardens', 'International Red Cross', 'Help for Heroes', 'Mind',
  'Transparency International', 'Charities Aid Foundation', 'National Literacy Trust', 'Bowel Cancer UK',
  'Companies House', 'Sustrans', 'University of St Andrews', 'Chartered Management Institute',
  'General Pharmaceutical Council', 'International Chamber of Shipping', 'Astroscale', 'Solvay',
  'Nokia', 'NATO', 'RAF Benevolent Fund', 'Civil Aviation Authority', 'The Kennel Club', 'Finnair',
]

export const POSTS = [
  { title: 'Why every PR team needs a TV producer', img: 'photos/editing.jpg', href: `${SITE}/lessons-from-journalism-and-tv-production/`, tag: 'Production' },
  { title: 'Crisis lessons from the BBC Consumer Unit', img: 'photos/blog-consumer-unit.jpg', href: `${SITE}/crisis-lessons-from-the-bbc-consumer-unit/`, tag: 'Crisis' },
  { title: 'Crisis questions to expect', img: 'photos/blog-crisis-questions.jpg', href: `${SITE}/crisis-questions-to-expect/`, tag: 'Crisis' },
  { title: 'Four steps to giving effective media interviews', img: 'photos/blog-radio-mic.jpg', href: `${SITE}/four-steps-to-giving-effective-media-interviews/`, tag: 'Training' },
]

export const CONTACT = {
  phone: '020 8332 6200',
  tel: 'tel:+442083326200',
  email: 'info@roughhouse.co.uk',
  address: 'The Bridge, 7b Parkshot, Richmond TW9 2RD',
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/rough-house-media/' },
    { label: 'Instagram', href: 'https://www.instagram.com/roughhousemedia01/' },
    { label: 'Bluesky', href: 'https://bsky.app/profile/roughhousemedia.bsky.social' },
    { label: 'Facebook', href: 'https://www.facebook.com/roughhouse01' },
  ],
}
