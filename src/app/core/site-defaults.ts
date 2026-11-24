import { AboutData } from './models/about';
import { ClientsData } from './models/clients';
import { HomeData } from './models/home';
import { ServicesData } from './models/services';

/**
 * Fallback content taken from the original mirror-house landing page.
 * It is shown instantly and whenever the API is unreachable, then replaced
 * field-by-field with whatever the backend returns.
 */
export const DEFAULT_HOME: HomeData = {
  tag: 'Atelier of Digital Reflection',
  title: 'mirror-house',
  subtitle:
    'Reflections of timeless design & human-centric digital craft. Select any orbiting sphere to explore.',
};

export const DEFAULT_ABOUT: AboutData = {
  sectionTag: 'About Us',
  title: 'Designing interfaces that mirror human intuition.',
  description:
    'At mirror-house, we believe great UI/UX reflects the clarity, warmth, and rhythm of the people who use it—blending architectural balance with tactile digital storytelling.',
  stats: [
    { id: 1, value: '85+', label: 'Products' },
    { id: 2, value: '14', label: 'Awards' },
    { id: 3, value: '99%', label: 'Retention' },
  ],
};

export const DEFAULT_SERVICES: ServicesData = {
  sectionTag: 'Our Services',
  title: 'Crafted with precision & warmth.',
  servicesList: [
    {
      id: 1,
      title: 'UI/UX Product Design',
      category: 'Digital Interfaces',
      description:
        'Human-centered interfaces crafted with tactile clarity, fluid micro-interactions, and warm editorial precision.',
      features: ['User Research & Flows', 'Interactive Prototypes', 'Usability Testing'],
    },
    {
      id: 2,
      title: 'Brand Reflection & Identity',
      category: 'Visual Storytelling',
      description:
        'We distill your core ethos into a luminous visual language—typography, color harmonics, and expressive marks.',
      features: ['Visual Identity', 'Typography Systems', 'Art Direction'],
    },
    {
      id: 3,
      title: 'Interactive Web Architecture',
      category: 'Frontend Craft',
      description:
        'Bespoke, responsive web experiences built with silky motion choreography and accessible modern code.',
      features: ['Creative Development', 'Motion Choreography', 'Performance Tuning'],
    },
    {
      id: 4,
      title: 'Design Systems & Tokens',
      category: 'Scalable Foundations',
      description:
        'Unified component libraries that empower product teams to ship cohesive experiences effortlessly.',
      features: ['Component Libraries', 'Design Tokens', 'Documentation'],
    },
  ],
};

export const DEFAULT_CLIENTS: ClientsData = {
  sectionTag: 'Our Clients',
  trustedLabel: 'Trusted Globally',
  title: 'Partnerships built on shared vision.',
  clientsList: [
    { id: 1, name: 'Solstice', category: 'Fintech' },
    { id: 2, name: 'Aurelia', category: 'Botanicals' },
    { id: 3, name: 'Kanso', category: 'Architecture' },
    { id: 4, name: 'Vespera', category: 'Hospitality' },
  ],
  testimonial: {
    quote:
      '“mirror-house transformed our platform into an effortless, luminous experience our customers love.”',
    author: '— Nadia Al-Mansoor, CPO at Solstice',
  },
};

/** Static copy that has no backend model. */
export const CONTACT_COPY = {
  badge: 'Contact Us',
  email: 'hello@mirror-house.studio',
  headline: 'Begin a conversation.',
  buttonText: 'Send Inquiry',
  successText: '✦ Sent! We’ll reply within 24h.',
};

export const FOOTER_TAGLINE = 'Reflections of Timeless UI/UX & Digital Craft';

export const DEFAULT_MIRROR_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=360&q=80',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=360&q=80',
  'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=360&q=80',
  'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=360&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=360&q=80',
  'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=360&q=80',
];

export type ViewKey = 'home' | 'about' | 'contact' | 'services' | 'clients';

/** Which page each cardinal orbit bubble leads to, depending on the current page. */
export const BUBBLE_MAP: Record<ViewKey, Record<'top' | 'right' | 'bottom' | 'left', ViewKey>> = {
  home: { top: 'about', bottom: 'contact', left: 'services', right: 'clients' },
  about: { top: 'home', bottom: 'contact', left: 'services', right: 'clients' },
  services: { top: 'home', bottom: 'contact', left: 'about', right: 'clients' },
  clients: { top: 'home', bottom: 'contact', left: 'about', right: 'services' },
  contact: { top: 'home', bottom: 'about', left: 'services', right: 'clients' },
};

export const BUBBLE_EYEBROW: Record<'top' | 'right' | 'bottom' | 'left', string> = {
  top: 'Explore',
  right: 'Connect',
  bottom: 'Reach Out',
  left: 'Discover',
};
