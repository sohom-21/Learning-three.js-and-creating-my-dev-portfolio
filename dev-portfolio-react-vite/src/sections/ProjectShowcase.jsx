import React, { useState, useMemo, useEffect } from 'react';
import { myProjects } from '../constants';

const ProjectCard = ({ project, onOpen }) => {
  const image = project.image_1 || Object.values(project).find(v => typeof v === 'string' && v.match(/\.(png|jpe?g|webp|gif)$/i));
  return (
    <div
      className="group bg-[#07070a] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-shadow duration-300"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(project)}
    >
      <div className="w-full h-56 md:h-72 lg:h-80 bg-black/40 overflow-hidden">
        <img
          src={image}
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-400"
          loading="lazy"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg md:text-xl font-semibold text-white truncate">{project.title}</h3>
        <p className="text-sm text-gray-300 mt-2 line-clamp-3">{project.desc}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags?.slice(0, 3).map(tag => (
            <span key={tag.id} className="text-xs bg-white/5 px-3 py-1 rounded-full text-gray-200 flex items-center gap-2">
              {tag.path && <img src={tag.path} alt={tag.name} className="w-4 h-4" />}
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ImageModal = ({ project, onClose }) => {
  const images = useMemo(
    () => Object.keys(project || {})
      .filter(k => k.startsWith('image_'))
      .map(k => project[k])
      .filter(Boolean),
    [project]
  );

  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [project]);

  if (!project) return null;

  const prev = () => setIndex(i => (i - 1 + images.length) % images.length);
  const next = () => setIndex(i => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden
      />
      <div
        className="relative z-10 max-w-5xl w-full bg-[#0b0b0d] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 border-b border-white/6">
          <h4 className="text-white font-medium">{project.title}</h4>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white rounded px-2 py-1"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${project.title} ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              loading="eager"
              draggable={false}
            />
          ))}

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60"
                aria-label="Next image"
              >
                ›
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to image ${i + 1}`}
                    className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/30'}`}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-4 text-gray-300">
          <p className="text-sm">{project.subdesc}</p>
        </div>
      </div>
    </div>
  );
};

const ProjectShowcase = () => {
  const [openProject, setOpenProject] = useState(null);

  return (
    <section id="projects" className="my-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-4xl md:text-5xl font-breathefire text-white">Projects</h2>
          <p className="text-gray-400 mt-2">A selection of recent work — tap a card to view more screenshots.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((p, idx) => (
            <ProjectCard key={p.title + idx} project={p} onOpen={(proj) => setOpenProject(proj)} />
          ))}
        </div>
      </div>

      {openProject && <ImageModal project={openProject} onClose={() => setOpenProject(null)} />}
    </section>
  );
};

export default ProjectShowcase;