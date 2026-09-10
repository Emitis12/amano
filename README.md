# AMANO National Convention — Landing Site

A multi-page React landing site for the AMANO (Alumni of Maritime Academy of
Nigeria, Oron) National Convention, November 2025, at Eko Hotel & Suites,
Victoria Island, Lagos.

## Stack

- **React 18**
- **React Router DOM** — client-side routing across Home / About / Convention
  / Speakers / Venue / FAQs
- **lucide-react** — icon set
- **Tailwind CSS** — styling, with a custom navy/gold token set matching the
  AMANO brand
- **Vite** — dev server and build tool

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/
    Navbar.jsx           # sticky top nav, active-link highlighting, mobile menu
    Footer.jsx           # footer with sitemap links + social icons
    Countdown.jsx        # live countdown to event.startDateTime, shown on Home
    RegistrationModal.jsx # popup registration dialog (embeds Luma via iframe)
  context/
    RegistrationModalContext.jsx # global open/close state for the registration modal
  pages/
    Home.jsx         # hero, about, highlights, speaker preview, registration
    About.jsx        # mission / vision / community
    Convention.jsx    # full schedule + sticky registration card
    Speakers.jsx     # full speaker bios
    Venue.jsx        # venue details, getting there, schedule
    FAQs.jsx         # accessible accordion FAQ
  data/
    event.js         # single source of truth: date, venue, speakers, schedule, FAQs
  App.jsx            # route definitions
  main.jsx           # app entry, BrowserRouter
  index.css          # Tailwind directives + small utility classes
```

## Editing event details

Everything content-specific (event date, venue, Luma registration link,
speaker list, schedule, FAQs) lives in **`src/data/event.js`** — update it
there once and it propagates to every page.

The exact convention date is marked as "to be confirmed" — update
`event.date` in `src/data/event.js` once it's locked in.

## Registration modal

Every "Register Now" button across the site opens a popup dialog
(`RegistrationModal.jsx`) instead of a new tab. It embeds Luma via an iframe
built from `event.lumaUrl`
(`https://luma.com/0c8i64qw` → `https://lu.ma/embed/event/0c8i64qw/simple`).

If Luma ever changes how it generates embeddable URLs for your event, or the
iframe doesn't load for any reason, update `getLumaEmbedUrl()` in
`RegistrationModal.jsx` — there's also a small "Open registration page
directly" fallback link inside the modal that opens `event.lumaUrl` in a new
tab, in case embedding is ever blocked.

## Countdown

`Countdown.jsx` renders a live Days/Hours/Minutes/Seconds counter to
`event.startDateTime`, right under the hero on the Home page. It
automatically switches to "happening now" once the start time passes, and
"has concluded" once `event.endDateTime` passes.

## Notes

- The registration button links to `event.lumaUrl` — replace the placeholder
  `https://lu.ma` with your real Luma event URL.
- Speaker headshots are placeholder icon tiles — drop real photos into
  `src/data/event.js` (add an `image` field) and swap the icon tile markup in
  `Home.jsx` / `Speakers.jsx` for an `<img>` once you have them.
- Colors and fonts are defined in `tailwind.config.js` under `navy` / `gold`
  and `fontFamily.display` / `fontFamily.sans` — change them there to retheme
  the whole site at once.
