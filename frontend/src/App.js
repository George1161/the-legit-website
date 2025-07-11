import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Fade-in on scroll hook
function useFadeInOnScroll() {
  const ref = React.useRef();
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const onScroll = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        node.classList.add('animate-fadein');
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return ref;
}

// ProjectCard component for gallery
function ProjectCard({ project, voting, hasVoted, onVote, onNominate, showNominateButton, onClick, className, isAdmin, onDelete, onEdit, userLimits }) {
  const cardRef = useFadeInOnScroll();
  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`cursor-pointer bg-[#181818] rounded-2xl shadow-2xl p-12 flex flex-col items-center relative transition-transform duration-200 hover:scale-105 hover:shadow-3xl ${project.nominated ? 'border-4 border-glow-gold' : ''} ${className || ''}`}
      style={project.nominated ? { boxShadow: '0 0 32px 8px #FFD70099' } : {}}
    >
      {project.nominated && (
        <span className="absolute top-6 right-6 bg-legitGold text-background font-heading px-4 py-2 rounded-full text-base shadow animate-pulse-badge">Legit Pick</span>
      )}
      {project.image ? (
        <img src={project.image} alt={project.title} className="w-48 h-48 object-cover rounded-xl mb-6 shadow-lg" />
      ) : (
        <div className="w-48 h-48 bg-secondary rounded-xl mb-6 flex items-center justify-center text-background font-accent text-4xl">IMG</div>
      )}
      <h2 className="font-heading text-3xl text-legitGold mb-3 text-center">{project.title}</h2>
      <p className="font-body text-secondary text-center mb-6 text-lg">{project.shortDescription}</p>
      <div className="flex items-center gap-2 mb-2">
        <button
          className="bg-vote text-background font-bold px-6 py-3 rounded-lg shadow hover:bg-glitch transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-legitGold"
          onClick={e => { e.stopPropagation(); onVote(project.id); }}
          disabled={voting[project.id] || hasVoted(project.id)}
          title={hasVoted(project.id) ? 'You have already voted for this project.' : ''}
          style={{ boxShadow: hasVoted(project.id) ? '0 0 8px 2px #FFD700' : undefined }}
        >
          {voting[project.id] ? 'Voting...' : hasVoted(project.id) ? 'Voted' : 'Vote'}
        </button>
        <span className="font-body text-legitGold text-xl">{project.votes || 0}</span>
      </div>
      {showNominateButton && (
        <button
          className={`mt-2 px-4 py-2 rounded font-heading text-base shadow transition hover:scale-105 ${project.nominated ? 'bg-legitGold text-background' : 'bg-secondary text-legitGold'} hover:bg-glitch`}
          onClick={e => { e.stopPropagation(); onNominate(project.id); }}
        >
          {project.nominated ? 'Remove Legit Pick' : 'Nominate as Legit Pick'}
        </button>
      )}
      {isAdmin && onDelete && (
        <button
          className="mt-4 px-4 py-2 rounded bg-red-600 text-white font-bold shadow hover:bg-red-800 transition"
          onClick={e => { e.stopPropagation(); onDelete(project.id); }}
        >
          Delete Project
        </button>
      )}
      {onEdit && userLimits && (
        <div className="mt-4 flex flex-col gap-2">
          <div className="text-center text-sm text-secondary">
            Edits: {project.editCount || 0}/3
          </div>
          {project.editCount < 3 && (
            <button
              className="px-4 py-2 rounded bg-legitGold text-background font-bold shadow hover:bg-glitch transition"
              onClick={e => { e.stopPropagation(); onEdit(project); }}
            >
              Edit Project
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Social icons (simple SVGs)
const socials = [
  { href: 'https://instagram.com', label: 'Instagram', icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="6" stroke="#FFD700" strokeWidth="2"/><circle cx="12" cy="12" r="5" stroke="#FFD700" strokeWidth="2"/><circle cx="17" cy="7" r="1.5" fill="#FFD700"/></svg> },
  { href: 'https://twitter.com', label: 'Twitter', icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M22 5.92a8.38 8.38 0 0 1-2.36.65A4.13 4.13 0 0 0 21.4 4.1a8.27 8.27 0 0 1-2.61 1A4.13 4.13 0 0 0 12 8.13c0 .32.04.64.1.94A11.7 11.7 0 0 1 3 4.8a4.13 4.13 0 0 0 1.28 5.5A4.07 4.07 0 0 1 2.8 9.2v.05A4.13 4.13 0 0 0 4.1 13a4.1 4.1 0 0 1-1.85.07A4.13 4.13 0 0 0 6.1 16.1a8.3 8.3 0 0 1-5.13 1.77c-.33 0-.65-.02-.97-.06A11.72 11.72 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 22 5.92Z" stroke="#FFD700" strokeWidth="2"/></svg> },
];

// Sticky nav with smooth scroll
function NavBar() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur border-b border-secondary flex items-center justify-between py-3 px-8 text-legitGold font-heading text-lg shadow-lg">
      <div className="text-3xl font-heading text-legitGold tracking-wide select-none cursor-pointer" onClick={() => scrollTo('home')}>The Legit</div>
      <div className="flex gap-8">
      <button onClick={() => scrollTo('about')} className="hover:text-glitch transition">About</button>
      <button onClick={() => scrollTo('gallery')} className="hover:text-glitch transition">Gallery</button>
      <button onClick={() => scrollTo('submit')} className="hover:text-glitch transition">Submit</button>
      </div>
    </nav>
  );
}

function App() {
  // Ref for submission form
  const submitRef = React.useRef(null);
  const scrollToSubmit = () => {
    submitRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Modernized Hero Section (left-aligned, minimal, professional)
  const homeSection = (
    <section id="home" className="w-full flex flex-col items-start justify-center pl-40 pt-40 min-h-[60vh]">
      <span className="text-base font-semibold text-glitch mb-2 tracking-widest uppercase animate-fadein" style={{ animationDelay: '0.2s' }}>
        Legit Projects. Legit People. Legit Impact.
      </span>
      <h1 className="font-heading text-5xl md:text-6xl mb-6 text-legitGold drop-shadow animate-fadein" style={{ animationDelay: '0.3s', lineHeight: 1.1 }}>
        The Legit:<br />Where Creativity Becomes Legendary
      </h1>
      <p className="font-body text-text text-lg md:text-xl mb-8 animate-fadein" style={{ animationDelay: '0.4s' }}>
        Submit your project, vote for your favorites,<br />
        and discover what’s truly legit. Join a community celebrating authenticity, creativity, and action.
      </p>
      <button
        onClick={scrollToSubmit}
        className="bg-vote text-background font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-glitch transition focus:outline-none focus:ring-2 focus:ring-legitGold animate-glow"
        style={{ boxShadow: '0 0 16px 2px #FFD700, 0 0 32px 4px #FFD70033' }}
      >
        Submit Your Project
      </button>
    </section>
  );

  // About The Legit section
  const aboutSection = (
    <section id="about" className="w-full flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
      <div className="bg-[#181818] border border-legitGold rounded-xl shadow-lg max-w-2xl w-full p-8 flex flex-col items-center animate-fadein">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl md:text-4xl">🔮</span>
          <h2 className="font-heading text-3xl md:text-4xl text-legitGold drop-shadow">About The Legit</h2>
        </div>
        <p className="font-body text-text text-lg text-center mb-4">
          The Legit is a creative movement, community game, and underground support system built to spotlight everything truly real.
        </p>
        <p className="font-body text-text text-base text-center mb-2">
          We support legit people — artists, builders, hustlers, visionaries — through interactive quests, real-world challenges, and biweekly giveaways.
        </p>
        <p className="font-body text-text text-base text-center mb-2">
          Whether it’s a bold idea, a passion project, or a small business with soul, if it’s authentic, we see it.<br/>
          We don’t chase hype. We follow truth, creativity, and hustle.
        </p>
        <p className="font-body text-text text-base text-center mb-2">
          Through QR-coded missions, anonymous street characters, and meme-fueled riddles, The Legit turns cities into playgrounds and strangers into allies.
        </p>
        <p className="font-body text-text text-base text-center mb-2">
          This is more than content. It’s a culture.
        </p>
        <p className="font-body text-legitGold text-lg text-center font-bold mb-2">
          If it’s legit — we support it.<br/>
          If it’s legendary — we make it known.
        </p>
        <p className="font-body text-glitch text-base text-center mt-2 font-accent">
          Welcome to the movement.
        </p>
      </div>
    </section>
  );

  // SVG divider
  const divider = (
    <svg className="w-full h-8 md:h-12" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 30 Q 360 60 720 30 T 1440 30 V60 H0V30Z" fill="#23272f" />
    </svg>
  );

  // Project gallery
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [voting, setVoting] = React.useState({});
  const [voted, setVoted] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('votedProjects') || '[]');
    } catch {
      return [];
    }
  });
  const fetchProjects = React.useCallback(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/projects`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  const handleVote = async (id) => {
    setVoting((v) => ({ ...v, [id]: true }));
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === id ? data.project : p)));
        const newVoted = [...voted, id];
        setVoted(newVoted);
        localStorage.setItem('votedProjects', JSON.stringify(newVoted));
      } else {
        const err = await res.json();
        alert(err.message || 'You have already voted for this project.');
      }
    } catch {}
    setVoting((v) => ({ ...v, [id]: false }));
  };
  const hasVoted = (id) => voted.includes(id);
  const featured = React.useMemo(() => projects.find((p) => p.nominated), [projects]);
  const [modalProject, setModalProject] = React.useState(null);
  const [editingProject, setEditingProject] = React.useState(null);
  const [editForm, setEditForm] = React.useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    image: null,
    social: '',
  });
  const gallerySection = (
    <section id="gallery" className="w-full flex flex-col items-center p-8 max-w-7xl mx-auto">
      <h1 className="font-heading text-4xl mb-8 text-legitGold animate-fadein">Project Gallery</h1>
      {/* featured && (
        <div className="mb-12 w-full flex flex-col items-center">
          <div className="w-full max-w-2xl">
          <h2 className="font-heading text-2xl text-glitch mb-2 animate-fadein">Featured Legit Pick</h2>
          <ProjectCard
            project={featured}
            voting={voting}
            hasVoted={hasVoted}
            onVote={handleVote}
            showNominateButton={false}
            onClick={() => setModalProject(featured)}
            onEdit={handleEdit}
            userLimits={userLimits}
          />
          </div>
        </div>
      ) */}
      {/* loading ? (
        <p className="font-body text-secondary animate-fadein">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="font-body text-secondary animate-fadein">No projects submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 w-full max-w-7xl">
          {Array.isArray(projects) && projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              voting={voting}
              hasVoted={hasVoted}
              onVote={handleVote}
              showNominateButton={false}
              onClick={() => setModalProject(project)}
              onEdit={handleEdit}
              userLimits={userLimits}
              className="w-full max-w-2xl mx-auto"
            />
          ))}
        </div>
      ) */}
      {/* Modal for full project info */}
      {/* modalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setModalProject(null)}>
          <div className="bg-[#181818] rounded-2xl shadow-2xl p-10 max-w-2xl w-full relative animate-fadein max-h-[80vh] overflow-y-auto" style={{ scrollbarGutter: 'stable' }} onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-legitGold text-2xl font-bold hover:text-glitch" onClick={() => setModalProject(null)}>&times;</button>
            {modalProject.image && (
              <img src={modalProject.image} alt={modalProject.title} className="w-full h-80 object-cover rounded-xl mb-6 shadow-lg" />
            )}
            <h2 className="font-heading text-3xl text-legitGold mb-2 text-center">{modalProject.title}</h2>
            <p className="font-body text-secondary text-center mb-4 text-lg">{modalProject.fullDescription}</p>
            {modalProject.social && (
              <a href={modalProject.social} target="_blank" rel="noopener noreferrer" className="block text-glitch text-center mb-2 underline break-all">{modalProject.social}</a>
            )}
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="font-body text-legitGold text-lg">Votes: {modalProject.votes || 0}</span>
              {modalProject.nominated && <span className="bg-legitGold text-background font-heading px-3 py-1 rounded-full text-xs shadow">Legit Pick</span>}
            </div>
          </div>
        </div>
      ) */}
      {/* Edit Modal */}
      {/* editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setEditingProject(null)}>
          <div className="bg-[#181818] rounded-2xl shadow-2xl p-10 max-w-2xl w-full relative animate-fadein max-h-[80vh] overflow-y-auto" style={{ scrollbarGutter: 'stable' }} onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-legitGold text-2xl font-bold hover:text-glitch" onClick={() => setEditingProject(null)}>&times;</button>
            <h2 className="font-heading text-3xl text-legitGold mb-6 text-center">Edit Project</h2>
            <div className="text-center text-sm text-secondary mb-4">
              Edits remaining: {3 - (editingProject.editCount || 0)}/3
            </div>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <label className="font-body text-secondary">Project Title
                <input name="title" type="text" value={editForm.title} onChange={handleEditChange} required className="mt-1 w-full p-2 rounded bg-background text-text border border-secondary focus:border-legitGold outline-none" />
              </label>
              <label className="font-body text-secondary">Short Description (max 50 chars)
                <input name="shortDescription" type="text" value={editForm.shortDescription} onChange={handleEditChange} required maxLength={50} className="mt-1 w-full p-2 rounded bg-background text-text border border-secondary focus:border-legitGold outline-none" />
              </label>
              <label className="font-body text-secondary">Full Description
                <textarea name="fullDescription" value={editForm.fullDescription} onChange={handleEditChange} required rows={4} className="mt-1 w-full p-2 rounded bg-background text-text border border-secondary focus:border-legitGold outline-none" />
              </label>
              <label className="font-body text-secondary">Image (leave empty to keep current)
                <input name="image" type="file" accept="image/*" onChange={handleEditChange} className="mt-1 w-full p-2 rounded bg-background text-text border border-secondary focus:border-legitGold outline-none" />
              </label>
              <label className="font-body text-secondary">Social Link (Instagram, etc)
                <input name="social" type="url" value={editForm.social} onChange={handleEditChange} placeholder="https://instagram.com/yourproject" className="mt-1 w-full p-2 rounded bg-background text-text border border-secondary focus:border-legitGold outline-none" />
              </label>
              <div className="flex gap-4 mt-4">
                <button type="button" onClick={() => setEditingProject(null)} className="flex-1 px-4 py-2 rounded bg-gray-600 text-white font-bold shadow hover:bg-gray-700 transition">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 rounded bg-legitGold text-background font-bold shadow hover:bg-glitch transition">Update Project</button>
              </div>
            </form>
          </div>
        </div>
      ) */}
    </section>
  );

  // User limits state
  const [userLimits, setUserLimits] = React.useState({
    submissionsRemaining: 3,
    totalSubmissions: 0,
    projectEditInfo: []
  });

  // Fetch user limits
  const fetchUserLimits = React.useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/user-limits`);
      if (res.ok) {
        const data = await res.json();
        // Defensive: ensure data shape
        const safeLimits = {
          submissionsRemaining: typeof data.submissionsRemaining === 'number' ? data.submissionsRemaining : 3,
          totalSubmissions: typeof data.totalSubmissions === 'number' ? data.totalSubmissions : 0,
          projectEditInfo: Array.isArray(data.projectEditInfo) ? data.projectEditInfo : []
        };
        setUserLimits(safeLimits);
        console.log('Fetched userLimits:', safeLimits);
      } else {
        setUserLimits({ submissionsRemaining: 3, totalSubmissions: 0, projectEditInfo: [] });
        console.log('userLimits endpoint not found, using defaults');
      }
    } catch (err) {
      setUserLimits({ submissionsRemaining: 3, totalSubmissions: 0, projectEditInfo: [] });
      console.error('Error fetching user limits:', err);
    }
  }, []);

  React.useEffect(() => {
    fetchUserLimits();
  }, [fetchUserLimits]);

  // Project submission form (moved to bottom)
  const [form, setForm] = React.useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    image: null,
    social: '',
  });
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('shortDescription', form.shortDescription);
      formData.append('fullDescription', form.fullDescription);
      formData.append('social', form.social);
      if (form.image) {
        formData.append('image', form.image);
      }
      const res = await fetch(`${process.env.REACT_APP_API_URL}/projects`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert('Project submitted!');
        setForm({ title: '', shortDescription: '', fullDescription: '', image: null, social: '' });
        fetchProjects();
        fetchUserLimits(); // Refresh user limits after submission
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Submission failed.');
      }
    } catch (err) {
      alert('Submission failed.');
    }
  };

  // Back to top button
  const [showTop, setShowTop] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Side SVGs and accent text
  const sideDecor = (
    <>
      {/* Left graffiti SVG - enhanced */}
      <svg className="fixed left-0 top-0 h-full w-44 opacity-15 pointer-events-none z-0 hidden md:block" viewBox="0 0 90 900" fill="none">
        <path d="M45 0 Q15 250 75 450 Q15 700 45 900" stroke="#FFD700" strokeWidth="7" strokeLinecap="round"/>
        <circle cx="25" cy="120" r="14" fill="#FFD700" opacity="0.4"/>
        <rect x="12" y="700" width="24" height="70" rx="12" fill="#FFD700" opacity="0.25"/>
        {/* Urban tag */}
        <text x="10" y="300" fontSize="22" fontFamily="monospace" fill="#FFD700" opacity="0.13" transform="rotate(-12 10 300)">LEGIT</text>
        {/* Subtle star */}
        <polygon points="45,60 48,70 59,70 50,76 53,86 45,80 37,86 40,76 31,70 42,70" fill="#FFD700" opacity="0.09"/>
      </svg>
      {/* Right mythical SVG - enhanced */}
      <svg className="fixed right-0 top-0 h-full w-44 opacity-15 pointer-events-none z-0 hidden md:block" viewBox="0 0 90 900" fill="none">
        <path d="M45 0 Q75 250 15 450 Q75 700 45 900" stroke="#00BFFF" strokeWidth="7" strokeLinecap="round"/>
        <ellipse cx="70" cy="250" rx="12" ry="22" fill="#00BFFF" opacity="0.35"/>
        <rect x="60" y="800" width="24" height="50" rx="12" fill="#00BFFF" opacity="0.18"/>
        {/* Mythical glyph */}
        <text x="60" y="400" fontSize="20" fontFamily="serif" fill="#00BFFF" opacity="0.13" transform="rotate(8 60 400)">✶</text>
        {/* Subtle star */}
        <polygon points="45,120 48,130 59,130 50,136 53,146 45,140 37,146 40,136 31,130 42,130" fill="#00BFFF" opacity="0.08"/>
      </svg>
      {/* Faded glyphs and stars - left */}
      <svg className="fixed left-10 top-1/4 w-10 h-32 opacity-10 pointer-events-none z-0 hidden xl:block" viewBox="0 0 40 128" fill="none">
        <text x="10" y="30" fontSize="18" fontFamily="serif" fill="#FFD700" opacity="0.18">✦</text>
        <text x="5" y="80" fontSize="16" fontFamily="serif" fill="#FFD700" opacity="0.13">☉</text>
      </svg>
      {/* Faded glyphs and stars - right */}
      <svg className="fixed right-10 bottom-1/4 w-10 h-32 opacity-10 pointer-events-none z-0 hidden xl:block" viewBox="0 0 40 128" fill="none">
        <text x="10" y="30" fontSize="18" fontFamily="serif" fill="#00BFFF" opacity="0.18">✦</text>
        <text x="5" y="80" fontSize="16" fontFamily="serif" fill="#00BFFF" opacity="0.13">☾</text>
      </svg>
      {/* Vertical accent text left */}
      <div className="fixed left-2 top-1/2 -translate-y-1/2 z-10 hidden xl:block" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '0.2em', fontWeight: 700, fontSize: '1.1rem', color: '#FFD700', opacity: 0.18 }}>
        LEGIT SUPPORT
      </div>
      {/* Vertical accent text right */}
      <div className="fixed right-2 top-1/2 -translate-y-1/2 z-10 hidden xl:block" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '0.2em', fontWeight: 700, fontSize: '1.1rem', color: '#00BFFF', opacity: 0.18 }}>
        FOR THE REAL ONES
      </div>
      {/* Floating vertical social bar (XL+) */}
      {/* Removed as per user request */}
      {/* Noise overlay - main */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.07\'/%3E%3C/svg%3E")', zIndex: 1 }}></div>
      {/* Noise overlay - fine grain */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n2\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.8\' numOctaves=\'6\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n2)\' opacity=\'0.04\'/%3E%3C/svg%3E")', zIndex: 2 }}></div>
    </>
  );

  return (
    <div
      className="min-h-screen bg-legit-bg text-text flex flex-col items-center relative overflow-x-hidden"
      style={{ background: "#0D0D0D url('/background-legit.png') center center / cover no-repeat fixed" }}
    >
      {sideDecor}
      <NavBar />
      {homeSection}
      {aboutSection}
      {divider}
      {gallerySection}
      {divider}
      <section id="submit" ref={submitRef} className="w-full flex flex-col items-center justify-center p-8 max-w-2xl mx-auto">
        <h1 className="font-heading text-4xl mb-4 text-legitGold animate-fadein">Submit Your Project</h1>
        <div className="bg-[#181818] p-6 rounded-lg shadow-lg mb-4 text-center animate-fadein">
          <p className="font-body text-legitGold text-lg mb-2">
            Submissions Remaining: <span className="font-bold">{typeof userLimits.submissionsRemaining === 'number' ? userLimits.submissionsRemaining : 3}</span> / 3
          </p>
          {userLimits && Array.isArray(userLimits.projectEditInfo) && userLimits.projectEditInfo.length > 0 ? (
            <div className="mt-2 text-sm text-secondary">
              <strong>Your Projects & Edits:</strong>
              <ul className="mt-1">
                {/* Debug log for projectEditInfo */}
                {console.log('Rendering projectEditInfo:', userLimits.projectEditInfo)}
                {Array.isArray(userLimits.projectEditInfo) && userLimits.projectEditInfo.map((p, idx) => {
                  if (!p || typeof p !== 'object') {
                    console.warn('Skipping invalid projectEditInfo entry at index', idx, p);
                    return null;
                  }
                  return (
                    <li key={p.id || p.title || idx}>
                      {p.title ? p.title : 'Untitled'}: {typeof p.editsRemaining === 'number' ? p.editsRemaining : 3} edits left
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="mt-2 text-sm text-secondary">Limits info not available.</div>
          )}
          {userLimits.submissionsRemaining === 0 && (
            <p className="font-body text-red-400 text-sm">You have reached your submission limit for this IP address.</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="bg-[#181818] p-8 rounded-lg shadow-lg flex flex-col gap-4 w-full max-w-md animate-fadein">
          <label className="font-body text-secondary">Project Title
            <input name="title" type="text" value={form.title} onChange={handleChange} required className="mt-1 w-full p-2 rounded bg-background text-text border border-secondary focus:border-legitGold outline-none" />
          </label>
          <label className="font-body text-secondary">Short Description (max 50 chars)
            <input name="shortDescription" type="text" value={form.shortDescription} onChange={handleChange} required maxLength={50} className="mt-1 w-full p-2 rounded bg-background text-text border border-secondary focus:border-legitGold outline-none" />
          </label>
          <label className="font-body text-secondary">Full Description
            <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange} required rows={4} className="mt-1 w-full p-2 rounded bg-background text-text border border-secondary focus:border-legitGold outline-none" />
          </label>
          <label className="font-body text-secondary">Image
            <input name="image" type="file" accept="image/*" onChange={handleChange} className="mt-1 w-full p-2 rounded bg-background text-text border border-secondary focus:border-legitGold outline-none" />
          </label>
          <label className="font-body text-secondary">Social Link (Instagram, etc)
            <input name="social" type="url" value={form.social} onChange={handleChange} placeholder="https://instagram.com/yourproject" className="mt-1 w-full p-2 rounded bg-background text-text border border-secondary focus:border-legitGold outline-none" />
          </label>
          <button 
            type="submit" 
            disabled={userLimits.submissionsRemaining === 0}
            className={`font-bold px-6 py-3 rounded-lg shadow transition mt-4 focus:outline-none focus:ring-2 focus:ring-legitGold ${
              userLimits.submissionsRemaining === 0 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-vote text-background hover:bg-glitch'
            }`}
          >
            {userLimits.submissionsRemaining === 0 ? 'Submission Limit Reached' : 'Submit'}
          </button>
        </form>
      </section>
      <footer className="w-full text-center py-8 text-secondary text-sm opacity-80 font-body mt-8 border-t border-secondary flex flex-col items-center gap-4">
        <div className="flex gap-4 justify-center mb-2">
          {Array.isArray(socials) && socials.map((s, idx) => {
            if (!s || typeof s !== 'object') {
              console.warn('Skipping invalid social at index', idx, s);
              return null;
            }
            return (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:scale-110 transition">{s.icon}</a>
            );
          })}
        </div>
        <div>&copy; {new Date().getFullYear()} The Legit. All rights reserved.</div>
        {showTop && (
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-2 px-4 py-2 rounded-full bg-legitGold text-background font-heading shadow hover:bg-glitch transition">Back to Top</button>
        )}
      </footer>
    </div>
  );
}

// Animations (add to global CSS or App.css):
// .animate-fadein { animation: fadein 1s ease both; }
// .animate-glow { animation: glow 2s infinite alternate; }
// @keyframes fadein { from { opacity: 0; transform: translateY(24px);} to { opacity: 1; transform: none; } }
// @keyframes glow { from { box-shadow: 0 0 8px 2px #FFD700; } to { box-shadow: 0 0 24px 8px #FFD700; } }

// Restore Admin Console as a separate page
function Admin() {
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [modalProject, setModalProject] = React.useState(null);

  // Fetch all projects (approved and unapproved)
  const fetchAdminProjects = React.useCallback(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/admin/projects`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    if (!loggedIn) return;
    fetchAdminProjects();
  }, [loggedIn, fetchAdminProjects]);

  const handleNominate = async (id) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/nominate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const data = await res.json();
      setProjects((prev) => prev.map((p) => (p.id === id ? data.project : p)));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    const res = await fetch(`${process.env.REACT_APP_API_URL}/projects/` + id, { method: 'DELETE' });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleClearVotes = async (id) => {
    if (!window.confirm('Clear all votes for this project?')) return;
    const res = await fetch(`${process.env.REACT_APP_API_URL}/clear-votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchAdminProjects();
    }
  };

  // Approve project
  const handleApprove = async (id) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/projects/${id}/approve`, {
      method: 'PATCH',
    });
    if (res.ok) {
      fetchAdminProjects();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'george@gmail.com' && password === '123456') {
      setLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  if (!loggedIn)
    return (
      <div className="min-h-screen bg-legit-bg text-text flex flex-col items-center justify-center p-8">
        <h1 className="font-heading text-4xl mb-8 text-legitGold">Admin Login</h1>
        <form onSubmit={handleLogin} className="bg-[#181818] p-8 rounded-lg shadow-lg flex flex-col gap-4 w-full max-w-sm">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="p-2 rounded bg-background text-text border border-secondary focus:border-legitGold outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="p-2 rounded bg-background text-text border border-secondary focus:border-legitGold outline-none"
            required
          />
          {error && <div className="text-error font-body text-center">{error}</div>}
          <button type="submit" className="bg-vote text-background font-bold px-6 py-3 rounded-lg shadow hover:bg-glitch transition mt-4">Login</button>
        </form>
      </div>
    );

  return (
    <div className="min-h-screen bg-legit-bg text-text flex flex-col items-center p-8">
      <h1 className="font-heading text-4xl mb-8 text-legitGold">Admin Console</h1>
      {loading ? (
        <p className="font-body text-secondary">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="font-body text-secondary">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {Array.isArray(projects) && projects.map((project, idx) => {
            if (!project || typeof project !== 'object') {
              console.warn('Skipping invalid project at index', idx, project);
              return null;
            }
            return (
              <div key={project.id} className="relative">
                <ProjectCard
                  project={project}
                  voting={{}} // not used in admin
                  hasVoted={() => false} // not used in admin
                  onVote={() => {}} // not used in admin
                  onNominate={handleNominate}
                  showNominateButton={true}
                  isAdmin={true}
                  onDelete={handleDelete}
                  onClick={() => setModalProject(project)}
                />
                {!project.approved && (
                  <button
                    className="absolute top-4 left-4 px-4 py-2 rounded bg-legitGold text-background font-heading shadow hover:bg-glitch transition"
                    onClick={() => handleApprove(project.id)}
                  >
                    Approve
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* Modal for full project info in admin */}
      {modalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setModalProject(null)}>
          <div className="bg-[#181818] rounded-2xl shadow-2xl p-10 max-w-2xl w-full relative animate-fadein max-h-[80vh] overflow-y-auto" style={{ scrollbarGutter: 'stable' }} onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-legitGold text-2xl font-bold hover:text-glitch" onClick={() => setModalProject(null)}>&times;</button>
            {modalProject.image && (
              <img src={modalProject.image} alt={modalProject.title} className="w-full h-80 object-cover rounded-xl mb-6 shadow-lg" />
            )}
            <h2 className="font-heading text-3xl text-legitGold mb-2 text-center">{modalProject.title}</h2>
            <p className="font-body text-secondary text-center mb-4 text-lg">{modalProject.fullDescription}</p>
            {modalProject.social && (
              <a href={modalProject.social} target="_blank" rel="noopener noreferrer" className="block text-glitch text-center mb-2 underline break-all">{modalProject.social}</a>
            )}
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="font-body text-legitGold text-lg">Votes: {modalProject.votes || 0}</span>
              {modalProject.nominated && <span className="bg-legitGold text-background font-heading px-3 py-1 rounded-full text-xs shadow">Legit Pick</span>}
              {!modalProject.approved && <span className="bg-red-600 text-white font-heading px-3 py-1 rounded-full text-xs shadow">Pending Approval</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main app with router
function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default MainApp;
