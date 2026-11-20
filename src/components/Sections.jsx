import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, lenis } from '../lib/scroll'
import { CHANNELS, CRISIS, TEAM, QUOTES, CLIENTS, POSTS, CONTACT, media } from '../data'

const pad2 = (n) => String(n).padStart(2, '0')

function Head({ k, title, children }) {
  return (
    <header className="sec-head" data-reveal>
      <span className="kicker mono">{k}</span>
      <h2>{title}</h2>
      {children && <p className="sec-head__lede">{children}</p>}
    </header>
  )
}

/* ── 01 Manifesto ─────────────────────────────────────────────────────── */
const STATEMENT =
  'We help people with something important to say deliver it clearly, confidently and memorably — on camera, on stage and under pressure.'
const STATS = [
  { n: 1998, label: 'Founded by two BBC journalists', year: true },
  { n: 16, label: 'Journalists, presenters & producers on the team' },
  { n: 100, suffix: 's', label: 'Films made for broadcast & corporate clients' },
  { n: 15, suffix: '%', label: 'Discount for charities & not-for-profits' },
]

export function Manifesto() {
  const ref = useRef()
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.manifesto__word',
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: '.manifesto__text', start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
      gsap.utils.toArray('.stat__n').forEach((el) => {
        const end = +el.dataset.n
        const from = el.dataset.year ? 1960 : 0
        const o = { v: from }
        gsap.to(o, {
          v: end,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => (el.textContent = Math.round(o.v)),
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="manifesto" ref={ref}>
      <span className="kicker mono" data-reveal>01 — Who we are</span>
      <p className="manifesto__text">
        {STATEMENT.split(' ').map((w, i) => (
          <span key={i} className="manifesto__word">
            {w}{' '}
          </span>
        ))}
      </p>
      <div className="stats">
        {STATS.map((s) => (
          <div className="stat" key={s.label} data-reveal>
            <div className="stat__v">
              <span className="stat__n" data-n={s.n} data-year={s.year ? 1 : undefined}>
                {s.year ? 1960 : 0}
              </span>
              {s.suffix && <span className="stat__s">{s.suffix}</span>}
            </div>
            <p>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── 02 Channels (services) ───────────────────────────────────────────── */
function useStatic(canvasRef) {
  return () => {
    const c = canvasRef.current
    if (!c) return
    const g = c.getContext('2d')
    const img = g.createImageData(c.width, c.height)
    let raf
    const start = performance.now()
    const draw = () => {
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v
        img.data[i + 3] = 255
      }
      g.putImageData(img, 0, 0)
      if (performance.now() - start < 420) raf = requestAnimationFrame(draw)
    }
    draw()
    gsap.fromTo(c, { opacity: 0.95 }, { opacity: 0, duration: 0.45, delay: 0.1, ease: 'power2.in' })
    return () => cancelAnimationFrame(raf)
  }
}

export function Channels() {
  const sec = useRef()
  const noise = useRef()
  const [idx, setIdx] = useState(0)
  const burst = useStatic(noise)
  const first = useRef(true)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sec.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (s) => setIdx(Math.min(CHANNELS.length - 1, Math.floor(s.progress * CHANNELS.length))),
    })
    return () => st.kill()
  }, [])

  useEffect(() => {
    if (first.current) return void (first.current = false)
    burst()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  const tune = (i) => {
    const el = sec.current
    const range = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    lenis.scrollTo(top + range * ((i + 0.5) / CHANNELS.length), { duration: 1.2 })
  }

  const ch = CHANNELS[idx]
  return (
    <section className="channels" id="channels" ref={sec}>
      <div className="channels__sticky">
        <Head k="02 — What we do" title={<>Three channels. <em>One message.</em></>} />
        <div className="channels__grid">
          <div className="tv">
            <div className="tv__screen">
              {CHANNELS.map((c, i) => (
                <img key={c.id} src={media(c.img)} alt="" className={i === idx ? 'is-on' : ''} />
              ))}
              <div className="tv__scan" />
              <canvas ref={noise} width={160} height={90} className="tv__static" />
              <div className="tv__osd mono">
                <span>CH</span> {ch.ch}
              </div>
              <div className="tv__lower">
                <b>{ch.title}</b>
                <span>{ch.kicker}</span>
              </div>
            </div>
            <div className="tv__dial" aria-hidden>
              {CHANNELS.map((c, i) => (
                <i key={c.id} className={i === idx ? 'is-on' : ''} />
              ))}
            </div>
          </div>

          <div className="channels__info">
            <div className="channels__tabs" role="tablist">
              {CHANNELS.map((c, i) => (
                <button key={c.id} role="tab" aria-selected={i === idx} className={i === idx ? 'is-on' : ''} onClick={() => tune(i)}>
                  <span className="mono">CH {c.ch}</span> {c.title}
                </button>
              ))}
            </div>
            <div className="channels__body" key={ch.id}>
              <h3>{ch.kicker}</h3>
              <p>{ch.body}</p>
              <ul>
                {ch.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <a className="link-arrow" href={ch.href} target="_blank" rel="noreferrer">
                Explore {ch.title.toLowerCase()} <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 03 Crisis: the golden hour ───────────────────────────────────────── */
const CIRC = 2 * Math.PI * 140

export function Crisis() {
  const sec = useRef()
  const arc = useRef()
  const time = useRef()
  const mentions = useRef()
  const status = useRef()
  const items = useRef([])
  const cta = useRef()

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sec.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (s) => {
        const p = gsap.utils.clamp(0, 1, (s.progress - 0.04) / 0.86)
        const m = p * 60
        const calm = m >= 44
        arc.current.style.strokeDashoffset = CIRC * (1 - p)
        sec.current.classList.toggle('is-calm', calm)
        time.current.textContent = `${pad2(Math.floor(m))}:${pad2(Math.floor((m % 1) * 60))}`
        mentions.current.textContent = Math.round(12 * Math.exp(Math.min(m, 44) * 0.16)).toLocaleString('en-GB')
        status.current.textContent = calm ? 'On message' : m > 0.2 ? 'Story spreading' : 'All quiet'
        let cur = 0
        CRISIS.forEach((e, i) => {
          const on = m >= e.t && (i === 0 ? p > 0.01 : true)
          items.current[i].classList.toggle('is-on', on)
          if (on) cur = i
        })
        items.current.forEach((el, i) => el.classList.toggle('is-current', i === cur && p > 0.01))
        cta.current.classList.toggle('is-on', p > 0.97)
      },
    })
    return () => st.kill()
  }, [])

  return (
    <section className="crisis" id="crisis" ref={sec}>
      <div className="crisis__sticky">
        <div className="crisis__left">
          <Head k="03 — Crisis communications" title={<>Could you survive <em>the first hour?</em></>}>
            When bad news breaks, the first sixty minutes decide whose story gets told. Scroll the clock.
          </Head>
          <div className="clock">
            <svg viewBox="0 0 320 320" aria-hidden>
              {Array.from({ length: 60 }, (_, i) => (
                <line
                  key={i}
                  x1="160"
                  y1={i % 5 ? 8 : 4}
                  x2="160"
                  y2={i % 5 ? 14 : 20}
                  transform={`rotate(${i * 6} 160 160)`}
                  className={i % 5 ? 'tick' : 'tick tick--major'}
                />
              ))}
              <circle cx="160" cy="160" r="140" className="clock__track" />
              <circle
                ref={arc}
                cx="160"
                cy="160"
                r="140"
                className="clock__arc"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC}
                transform="rotate(-90 160 160)"
              />
            </svg>
            <div className="clock__face">
              <span className="clock__label mono">Minutes since it broke</span>
              <span ref={time} className="clock__time mono">00:00</span>
              <span className="clock__status mono">
                <i /> <span ref={status}>All quiet</span>
              </span>
              <span className="clock__mentions mono">
                Mentions <b ref={mentions}>12</b>
              </span>
            </div>
          </div>
        </div>

        <div className="crisis__right">
          <ol className="crisis__events">
            {CRISIS.map((e, i) => (
              <li key={e.t} ref={(el) => (items.current[i] = el)} className={e.good ? 'is-good' : ''}>
                <span className="crisis__t mono">{`00:${pad2(e.t)}`}</span>
                <div>
                  <h4>
                    {e.title}
                    {e.good && <em className="mono">With a plan</em>}
                  </h4>
                  <p>{e.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="crisis__cta" ref={cta}>
            <p>We write the plan, rehearse it with your senior team in a live simulation, and stay on call when it matters.</p>
            <a
              className="btn btn--red"
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                lenis.scrollTo('#contact', { duration: 1.6 })
              }}
            >
              Book a crisis simulation
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 04 Team: the newsroom ────────────────────────────────────────────── */
function TeamCard({ m, i }) {
  const el = useRef()
  const [open, setOpen] = useState(false)
  const tilt = (e) => {
    if (matchMedia('(pointer: coarse)').matches) return
    const r = el.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(el.current, { rotateY: x * 8, rotateX: -y * 8, duration: 0.5, ease: 'power2.out' })
  }
  const reset = () => gsap.to(el.current, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'power3.out' })
  return (
    <article
      ref={el}
      className={`member ${open ? 'is-open' : ''}`}
      onPointerMove={tilt}
      onPointerLeave={reset}
      onClick={() => setOpen((o) => !o)}
      data-cursor
      data-reveal
    >
      <div className="member__img">
        <img src={media(m.img)} alt={m.name} loading="lazy" />
      </div>
      <span className="member__rec mono">
        <i /> CAM {pad2(i + 1)}
      </span>
      <div className="member__bio">
        <p>{m.bio}</p>
        <ul>
          {m.outlets.map((o) => (
            <li key={o} className="mono">{o}</li>
          ))}
        </ul>
      </div>
      <div className="lower-third">
        <b>{m.name}</b>
        <span>{m.role}</span>
      </div>
    </article>
  )
}

const OUTLETS = ['BBC', 'ITV', 'Sky News', 'Channel 4', 'Channel 5', 'LBC', 'Reuters', 'Al Jazeera', 'The Times']

export function Team() {
  return (
    <section className="team" id="team">
      <Head k="04 — The newsroom" title={<>Trained by people who’ve <em>sat in the chair.</em></>}>
        Our trainers have reported, presented and produced at the highest level. They know exactly what the journalist across the
        table wants, and how to give your message the best chance.
      </Head>
      <ul className="outlets mono" data-reveal>
        {OUTLETS.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      <div className="team__grid">
        {TEAM.map((m, i) => (
          <TeamCard key={m.name} m={m} i={i} />
        ))}
      </div>
    </section>
  )
}

/* ── 05 Vox pops ──────────────────────────────────────────────────────── */
export function Vox() {
  const track = useRef()
  const bar = useRef()
  useEffect(() => {
    const el = track.current
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth
      bar.current.style.transform = `scaleX(${max ? Math.max(0.08, el.scrollLeft / max) : 1})`
    }
    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    // drag-to-scroll with a mouse
    let down = false
    let x0 = 0
    let s0 = 0
    let moved = false
    const pd = (e) => {
      if (e.pointerType !== 'mouse') return
      down = true
      moved = false
      x0 = e.clientX
      s0 = el.scrollLeft
      el.classList.add('is-drag')
    }
    const pm = (e) => {
      if (!down) return
      if (Math.abs(e.clientX - x0) > 4) moved = true
      el.scrollLeft = s0 - (e.clientX - x0)
    }
    const pu = () => {
      down = false
      el.classList.remove('is-drag')
    }
    const click = (e) => moved && e.preventDefault()
    el.addEventListener('pointerdown', pd)
    window.addEventListener('pointermove', pm)
    window.addEventListener('pointerup', pu)
    el.addEventListener('click', click, true)
    return () => {
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('pointerdown', pd)
      window.removeEventListener('pointermove', pm)
      window.removeEventListener('pointerup', pu)
      el.removeEventListener('click', click, true)
    }
  }, [])

  const nudge = (dir) => {
    const el = track.current
    const card = el.querySelector('.vox__card')
    el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: 'smooth' })
  }

  return (
    <section className="vox" id="voices">
      <div className="vox__top">
        <Head k="05 — Vox pops" title={<>Don’t take <em>our</em> word for it.</>} />
        <div className="vox__ctrl" data-reveal>
          <button onClick={() => nudge(-1)} aria-label="Previous">←</button>
          <button onClick={() => nudge(1)} aria-label="Next">→</button>
        </div>
      </div>
      <div className="vox__track" ref={track} data-cursor>
        {QUOTES.map((q, i) => (
          <figure className="vox__card" key={q.who}>
            <span className="vox__n mono">
              <i /> VOX POP {pad2(i + 1)}
            </span>
            <blockquote>“{q.q}”</blockquote>
            <figcaption className="lower-third lower-third--light">
              <b>{q.who}</b>
              <span>{q.org}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="vox__bar">
        <i ref={bar} />
      </div>
    </section>
  )
}

/* ── 06 Clients + news ticker ─────────────────────────────────────────── */
export function Clients() {
  const items = [...CLIENTS.slice(0, 12), 'Sample concept by Ayush Shukla', ...CLIENTS.slice(12)]
  const Row = () => (
    <div className="ticker__row">
      {items.map((c, i) => (
        <span key={i} className={c.includes('Ayush') ? 'ticker__wm' : ''}>
          {c}
          <i>■</i>
        </span>
      ))}
    </div>
  )
  return (
    <section className="clients" id="clients">
      <Head k="06 — On the record" title={<>Global institutions, charities <em>and the people who speak for them.</em></>}>
        From Inverness to Cornwall and Arizona to Australia, face to face, in purpose-built studios or on Zoom.
      </Head>
      <ul className="clients__list">
        {CLIENTS.map((c) => (
          <li key={c} data-reveal>
            {c}
          </li>
        ))}
      </ul>
      <div className="ticker" aria-hidden>
        <span className="ticker__tag mono">
          <i className="live-dot" /> LATEST
        </span>
        <div className="ticker__track">
          <Row />
          <Row />
        </div>
      </div>
    </section>
  )
}

/* ── 07 Journal ───────────────────────────────────────────────────────── */
export function Journal() {
  return (
    <section className="journal" id="journal">
      <Head k="07 — Roughly Speaking" title={<>Insight from the other side <em>of the microphone.</em></>} />
      <div className="journal__grid">
        {POSTS.map((p) => (
          <a key={p.title} className="post" href={p.href} target="_blank" rel="noreferrer" data-reveal>
            <div className="post__img">
              <img src={media(p.img)} alt="" loading="lazy" />
            </div>
            <span className="post__tag mono">{p.tag}</span>
            <h3>{p.title}</h3>
            <span className="post__more">
              Read the article <i>↗</i>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

/* ── Contact ──────────────────────────────────────────────────────────── */
export function Contact() {
  return (
    <footer className="contact" id="contact">
      <div className="onair" data-cursor>
        <span>ON AIR</span>
      </div>
      <h2 className="contact__title" data-reveal>
        Ready when <em>you are.</em>
      </h2>
      <p className="contact__lede" data-reveal>
        Tell us what you need to say and who you need to say it to. We’ll build the course, the crisis plan or the film around it,
        starting with a briefing call.
      </p>
      <div className="contact__grid" data-reveal>
        <a href={CONTACT.tel} className="contact__big">
          <span className="mono">Call the studio</span>
          {CONTACT.phone}
        </a>
        <a href={`mailto:${CONTACT.email}`} className="contact__big">
          <span className="mono">Email</span>
          {CONTACT.email}
        </a>
        <div className="contact__big contact__big--plain">
          <span className="mono">Visit</span>
          {CONTACT.address}
        </div>
      </div>
      <div className="contact__bar">
        <ul>
          {CONTACT.social.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="contact__charity mono">15% discount for charities</p>
        <p className="contact__sample">
          Sample redesign concept by <em>Ayush Shukla</em> — not the official Rough House Media website.
        </p>
      </div>
    </footer>
  )
}
