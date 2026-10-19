import { Component, useCallback, useEffect, useRef, useState } from 'react'
import {
  Download,
  ImagePlus,
  Share2,
  UserRound,
  ZoomIn,
  RotateCcw,
  Sparkles,
  CalendarDays,
  MapPin,
  Globe,
  CheckCircle2,
  Briefcase,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const FLYER_WIDTH = 1092
const FLYER_HEIGHT = 1440

const NAVY = '#0A2459'
const DEEP_NAVY = '#0B1F55'
const BLUE = '#1456A8'
const SKY_BLUE = '#2E9BD6'
const RED = '#E8261C'
const GOLD = '#F2B91A'
const GOLD_LIGHT = '#FFE27A'
const GOLD_DARK = '#C48A0A'
const WHITE = '#FFFFFF'

const FONT = '"Arial", "Helvetica Neue", Helvetica, sans-serif'

const CONVENTION_TEXT = 'AMANO Stakeholders Engagement & National Convention 2026'
const TAGLINE_WORDS = ['CONNECT', 'COLLABORATE', 'ADVANCE']
const EVENT_DATES_BIG = '12–14'
const EVENT_DATES_SMALL = 'November 2026'
const EVENT_VENUE = ['Oriental Hotels,', 'Lagos, Nigeria']
const EVENT_TIME = '10am Prompt'
const MEMBER_LABEL = 'AMANO MEMBER'
const THEME_TITLE = ['From Policy', 'to Practice:']
const THEME_SUBTITLE =
  'Executing Maritime Excellence Through Professional Capability and Real-World Results'
const ORG_NAME = 'Alumni of Maritime Academy of Nigeria'
const WEBSITE = 'www.amanoconvention.com'
const EMAIL = 'info@alumniofman.com'
const PHONE = '+2349030000469'
const HASHTAGS = ['#AMANOCON2026', '#FromPolicyToPractice', '#EKODOINGS']

// Photo frame
const FRAME = { x: 80, y: 285, w: 482, h: 560, r: 42 }
const PHOTO = { x: 91, y: 296, w: 460, h: 538, r: 33 }

/* ------------------------------------------------------------------ */
/*  Canvas helpers                                                     */
/* ------------------------------------------------------------------ */

function roundedRect(ctx, x, y, width, height, radius = 20) {
  const r = Math.min(radius, width / 2, height / 2)

  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.arcTo(x + width, y, x + width, y + r, r)
  ctx.lineTo(x + width, y + height - r)
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r)
  ctx.lineTo(x + r, y + height)
  ctx.arcTo(x, y + height, x, y + height - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function drawText(ctx, text, x, y, size, color, weight = 400, align = 'left') {
  ctx.save()
  ctx.font = `${weight} ${size}px ${FONT}`
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.fillText(text, x, y)
  ctx.restore()
}

/** Draws text horizontally stretched/condensed to an exact width (gives the poster's condensed headline look). */
function drawFitted(ctx, text, x, y, size, color, weight, targetWidth, align = 'left') {
  ctx.save()
  ctx.font = `${weight} ${size}px ${FONT}`
  const width = ctx.measureText(text).width || 1
  ctx.translate(x, y)
  ctx.scale(targetWidth / width, 1)
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.fillText(text, 0, 0)
  ctx.restore()
}

function goldGradient(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h)
  g.addColorStop(0, GOLD_LIGHT)
  g.addColorStop(0.35, GOLD)
  g.addColorStop(0.7, GOLD_DARK)
  g.addColorStop(1, GOLD_LIGHT)
  return g
}

function drawImageCover(ctx, image, x, y, width, height, zoom = 1, offsetX = 0, offsetY = 0) {
  if (!image) return

  const imageWidth = image.naturalWidth || image.width
  const imageHeight = image.naturalHeight || image.height

  if (!imageWidth || !imageHeight) return

  const scale = Math.max(width / imageWidth, height / imageHeight) * zoom
  const renderedWidth = imageWidth * scale
  const renderedHeight = imageHeight * scale

  ctx.drawImage(
    image,
    x + width / 2 + offsetX - renderedWidth / 2,
    y + height / 2 + offsetY - renderedHeight / 2,
    renderedWidth,
    renderedHeight,
  )
}

function cloud(ctx, x, y, scale, alpha) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.filter = 'blur(14px)'
  ctx.fillStyle = `rgba(255,255,255,${alpha})`
  const puffs = [
    [0, 0, 70, 38],
    [60, -18, 62, 42],
    [120, 4, 76, 36],
    [-60, 8, 58, 30],
    [40, 14, 110, 30],
  ]
  puffs.forEach(([px, py, rx, ry]) => {
    ctx.beginPath()
    ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.restore()
}

/* ------------------------------------------------------------------ */
/*  Background: sky and sea                                            */
/* ------------------------------------------------------------------ */

function drawBackground(ctx) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, FLYER_HEIGHT)
  sky.addColorStop(0, '#79BDEB')
  sky.addColorStop(0.25, '#A9D6F4')
  sky.addColorStop(0.5, '#D3EAF9')
  sky.addColorStop(0.72, '#F1F8FD')
  sky.addColorStop(1, '#FFFFFF')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, FLYER_WIDTH, FLYER_HEIGHT)

  // Clouds
  cloud(ctx, 120, 60, 1.6, 0.85)
  cloud(ctx, 520, 20, 1.5, 0.75)
  cloud(ctx, 930, 70, 1.6, 0.8)
  cloud(ctx, 960, 340, 1.5, 0.75)
  cloud(ctx, 700, 520, 1.2, 0.7)
  cloud(ctx, 60, 440, 1.2, 0.55)
  cloud(ctx, 60, 650, 1.1, 0.6)

  // Sea
  const sea = ctx.createLinearGradient(0, 780, 0, 1120)
  sea.addColorStop(0, '#6FB2E3')
  sea.addColorStop(0.35, '#A5D0F0')
  sea.addColorStop(1, 'rgba(235,245,253,0)')
  ctx.fillStyle = sea
  ctx.fillRect(0, 780, FLYER_WIDTH, 340)

  // Subtle sea sparkle lines
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 2
  for (let i = 0; i < 14; i += 1) {
    const y = 800 + i * 20
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(FLYER_WIDTH, y + (i % 2 ? 4 : -4))
    ctx.stroke()
  }

}

/* ------------------------------------------------------------------ */
/*  Header / logo                                                      */
/* ------------------------------------------------------------------ */

function drawVectorLogo(ctx) {
  // Wordmark
  drawFitted(ctx, 'AMANO', 76, 168, 112, NAVY, 900, 346)

  // Ship wheel
  const cx = 462
  const cy = 112
  ctx.save()
  ctx.strokeStyle = SKY_BLUE
  ctx.fillStyle = SKY_BLUE
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.arc(cx, cy, 40, 0, Math.PI * 2)
  ctx.stroke()

  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(cx, cy, 26, 0, Math.PI * 2)
  ctx.stroke()

  ctx.lineWidth = 5
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * 8, cy + Math.sin(a) * 8)
    ctx.lineTo(cx + Math.cos(a) * 58, cy + Math.sin(a) * 58)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx + Math.cos(a) * 60, cy + Math.sin(a) * 60, 5, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.beginPath()
  ctx.arc(cx, cy, 9, 0, Math.PI * 2)
  ctx.fill()

  // Red figure on top
  ctx.fillStyle = RED
  roundedRect(ctx, cx - 5, 62, 10, 22, 5)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx, 66, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // Open book
  ctx.save()
  ctx.strokeStyle = NAVY
  ctx.fillStyle = WHITE
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(420, 180)
  ctx.quadraticCurveTo(458, 172, 459, 186)
  ctx.quadraticCurveTo(460, 172, 498, 180)
  ctx.lineTo(498, 196)
  ctx.quadraticCurveTo(460, 190, 459, 200)
  ctx.quadraticCurveTo(458, 190, 420, 196)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  // Sub-brand line
  drawFitted(ctx, 'ALUMNI OF MARITIME ACADEMY OF NIGERIA ORON', 74, 196, 18, RED, 800, 346)
}

function drawLogo(ctx, logo) {
  const naturalWidth = logo && (logo.naturalWidth || logo.width)
  const naturalHeight = logo && (logo.naturalHeight || logo.height)

  if (!naturalWidth || !naturalHeight) {
    drawVectorLogo(ctx)
    return
  }

  // Logo sits on the left; the bold AMANO wordmark is written next to it.
  const box = { x: 70, y: 56, w: 140, h: 140 }
  const scale = Math.min(box.w / naturalWidth, box.h / naturalHeight)
  const w = naturalWidth * scale
  const h = naturalHeight * scale

  ctx.drawImage(logo, box.x + (box.w - w) / 2, box.y + (box.h - h) / 2, w, h)

  const textX = 226
  const textWidth = 296

  drawFitted(ctx, 'AMANO', textX, 150, 118, NAVY, 900, textWidth)

  ctx.fillStyle = goldGradient(ctx, textX, 162, textWidth, 4)
  ctx.fillRect(textX, 162, textWidth, 4)

  drawFitted(ctx, 'ALUMNI OF MARITIME ACADEMY OF NIGERIA ORON', textX, 190, 18, RED, 800, textWidth)
}

function drawHeader(ctx, logo) {
  drawLogo(ctx, logo)

  // Vertical gold divider
  ctx.fillStyle = goldGradient(ctx, 548, 108, 6, 90)
  ctx.fillRect(549, 108, 4, 90)

  // Right title
  drawFitted(ctx, 'STAKEHOLDERS ENGAGEMENT &', 580, 140, 34, BLUE, 900, 426)
  drawFitted(ctx, 'NATIONAL CONVENTION', 580, 183, 46, NAVY, 900, 355)

  // Red 2026 badge
  roundedRect(ctx, 938, 147, 80, 42, 8)
  ctx.fillStyle = '#E02B20'
  ctx.fill()
  drawFitted(ctx, '2026', 978, 182, 40, WHITE, 900, 66, 'center')

  // Underline
  ctx.fillStyle = BLUE
  ctx.fillRect(580, 193, 437, 2)

  // Tagline row
  ctx.fillStyle = goldGradient(ctx, 70, 230, 120, 5)
  roundedRect(ctx, 70, 230, 118, 5, 2.5)
  ctx.fill()
  roundedRect(ctx, 898, 230, 118, 5, 2.5)
  ctx.fill()

  const centers = [291, 544, 798]
  ctx.save()
  if ('letterSpacing' in ctx) ctx.letterSpacing = '7px'
  TAGLINE_WORDS.forEach((word, i) => {
    drawText(ctx, word, centers[i] + 3, 241, 22, NAVY, 600, 'center')
  })
  ctx.restore()

  ;[397, 690].forEach((x) => {
    ctx.beginPath()
    ctx.fillStyle = GOLD
    ctx.arc(x, 234, 5, 0, Math.PI * 2)
    ctx.fill()
  })
}

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function iconCircle(ctx, cx, cy, r) {
  ctx.save()
  ctx.shadowColor = 'rgba(10,36,89,0.3)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 4
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = goldGradient(ctx, cx - r, cy - r, r * 2, r * 2)
  ctx.fill()
  ctx.restore()

  ctx.beginPath()
  ctx.arc(cx, cy, r - 6, 0, Math.PI * 2)
  ctx.fillStyle = NAVY
  ctx.fill()
}

function drawLucideIcon(ctx, img, cx, cy, size) {
  if (!img) return
  ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size)
}

function drawCalendarIcon(ctx, cx, cy, icon) {
  iconCircle(ctx, cx, cy, 51)
  drawLucideIcon(ctx, icon, cx, cy, 52)
}

function drawPinIcon(ctx, cx, cy, icon) {
  iconCircle(ctx, cx, cy, 51)
  drawLucideIcon(ctx, icon, cx, cy, 52)
}

function drawClockIcon(ctx, cx, cy, icon) {
  iconCircle(ctx, cx, cy, 51)
  drawLucideIcon(ctx, icon, cx, cy, 52)
}

function smallCircle(ctx, cx, cy, r = 22) {
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = NAVY
  ctx.fill()
}

function drawSocials(ctx) {
  const y = 1215
  ;[248, 308, 367, 426].forEach((x) => smallCircle(ctx, x, y))

  drawText(ctx, 'in', 248, y + 9, 25, WHITE, 800, 'center')
  drawText(ctx, 'f', 309, y + 12, 32, WHITE, 800, 'center')

  // Instagram
  ctx.save()
  ctx.strokeStyle = WHITE
  ctx.lineWidth = 2.5
  roundedRect(ctx, 367 - 12, y - 12, 24, 24, 7)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(367, y, 5.5, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(367 + 8, y - 8, 1.6, 0, Math.PI * 2)
  ctx.fillStyle = WHITE
  ctx.fill()
  ctx.restore()

  // X
  ctx.save()
  ctx.strokeStyle = WHITE
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(418, y - 10)
  ctx.lineTo(434, y + 10)
  ctx.moveTo(434, y - 10)
  ctx.lineTo(418, y + 10)
  ctx.stroke()
  ctx.restore()
}

function drawContactIcons(ctx, icons) {
  const y = 1262

  smallCircle(ctx, 168, y, 18)
  drawLucideIcon(ctx, icons.globe, 168, y, 22)

  smallCircle(ctx, 519, y, 18)
  drawLucideIcon(ctx, icons.mail, 519, y, 22)

  smallCircle(ctx, 803, y, 18)
  drawLucideIcon(ctx, icons.phone, 803, y, 22)
}

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(/\s+/)
  const lines = []
  let line = ''

  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word

    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  })

  if (line) lines.push(line)
  return lines
}

function drawTheme(ctx) {
  const panel = { x: 600, y: 535, w: 442, h: 305 }

  // Frosted panel with gold edge
  ctx.save()
  ctx.shadowColor = 'rgba(10,36,89,0.25)'
  ctx.shadowBlur = 20
  ctx.shadowOffsetY = 8
  roundedRect(ctx, panel.x, panel.y, panel.w, panel.h, 30)
  ctx.fillStyle = 'rgba(255,255,255,0.72)'
  ctx.fill()
  ctx.restore()

  roundedRect(ctx, panel.x, panel.y, panel.w, panel.h, 30)
  ctx.strokeStyle = goldGradient(ctx, panel.x, panel.y, panel.w, panel.h)
  ctx.lineWidth = 3
  ctx.stroke()

  const left = panel.x + 30

  // Theme label
  roundedRect(ctx, left, panel.y + 20, 118, 36, 18)
  ctx.fillStyle = NAVY
  ctx.fill()
  ctx.save()
  if ('letterSpacing' in ctx) ctx.letterSpacing = '4px'
  drawText(ctx, 'THEME', left + 62, panel.y + 45, 19, GOLD_LIGHT, 800, 'center')
  ctx.restore()

  // Title
  drawFitted(ctx, THEME_TITLE[0], left, panel.y + 112, 66, NAVY, 900, 330)
  drawFitted(ctx, THEME_TITLE[1], left, panel.y + 174, 66, BLUE, 900, 352)

  // Divider
  ctx.fillStyle = goldGradient(ctx, left, panel.y + 194, 150, 6)
  roundedRect(ctx, left, panel.y + 194, 150, 6, 3)
  ctx.fill()

  // Subtitle
  ctx.font = `700 23px ${FONT}`
  const lines = wrapLines(ctx, THEME_SUBTITLE, panel.w - 60)
  lines.forEach((line, i) => {
    drawText(ctx, line, left, panel.y + 235 + i * 30, 23, NAVY, 700)
  })
}

/* ------------------------------------------------------------------ */
/*  Main flyer                                                         */
/* ------------------------------------------------------------------ */

function drawPhotoPlaceholder(ctx) {
  const { x, y, w, h } = PHOTO
  const g = ctx.createLinearGradient(x, y, x, y + h)
  g.addColorStop(0, '#E9EEF4')
  g.addColorStop(1, '#C8D4E3')
  ctx.fillStyle = g
  ctx.fillRect(x, y, w, h)

  ctx.fillStyle = 'rgba(10,36,89,0.25)'
  ctx.beginPath()
  ctx.arc(x + w / 2, y + 210, 78, 0, Math.PI * 2)
  ctx.fill()

  ctx.beginPath()
  ctx.ellipse(x + w / 2, y + h + 20, 190, 235, 0, Math.PI, 0)
  ctx.fill()

  drawText(ctx, 'YOUR PHOTO', x + w / 2, y + 475, 22, NAVY, 800, 'center')
}

function drawFlyer(canvas, { name, position, photo, logo, icons, zoom, offsetX, offsetY }) {
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = FLYER_WIDTH
  canvas.height = FLYER_HEIGHT

  ctx.clearRect(0, 0, FLYER_WIDTH, FLYER_HEIGHT)
  ctx.textBaseline = 'alphabetic'

  drawBackground(ctx)
  drawHeader(ctx, logo)

  /* ---- Photo ---- */
  ctx.save()
  ctx.shadowColor = 'rgba(10,36,89,0.3)'
  ctx.shadowBlur = 22
  ctx.shadowOffsetY = 8
  roundedRect(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h, FRAME.r)
  ctx.fillStyle = goldGradient(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h)
  ctx.fill()
  ctx.restore()

  ctx.save()
  roundedRect(ctx, PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h, PHOTO.r)
  ctx.fillStyle = WHITE
  ctx.fill()
  ctx.clip()

  if (photo) {
    drawImageCover(ctx, photo, PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h, zoom, offsetX, offsetY)
  } else {
    drawPhotoPlaceholder(ctx)
  }
  ctx.restore()

  /* ---- Headline ---- */
  drawFitted(ctx, 'I WILL BE', 608, 405, 90, NAVY, 900, 322)
  drawFitted(ctx, 'ATTENDING', 602, 492, 104, NAVY, 900, 443)

  ctx.fillStyle = goldGradient(ctx, 603, 508, 262, 8)
  roundedRect(ctx, 603, 508, 262, 8, 4)
  ctx.fill()

  /* ---- Convention theme ---- */
  drawTheme(ctx)

  /* ---- Name banner ---- */
  ctx.save()
  ctx.shadowColor = 'rgba(10,36,89,0.35)'
  ctx.shadowBlur = 20
  ctx.shadowOffsetY = 8
  roundedRect(ctx, 112, 865, 866, 127, 42)
  ctx.fillStyle = goldGradient(ctx, 112, 865, 866, 127)
  ctx.fill()
  ctx.restore()

  roundedRect(ctx, 118, 871, 854, 115, 37)
  const bannerFill = ctx.createLinearGradient(0, 871, 0, 986)
  bannerFill.addColorStop(0, '#12307A')
  bannerFill.addColorStop(1, '#081B4B')
  ctx.fillStyle = bannerFill
  ctx.fill()

  const displayName = (name.trim() || 'YOUR NAME HERE').toUpperCase()
  const maxNameWidth = 700

  let nameSize = 74
  ctx.font = `900 ${nameSize}px ${FONT}`
  // Allow up to ~28% horizontal condensing before shrinking the font.
  while (ctx.measureText(displayName).width > maxNameWidth / 0.72 && nameSize > 30) {
    nameSize -= 2
    ctx.font = `900 ${nameSize}px ${FONT}`
  }
  const rawWidth = ctx.measureText(displayName).width
  const nameWidth = Math.min(rawWidth * 0.92, maxNameWidth)
  drawFitted(ctx, displayName, 545, 940, nameSize, WHITE, 900, nameWidth, 'center')

  // Member pill
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.25)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 4
  roundedRect(ctx, 277, 958, 535, 57, 28)
  ctx.fillStyle = goldGradient(ctx, 277, 958, 535, 57)
  ctx.fill()
  ctx.restore()

  roundedRect(ctx, 277, 958, 535, 57, 28)
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'
  ctx.lineWidth = 2
  ctx.stroke()

  const positionText = (position.trim() || MEMBER_LABEL).toUpperCase()
  ctx.font = `800 36px ${FONT}`
  const positionWidth = Math.min(ctx.measureText(positionText).width, 470)
  drawFitted(ctx, positionText, 545, 1000, 36, DEEP_NAVY, 800, positionWidth, 'center')

  /* ---- Details row ---- */
  drawCalendarIcon(ctx, 123, 1105, icons.calendar)
  drawFitted(ctx, EVENT_DATES_BIG, 187, 1107, 44, NAVY, 900, 114)
  drawFitted(ctx, EVENT_DATES_SMALL, 188, 1136, 26, BLUE, 800, 197)

  ctx.fillStyle = goldGradient(ctx, 410, 1070, 3, 76)
  ctx.fillRect(410, 1070, 3, 76)

  drawPinIcon(ctx, 482, 1105, icons.pin)
  drawFitted(ctx, EVENT_VENUE[0], 541, 1104, 26, BLUE, 800, 195)
  drawFitted(ctx, EVENT_VENUE[1], 541, 1133, 26, BLUE, 800, 183)

  ctx.fillStyle = goldGradient(ctx, 755, 1070, 3, 76)
  ctx.fillRect(755, 1070, 3, 76)

  drawClockIcon(ctx, 829, 1105, icons.clock)
  drawFitted(ctx, EVENT_TIME, 890, 1110, 25, NAVY, 800, 156)

  /* ---- Socials + contacts ---- */
  drawSocials(ctx)

  ctx.fillStyle = goldGradient(ctx, 476, 1198, 3, 34)
  ctx.fillRect(476, 1198, 3, 34)
  drawFitted(ctx, ORG_NAME, 504, 1220, 19, NAVY, 600, 348)

  drawContactIcons(ctx, icons)
  drawFitted(ctx, WEBSITE, 202, 1268, 19, NAVY, 600, 246)

  ctx.fillStyle = goldGradient(ctx, 475, 1246, 3, 34)
  ctx.fillRect(475, 1246, 3, 34)
  drawFitted(ctx, EMAIL, 550, 1268, 19, NAVY, 600, 189)

  ctx.fillStyle = goldGradient(ctx, 762, 1246, 3, 34)
  ctx.fillRect(762, 1246, 3, 34)
  drawFitted(ctx, PHONE, 833, 1268, 19, NAVY, 600, 138)

  /* ---- Footer curve ---- */
  ctx.beginPath()
  ctx.moveTo(0, 1362)
  ctx.quadraticCurveTo(FLYER_WIDTH / 2, 1250, FLYER_WIDTH, 1362)
  ctx.lineTo(FLYER_WIDTH, FLYER_HEIGHT)
  ctx.lineTo(0, FLYER_HEIGHT)
  ctx.closePath()
  const footer = ctx.createLinearGradient(0, 1300, 0, FLYER_HEIGHT)
  footer.addColorStop(0, '#12307A')
  footer.addColorStop(1, '#0A2459')
  ctx.fillStyle = footer
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(0, 1356)
  ctx.quadraticCurveTo(FLYER_WIDTH / 2, 1244, FLYER_WIDTH, 1356)
  ctx.strokeStyle = goldGradient(ctx, 0, 1290, FLYER_WIDTH, 60)
  ctx.lineWidth = 5
  ctx.stroke()

  // Hashtags
  drawText(ctx, HASHTAGS[0], 288, 1371, 22, WHITE, 600, 'center')
  drawText(ctx, HASHTAGS[1], 573, 1371, 22, WHITE, 600, 'center')
  drawText(ctx, HASHTAGS[2], 829, 1371, 22, WHITE, 600, 'center')

  ctx.fillStyle = GOLD
  ctx.fillRect(424, 1350, 3, 40)
  ctx.fillRect(723, 1350, 3, 40)
}

/* ------------------------------------------------------------------ */
/*  Utilities                                                          */
/* ------------------------------------------------------------------ */

// Lucide icon geometry (ISC licence), inlined so no server-rendering code
// has to ship to the browser.
const ICON_SHAPES = {
  calendar:
    '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  globe:
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  mail: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
  phone:
    '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
}

/** Turns a Lucide icon into an Image so it can be drawn on the canvas. */
function iconToImage(name, color, size = 96) {
  return new Promise((resolve) => {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" ` +
      `fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
      `${ICON_SHAPES[name]}</svg>`
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  })
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error('Unable to read this image.'))

    reader.onload = () => {
      const image = new Image()

      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('This image could not be opened.'))
      image.src = String(reader.result)
    }

    reader.readAsDataURL(file)
  })
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function AttendingPage() {
  const canvasRef = useRef(null)
  const photoInputRef = useRef(null)

  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [logo, setLogo] = useState(null)
  const [icons, setIcons] = useState({})
  const [photo, setPhoto] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const image = new Image()

    image.onload = () => setLogo(image)
    image.onerror = () => setLogo(null)
    image.src = '/amano-logo.png'
  }, [])

  useEffect(() => {
    let active = true

    Promise.all([
      iconToImage('calendar', '#FFFFFF'),
      iconToImage('pin', '#F2B91A'),
      iconToImage('clock', '#FFFFFF'),
      iconToImage('globe', '#FFFFFF'),
      iconToImage('mail', '#FFFFFF'),
      iconToImage('phone', '#FFFFFF'),
    ]).then(([calendar, pin, clock, globe, mail, phone]) => {
      if (active) setIcons({ calendar, pin, clock, globe, mail, phone })
    })

    return () => {
      active = false
    }
  }, [])

  const redrawFlyer = useCallback(() => {
    try {
      drawFlyer(canvasRef.current, { name, position, photo, logo, icons, zoom, offsetX, offsetY })
    } catch (err) {
      console.error('Flyer drawing failed:', err)
    }
  }, [name, position, photo, logo, icons, zoom, offsetX, offsetY])

  useEffect(() => {
    redrawFlyer()
  }, [redrawFlyer])

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setNotice('')

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file.')
      event.target.value = ''
      return
    }

    if (file.size > 12 * 1024 * 1024) {
      setError('Your photo must be 12 MB or smaller.')
      event.target.value = ''
      return
    }

    try {
      const image = await loadImage(file)
      setPhoto(image)
      setZoom(1)
      setOffsetX(0)
      setOffsetY(0)
      setNotice('Your photo has been added to the flyer.')
    } catch (err) {
      setError(err.message || 'Unable to load this photo.')
    }

    event.target.value = ''
  }

  function canvasToBlob(failMessage) {
    const canvas = canvasRef.current

    return new Promise((resolve, reject) => {
      if (!canvas) {
        reject(new Error(failMessage))
        return
      }

      canvas.toBlob((result) => {
        if (result) resolve(result)
        else reject(new Error(failMessage))
      }, 'image/png')
    })
  }

  async function downloadFlyer() {
    setBusy(true)
    setError('')
    setNotice('')

    try {
      const blob = await canvasToBlob('The flyer could not be exported.')

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = `AMANO-Convention-2026-${(name.trim() || 'Attendee')
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-|-$/g, '')}.png`

      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      setNotice('Your high-quality flyer has been downloaded.')
    } catch (err) {
      setError(err.message || 'Could not download the flyer. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function shareFlyer() {
    setBusy(true)
    setError('')
    setNotice('')

    try {
      const blob = await canvasToBlob('The flyer could not be prepared for sharing.')

      const file = new File([blob], 'AMANO-Convention-2026.png', {
        type: 'image/png',
      })

      const message = `I'll be attending the ${CONVENTION_TEXT}!\n12–14 November 2026 | ${EVENT_VENUE.join(' ')}\n${WEBSITE}\n${HASHTAGS.join(' ')}`

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: CONVENTION_TEXT,
          text: message,
          files: [file],
        })

        setNotice('Your flyer has been shared.')
      } else {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
        setNotice('WhatsApp has opened. Download your flyer and attach the PNG image to your message.')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Sharing failed. Please download the flyer instead.')
      }
    } finally {
      setBusy(false)
    }
  }

  function resetPhoto() {
    setPhoto(null)
    setZoom(1)
    setOffsetX(0)
    setOffsetY(0)
    setError('')
    setNotice('Photo removed. You can add another one whenever you are ready.')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#061326] text-white">
      {/* Premium page background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-32 h-96 w-96 rounded-full bg-[#008BE0]/15 blur-[120px]" />
        <div className="absolute -right-20 top-10 h-96 w-96 rounded-full bg-[#F2C11D]/10 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Page introduction */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F2C11D]/30 bg-[#F2C11D]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#FFE9A0] sm:text-sm">
            <Sparkles size={16} />
            Your moment. Your convention.
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            I’m <span className="text-[#F2C11D]">Attending!</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Create your personalised AMANO Stakeholders Engagement &amp; National Convention 2026
            flyer. Add your photo, enter your name, and share the excitement.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={17} className="text-[#F2C11D]" />
              12–14 November 2026 · 10am Prompt
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={17} className="text-[#F2C11D]" />
              Oriental Hotels, Lagos, Nigeria
            </span>
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          {/* Controls */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2C11D]/10 text-[#F2C11D]">
                <UserRound size={23} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Personalise your flyer</h2>
                <p className="mt-1 text-sm text-slate-400">Make it yours in a few simple steps.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="attendee-name" className="mb-2 block text-sm font-semibold text-slate-200">
                  Your full name
                </label>
                <input
                  id="attendee-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value.slice(0, 70))}
                  placeholder="Enter your full name"
                  maxLength={70}
                  className="w-full rounded-xl border border-white/10 bg-[#08172B] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-[#F2C11D]/70 focus:ring-2 focus:ring-[#F2C11D]/10"
                />
                <p className="mt-2 text-xs text-slate-500">Your name will appear on the flyer.</p>
              </div>

              <div>
                <label htmlFor="attendee-position" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <Briefcase size={15} className="text-[#F2C11D]" />
                  Your work position
                </label>
                <input
                  id="attendee-position"
                  type="text"
                  value={position}
                  onChange={(event) => setPosition(event.target.value.slice(0, 40))}
                  placeholder="e.g. Operations Manager"
                  maxLength={40}
                  className="w-full rounded-xl border border-white/10 bg-[#08172B] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-[#F2C11D]/70 focus:ring-2 focus:ring-[#F2C11D]/10"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Shown under your name. Leave empty to show “AMANO Member”.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">Your photo</label>

                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-[#F2C11D]/50 bg-[#F2C11D]/[0.055] px-4 py-6 text-left transition hover:border-[#F2C11D] hover:bg-[#F2C11D]/10"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F2C11D]/15 text-[#F2C11D] transition group-hover:scale-105">
                    <ImagePlus size={23} />
                  </span>
                  <span>
                    <span className="block font-bold text-white">
                      {photo ? 'Change your photo' : 'Upload your photo'}
                    </span>
                    <span className="mt-1 block text-sm text-slate-400">
                      PNG, JPG or WebP · Maximum 12 MB
                    </span>
                  </span>
                </button>

                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {photo && (
                <div className="space-y-5 rounded-2xl border border-white/10 bg-black/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">Adjust your photo</span>
                    <button
                      type="button"
                      onClick={resetPhoto}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-white"
                    >
                      <RotateCcw size={14} />
                      Remove
                    </button>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <label htmlFor="photo-zoom" className="text-slate-300">
                        Zoom
                      </label>
                      <span className="text-[#F2C11D]">{zoom.toFixed(1)}×</span>
                    </div>
                    <input
                      id="photo-zoom"
                      type="range"
                      min="1"
                      max="2.5"
                      step="0.1"
                      value={zoom}
                      onChange={(event) => setZoom(Number(event.target.value))}
                      className="w-full accent-[#F2C11D]"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <label htmlFor="photo-horizontal" className="text-slate-300">
                        Horizontal position
                      </label>
                    </div>
                    <input
                      id="photo-horizontal"
                      type="range"
                      min="-180"
                      max="180"
                      step="5"
                      value={offsetX}
                      onChange={(event) => setOffsetX(Number(event.target.value))}
                      className="w-full accent-[#F2C11D]"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <label htmlFor="photo-vertical" className="text-slate-300">
                        Vertical position
                      </label>
                    </div>
                    <input
                      id="photo-vertical"
                      type="range"
                      min="-220"
                      max="220"
                      step="5"
                      value={offsetY}
                      onChange={(event) => setOffsetY(Number(event.target.value))}
                      className="w-full accent-[#F2C11D]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setZoom(1)
                      setOffsetX(0)
                      setOffsetY(0)
                    }}
                    className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                  >
                    <ZoomIn size={16} />
                    Reset photo position
                  </button>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                >
                  {error}
                </div>
              )}

              {notice && !error && (
                <div
                  role="status"
                  className="flex items-start gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
                >
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
                  <span>{notice}</span>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={downloadFlyer}
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F2C11D] px-4 py-3.5 font-bold text-[#071326] transition hover:bg-[#FFE083] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download size={19} />
                  {busy ? 'Please wait…' : 'Download PNG'}
                </button>

                <button
                  type="button"
                  onClick={shareFlyer}
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3.5 font-bold text-white transition hover:border-[#F2C11D]/50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Share2 size={19} />
                  Share flyer
                </button>
              </div>

              <p className="text-xs leading-5 text-slate-500">
                Your flyer is generated in your browser. The downloaded PNG is sized for high-quality
                sharing on WhatsApp and social media.
              </p>
            </div>
          </section>

          {/* Flyer preview */}
          <section className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Your flyer preview</h2>
                <p className="mt-1 text-sm text-slate-400">Your changes appear automatically.</p>
              </div>
              <span className="rounded-full border border-[#F2C11D]/30 bg-[#F2C11D]/10 px-3 py-1.5 text-xs font-semibold text-[#FFE9A0]">
                {FLYER_WIDTH} × {FLYER_HEIGHT} px
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#020917] p-2 shadow-2xl sm:p-4">
              <canvas
                ref={canvasRef}
                width={FLYER_WIDTH}
                height={FLYER_HEIGHT}
                aria-label="Preview of your AMANO National Convention 2026 attending flyer"
                className="block h-auto w-full rounded-xl"
              />
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <Globe size={20} className="mt-0.5 shrink-0 text-[#F2C11D]" />
              <p className="text-sm leading-6 text-slate-400">
                <span className="font-semibold text-slate-200">Spread the word.</span> Download your
                personalised flyer and share it with friends, colleagues, and fellow attendees.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

/* Shows the real error on screen instead of a blank page. */
class AttendingBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Attending page crashed:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#061326] p-6 text-white">
          <h1 className="text-xl font-bold text-[#F2C11D]">This page hit an error</h1>
          <pre className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-black/40 p-4 text-sm text-red-200">
            {String(this.state.error?.stack || this.state.error)}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}

export default function Attending() {
  return (
    <AttendingBoundary>
      <AttendingPage />
    </AttendingBoundary>
  )
}
