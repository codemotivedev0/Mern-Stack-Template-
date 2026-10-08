import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Shared shell for the login and signup pages. Any child marked with
// data-animate fades up in sequence after the card appears.
const AuthLayout = ({ title, subtitle, children, footer }) => {
  const container = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('[data-blob]', {
          x: 'random(-60, 60)',
          y: 'random(-40, 40)',
          scale: 'random(0.9, 1.15)',
          duration: 'random(6, 9)',
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
        });

        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-card]', { y: 40, autoAlpha: 0, scale: 0.97, duration: 0.7 })
          .from('[data-animate]', { y: 16, autoAlpha: 0, duration: 0.5, stagger: 0.07 }, '-=0.35');
      });
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-100 px-4 py-12"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          data-blob
          className="absolute -left-24 -top-24 size-96 rounded-full bg-indigo-300/40 blur-3xl"
        />
        <div
          data-blob
          className="absolute -bottom-32 -right-16 size-[28rem] rounded-full bg-violet-300/40 blur-3xl"
        />
        <div
          data-blob
          className="absolute left-1/2 top-1/3 size-72 rounded-full bg-sky-200/40 blur-3xl"
        />
      </div>

      <div
        data-card
        className="relative w-full max-w-md rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-indigo-900/5 backdrop-blur-xl sm:p-10"
      >
        <div data-animate className="mb-8 flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
            M
          </span>
          <span className="font-semibold text-slate-900">MERN Auth</span>
        </div>

        <h1 data-animate className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p data-animate className="mt-1.5 text-sm text-slate-500">
          {subtitle}
        </p>

        <div className="mt-8">{children}</div>

        {footer && (
          <p data-animate className="mt-8 text-center text-sm text-slate-500">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
