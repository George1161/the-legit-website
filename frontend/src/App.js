// FORCE REDEPLOY: Trivial change to trigger Vercel build
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Simplified ProjectCard component without heavy scroll listeners
function ProjectCard({ project, voting, hasVoted, onVote, onNominate, showNominateButton, onClick, className, isAdmin, onDelete, onEdit }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-[#181818] rounded-2xl shadow-lg p-8 flex flex-col items-center relative transition-all duration-200 hover:scale-[1.02] ${project.nominated ? 'border-2 border-glow-gold' : ''} ${className || ''}`}
    >
      {project.nominated && (
        <span className="absolute top-4 right-4 bg-legitGold text-background font-heading px-3 py-1 rounded-full text-sm">Legit Pick</span>
      )}
      {project.image ? (
        <img src={project.image} alt={project.title} className="w-40 h-40 object-cover rounded-xl mb-4 shadow-md" />
      ) : (
        <div className="w-40 h-40 bg-secondary rounded-xl mb-4 flex items-center justify-center text-background font-accent text-3xl">IMG</div>
      )}
      <h2 className="font-heading text-2xl text-legitGold mb-2 text-center">{project.title}</h2>
      <p className="font-body text-secondary text-center mb-4 text-base">{project.shortDescription}</p>
      <div className="flex items-center gap-2 mb-2">
        <button
          className="bg-vote text-background font-bold px-4 py-2 rounded-lg shadow hover:bg-glitch transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-legitGold"
          onClick={e => { e.stopPropagation(); onVote(project.id); }}
          disabled={voting[project.id] || hasVoted(project.id)}
          title={hasVoted(project.id) ? 'You have already voted for this project.' : ''}
        >
          {voting[project.id] ? 'Voting...' : hasVoted(project.id) ? 'Voted' : 'Vote'}
        </button>
        <span className="font-body text-legitGold text-lg">{project.votes || 0}</span>
      </div>
      {showNominateButton && (
        <button
          className={`mt-2 px-3 py-1 rounded font-heading text-sm shadow transition ${project.nominated ? 'bg-legitGold text-background' : 'bg-secondary text-legitGold'} hover:bg-glitch`}
          onClick={e => { e.stopPropagation(); onNominate(project.id); }}
        >
          {project.nominated ? 'Remove Legit Pick' : 'Nominate as Legit Pick'}
        </button>
      )}
      {isAdmin && onDelete && (
        <button
          className="mt-2 px-2 py-1 rounded bg-red-600 text-white font-bold text-xs shadow hover:bg-red-800 transition"
          onClick={e => { e.stopPropagation(); onDelete(project.id); }}
        >
          Delete Project
        </button>
      )}
      {onEdit && (
        <div className="mt-2 flex flex-col gap-1">
          <div className="text-center text-xs text-secondary">
            Edits: {project.editCount || 0}/3
          </div>
          {project.editCount < 3 && (
            <button
              className="px-2 py-1 rounded bg-legitGold text-background font-bold text-xs shadow hover:bg-glitch transition"
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

// Simplified nav without backdrop-blur
function NavBar() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/95 border-b border-secondary flex items-center justify-between py-3 px-8 text-legitGold font-heading text-lg shadow-md">
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

  // Simplified Hero Section (no fade-in, no glow)
  const homeSection = (
    <section id="home" className="w-full flex flex-col items-start justify-center pl-40 pt-40 min-h-[60vh]">
      <span className="text-base font-semibold text-glitch mb-2 tracking-widest uppercase">
        Legit Projects. Legit People. Legit Impact.
      </span>
      <h1 className="font-heading text-5xl md:text-6xl mb-6 text-legitGold drop-shadow" style={{ lineHeight: 1.1 }}>
        The Legit:<br />Where Creativity Becomes Legendary
      </h1>
      <p className="font-body text-text text-lg md:text-xl mb-8">
        Submit your project, vote for your favorites,<br />
        and discover what’s truly legit. Join a community celebrating authenticity, creativity, and action.
      </p>
      <button
        onClick={scrollToSubmit}
        className="bg-vote text-background font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-glitch transition focus:outline-none focus:ring-2 focus:ring-legitGold"
      >
        Submit Your Project
      </button>
    </section>
  );

  // About The Legit section
  const aboutSection = (
    <section id="about" className="w-full flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
      <div className="bg-[#181818] border border-legitGold rounded-xl shadow-lg max-w-2xl w-full p-8 flex flex-col items-center">
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
      <h1 className="font-heading text-4xl mb-8 text-legitGold">Project Gallery</h1>
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

      {loading ? (
        <p className="font-body text-secondary">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="font-body text-secondary">No projects submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 w-full max-w-7xl">
          {Array.isArray(projects) && projects.map((project, idx) => {
            // Defensive check for valid project object
            if (!project || typeof project !== 'object' || !project.id) {
              console.warn('Skipping invalid project at index', idx, project);
              return null;
            }
            return (
              <ProjectCard
                key={project.id}
                project={project}
                voting={voting}
                hasVoted={hasVoted}
                onVote={handleVote}
                showNominateButton={false}
                onClick={() => setModalProject(project)}
                className="w-full max-w-2xl mx-auto"
              />
            );
          })}
        </div>
      )}
      {/* Modal for full project info */}
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
            </div>
          </div>
        </div>
      )}
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

  // Simplified side decorations for better performance
  const sideDecor = (
    <>
      {/* Simple left accent */}
      <div className="fixed left-0 top-0 h-full w-2 bg-gradient-to-b from-legitGold/20 to-transparent pointer-events-none z-0 hidden md:block"></div>
      {/* Simple right accent */}
      <div className="fixed right-0 top-0 h-full w-2 bg-gradient-to-b from-blue-400/20 to-transparent pointer-events-none z-0 hidden md:block"></div>
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
        <h1 className="font-heading text-4xl mb-4 text-legitGold">Submit Your Project</h1>
        <div className="bg-[#181818] p-6 rounded-lg shadow-lg mb-4 text-center">
          <p className="font-body text-legitGold text-lg mb-2">
            Submissions Remaining: <span className="font-bold">{typeof userLimits.submissionsRemaining === 'number' ? userLimits.submissionsRemaining : 3}</span> / 3
          </p>
          {userLimits && Array.isArray(userLimits.projectEditInfo) && userLimits.projectEditInfo.length > 0 ? (
            <div className="mt-2 text-sm text-secondary">
              <strong>Your Projects & Edits:</strong>
              <ul className="mt-1">

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
        <form onSubmit={handleSubmit} className="bg-[#181818] p-8 rounded-lg shadow-lg flex flex-col gap-4 w-full max-w-md">
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
                {Array.isArray(socials) && socials.map((s, idx) => (
        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:scale-110 transition">{s.icon}</a>
      ))}
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
  const [actionLoading, setActionLoading] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const projectsPerPage = 12;

  // Fetch all projects (approved and unapproved)
  const fetchAdminProjects = React.useCallback(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/admin/projects`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setTotalPages(Math.ceil(data.length / projectsPerPage));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
  }, [projectsPerPage]);

  React.useEffect(() => {
    if (!loggedIn) return;
    fetchAdminProjects();
  }, [loggedIn, fetchAdminProjects]);

  const handleNominate = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/nominate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === id ? data.project : p)));
      }
    } catch (err) {
      console.error('Error nominating project:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/projects/` + id, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleClearVotes = async (id) => {
    if (!window.confirm('Clear all votes for this project?')) return;
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/clear-votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchAdminProjects();
      }
    } catch (err) {
      console.error('Error clearing votes:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Approve project
  const handleApprove = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/projects/${id}/approve`, {
        method: 'PATCH',
      });
      if (res.ok) {
        fetchAdminProjects();
      }
    } catch (err) {
      console.error('Error approving project:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
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

  // Calculate paginated projects
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const paginatedProjects = projects.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center p-6">
      <h1 className="font-heading text-4xl mb-8 text-legitGold">Admin Console</h1>
      <div className="mb-4 text-center">
        <p className="font-body text-secondary">Total Projects: {projects.length}</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center">
          <p className="font-body text-secondary">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <p className="font-body text-secondary">No projects found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
            {Array.isArray(paginatedProjects) && paginatedProjects.map((project, idx) => {
              if (!project || typeof project !== 'object' || !project.id) {
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
                      className={`absolute top-4 left-4 px-4 py-2 rounded font-heading shadow transition ${
                        actionLoading[project.id] 
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                          : 'bg-legitGold text-background hover:bg-glitch'
                      }`}
                      onClick={() => handleApprove(project.id)}
                      disabled={actionLoading[project.id]}
                    >
                      {actionLoading[project.id] ? 'Approving...' : 'Approve'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded font-heading shadow transition ${
                  currentPage === 1 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-legitGold text-background hover:bg-glitch'
                }`}
              >
                Previous
              </button>
              <span className="font-body text-legitGold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded font-heading shadow transition ${
                  currentPage === totalPages 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-legitGold text-background hover:bg-glitch'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
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
