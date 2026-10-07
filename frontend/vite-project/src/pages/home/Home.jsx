import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './Home.css';

/* ============================================================
   Hook: scroll reveal with stagger
============================================================ */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ============================================================
   Hook: count-up animation
============================================================ */
function CountUp({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const startTime = performance.now();
            const tick = (now) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 4);
              setCount(Math.floor(eased * end));
              if (progress < 1) requestAnimationFrame(tick);
              else setCount(end);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ============================================================
   Hook: cursor spotlight
============================================================ */
function useCursorSpotlight() {
  useEffect(() => {
    if (window.matchMedia('(max-width: 800px)').matches) return;
    const spotlight = document.createElement('div');
    spotlight.className = 'cursor-spotlight';
    document.body.appendChild(spotlight);

    let rafId = null;
    const move = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        spotlight.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
      });
    };
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      if (rafId) cancelAnimationFrame(rafId);
      spotlight.remove();
    };
  }, []);
}

/* ============================================================
   Hook: 3D tilt effect on cards
============================================================ */
function useTiltCards() {
  useEffect(() => {
    const cards = document.querySelectorAll('.home-service-card, .home-hero-image, .home-about-image');
    const handlers = [];

    cards.forEach((card) => {
      const move = (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (y - 0.5) * 8;
        const tiltY = (x - 0.5) * -8;
        card.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) scale(1.01)`;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
      };
      const leave = () => {
        card.style.transform = '';
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      };
      card.addEventListener('mousemove', move);
      card.addEventListener('mouseleave', leave);
      handlers.push({ card, move, leave });
    });

    return () => {
      handlers.forEach(({ card, move, leave }) => {
        card.removeEventListener('mousemove', move);
        card.removeEventListener('mouseleave', leave);
      });
    };
  }, []);
}

/* ============================================================
   Hook: magnetic buttons
============================================================ */
function useMagneticButtons() {
  useEffect(() => {
    const buttons = document.querySelectorAll('.btn-home-primary, .btn-home-outline');
    const handlers = [];

    buttons.forEach((btn) => {
      const move = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) translateY(-3px)`;
      };
      const leave = () => {
        btn.style.transform = '';
      };
      btn.addEventListener('mousemove', move);
      btn.addEventListener('mouseleave', leave);
      handlers.push({ btn, move, leave });
    });

    return () => {
      handlers.forEach(({ btn, move, leave }) => {
        btn.removeEventListener('mousemove', move);
        btn.removeEventListener('mouseleave', leave);
      });
    };
  }, []);
}

/* ============================================================
   Hook: ripple effect on click
============================================================ */
function useRippleEffect() {
  useEffect(() => {
    const buttons = document.querySelectorAll('.btn-home-primary, .btn-home-outline, .home-service-card');
    const handlers = [];

    buttons.forEach((el) => {
      const click = (e) => {
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      };
      el.addEventListener('click', click);
      handlers.push({ el, click });
    });

    return () => {
      handlers.forEach(({ el, click }) => {
        el.removeEventListener('click', click);
      });
    };
  }, []);
}

export default function Home() {
  useScrollReveal();
  useCursorSpotlight();
  useTiltCards();
  useMagneticButtons();
  useRippleEffect();

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="home-wrapper">

      {/* Animated gradient mesh background */}
      <div className="home-mesh" aria-hidden="true"></div>

      {/* Floating particles */}
      <div className="home-particles" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className={`particle particle-${i + 1}`}></span>
        ))}
      </div>

      {/* Ambient orbs */}
      <div className="home-orbs" aria-hidden="true">
        <span className="orb orb-1"></span>
        <span className="orb orb-2"></span>
        <span className="orb orb-3"></span>
      </div>

      {/* NAVBAR — now static (not sticky) */}
      <header className="home-nav">
        <div className="home-nav-brand">
          <div className="home-nav-logo">
            <i className="fas fa-paw"></i>
          </div>
          <div>
            <h2>VetraCare</h2>
            <p>Northstar Animal Health</p>
          </div>
        </div>

        <nav className="home-nav-links">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="home-nav-actions">
          <Link to="/login" className="btn-home-outline">Sign in</Link>
          <Link to="/register" className="btn-home-primary">
            Get started <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-hero-badge">
            <i className="fas fa-star"></i> Trusted by 500+ clinics worldwide
          </span>

          <h1>
            Every paw, claw, and whisker —<br />
            <span className="highlight">
              managed with love
              <span className="highlight-underline"></span>
            </span>
          </h1>

          <p>
            The complete veterinary clinic management platform. Track patients,
            manage appointments, run labs, dispense medications, and keep every
            animal's story in one place.
          </p>

          <div className="home-hero-buttons">
            <Link to="/register" className="btn-home-primary btn-hero-lg">
              <i className="fas fa-rocket"></i> Start free trial
            </Link>
            <Link to="/login" className="btn-home-outline btn-hero-lg">
              <i className="fas fa-sign-in-alt"></i> Sign in
            </Link>
          </div>

          <div className="home-hero-stats">
            <div>
              <strong><CountUp end={500} suffix="+" /></strong>
              <span>Clinics</span>
            </div>
            <div>
              <strong><CountUp end={12} suffix="k+" /></strong>
              <span>Animals</span>
            </div>
            <div>
              <strong><CountUp end={98} suffix="%" /></strong>
              <span>Uptime</span>
            </div>
          </div>
        </div>

        <div
          className="home-hero-image"
          style={{ transform: `translateY(${scrollY * -0.04}px)` }}
        >
          <div className="hero-image-glow"></div>
          <img
            src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=900&q=85"
            alt="Veterinarian caring for a dog"
          />
          <div className="home-hero-floating-card">
            <div className="pulse-dot"></div>
            <div>
              <strong>Cooper Davis</strong>
              <span>Golden Retriever · Active</span>
            </div>
          </div>
          <div className="home-hero-floating-badge">
            <i className="fas fa-heart-pulse"></i>
            <div>
              <strong>92 bpm</strong>
              <span>Heart rate</span>
            </div>
          </div>
          <div className="home-hero-floating-badge-2">
            <i className="fas fa-shield-heart"></i>
            <div>
              <strong>Vaccinated</strong>
              <span>Up to date</span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="home-trust">
        <p>Trusted by veterinary teams across</p>
        <div className="home-marquee">
          <div className="home-marquee-track">
            {[1, 2].map((k) => (
              <div className="home-marquee-group" key={k}>
                <span><i className="fas fa-hospital"></i> Riverside</span>
                <span><i className="fas fa-hospital"></i> Central</span>
                <span><i className="fas fa-hospital"></i> Westfield</span>
                <span><i className="fas fa-hospital"></i> Northstar</span>
                <span><i className="fas fa-hospital"></i> GreenLeaf</span>
                <span><i className="fas fa-hospital"></i> BlueCross Vet</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="home-services" id="services">
        <div className="home-section-header reveal">
          <span>Everything you need</span>
          <h2>One platform, six workspaces</h2>
          <p>
            From reception to pharmacy, every role gets a tailored dashboard
            that speaks their language.
          </p>
        </div>

        <div className="home-services-grid">
          {[
            { icon: 'fa-user-shield', tone: 'emerald', title: 'System administrator', text: 'Manage staff, branches, security, backups, and system health.' },
            { icon: 'fa-user-doctor', tone: 'blue',    title: 'Veterinarian',          text: 'Consultations, prescriptions, labs, and patient records.' },
            { icon: 'fa-flask-vial',  tone: 'violet',  title: 'Laboratory',            text: 'Sample tracking, findings entry, QC runs, and reagents.' },
            { icon: 'fa-headset',     tone: 'amber',   title: 'Receptionist',          text: 'Appointments, check-ins, registration, billing, payments.' },
            { icon: 'fa-pills',       tone: 'rose',    title: 'Pharmacist',            text: 'Dispensing, inventory, stock alerts, purchase orders.' },
            { icon: 'fa-paw',         tone: 'teal',    title: 'Pet owner',             text: 'Track your pets, book appointments, view records.' },
          ].map((s, i) => (
            <div
              className="home-service-card reveal"
              key={s.title}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`service-icon tone-${s.tone}`}>
                <i className={`fas ${s.icon}`}></i>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <span className="service-arrow">
                Learn more <i className="fas fa-arrow-right"></i>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="home-about" id="about">
        <div className="home-about-image reveal">
          <img
            src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=900&q=85"
            alt="Happy golden retriever"
          />
          <div className="about-image-badge">
            <i className="fas fa-shield-heart"></i>
            <span>Since 2014</span>
          </div>
          <div className="about-image-stat">
            <strong>10k+</strong>
            <span>Happy pets</span>
          </div>
        </div>

        <div className="home-about-content reveal">
          <span>Built for real clinics</span>
          <h2>Save hours every single day.</h2>
          <p>
            Paper records, spreadsheets, and phone calls are slowing your team
            down. VetraCare connects every part of your clinic so your vets can
            spend more time with animals and less time with admin.
          </p>

          <ul className="home-about-list">
            {[
              { t: 'Digital records',          s: 'Every visit, vaccine, and lab in one place.' },
              { t: 'Real-time collaboration',  s: 'Front desk, vets, and lab see the same data.' },
              { t: 'Automated reminders',      s: 'Owners get texts and emails for follow-ups.' },
            ].map((item) => (
              <li key={item.t}>
                <i className="fas fa-circle-check"></i>
                <div>
                  <strong>{item.t}</strong>
                  <span>{item.s}</span>
                </div>
              </li>
            ))}
          </ul>

          <Link to="/register" className="btn-home-primary btn-hero-lg">
            Create your clinic account <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta" id="contact">
        <div className="home-cta-card reveal">
          <div className="cta-glow"></div>
          <div className="cta-glow-2"></div>
          <span className="cta-badge">
            <i className="fas fa-sparkles"></i> Limited time offer
          </span>
          <h2>Ready to transform your clinic?</h2>
          <p>Join hundreds of veterinary teams already using VetraCare.</p>
          <div className="home-cta-buttons">
            <Link to="/register" className="btn-home-primary btn-hero-lg">
              <i className="fas fa-user-plus"></i> Get started — it's free
            </Link>
            <Link to="/login" className="btn-home-outline btn-hero-lg">
              <i className="fas fa-sign-in-alt"></i> Sign in
            </Link>
          </div>
          <div className="cta-trust">
            <span><i className="fas fa-check"></i> No credit card required</span>
            <span><i className="fas fa-check"></i> 14-day free trial</span>
            <span><i className="fas fa-check"></i> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="home-footer-content">
          <div className="home-footer-brand">
            <div className="home-nav-logo">
              <i className="fas fa-paw"></i>
            </div>
            <div>
              <h3>VetraCare</h3>
              <p>Compassionate care, powered by technology.</p>
            </div>
          </div>

          <div className="home-footer-links">
            <div>
              <h4>Product</h4>
              <a href="#services">Services</a>
              <a href="#about">About</a>
              <Link to="/login">Sign in</Link>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#contact">Contact</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>

        <div className="home-footer-bottom">
          © 2026 VetraCare · Northstar Animal Health. All rights reserved.
        </div>
      </footer>

    </div>
  );
}