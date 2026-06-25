const DEFAULT_PRIMARY = '#fb7185'

const DEFAULT_APPEARANCE = {
  primaryColor: DEFAULT_PRIMARY,
  heartOpacity: 0.65,
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function getDefaultAppearance() {
  return { ...DEFAULT_APPEARANCE }
}

export function normalizeAppearance(appearance = {}) {
  const primary = appearance.primaryColor || DEFAULT_PRIMARY
  return {
    primaryColor: /^#[0-9a-fA-F]{6}$/.test(primary) ? primary : DEFAULT_PRIMARY,
    heartOpacity: clamp(Number(appearance.heartOpacity ?? DEFAULT_APPEARANCE.heartOpacity), 0.1, 1),
  }
}

function hexToRgb(hex) {
  const value = hex.replace('#', '')
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  }
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0'))
    .join('')}`
}

function rgbToHsl(r, g, b) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    switch (max) {
      case rn:
        h = ((gn - bn) / delta) % 6
        break
      case gn:
        h = (bn - rn) / delta + 2
        break
      default:
        h = (rn - gn) / delta + 4
        break
    }
    h *= 60
    if (h < 0) h += 360
  }

  return { h, s: s * 100, l: l * 100 }
}

function hslToRgb(h, s, l) {
  const sn = s / 100
  const ln = l / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = ln - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  }
}

function shadeFromPrimary(h, s, l, targetL, saturationScale = 1) {
  const { r, g, b } = hslToRgb(h, clamp(s * saturationScale, 8, 100), clamp(targetL, 4, 98))
  return rgbToHex(r, g, b)
}

export function buildPalette(primaryHex) {
  const { r, g, b } = hexToRgb(primaryHex)
  const { h, s, l } = rgbToHsl(r, g, b)

  return {
    50: shadeFromPrimary(h, s, l, 97, 0.35),
    100: shadeFromPrimary(h, s, l, 94, 0.45),
    200: shadeFromPrimary(h, s, l, 88, 0.55),
    300: shadeFromPrimary(h, s, l, 75, 0.75),
    400: primaryHex,
    500: shadeFromPrimary(h, s, l, clamp(l - 8, 20, 70)),
    600: shadeFromPrimary(h, s, l, clamp(l - 16, 16, 60)),
    700: shadeFromPrimary(h, s, l, clamp(l - 24, 12, 50)),
    800: shadeFromPrimary(h, s, l, clamp(l - 32, 10, 40)),
    900: shadeFromPrimary(h, s, l, clamp(l - 40, 8, 32)),
    rgb: `${r}, ${g}, ${b}`,
  }
}

export function heartOpacityBounds(heartOpacity) {
  const strength = clamp(Number(heartOpacity), 0.1, 1)
  return {
    opacityMin: 0.12 + strength * 0.35,
    opacityMax: 0.3 + strength * 0.55,
  }
}

export const THEME_VARS_CACHE_KEY = 'romantic-site-theme-vars'
export const THEME_APPEARANCE_CACHE_KEY = 'romantic-site-appearance'

function collectThemeVars(palette, hearts) {
  const vars = {}

  Object.entries(palette).forEach(([key, value]) => {
    if (key === 'rgb') {
      vars['--theme-rgb'] = value
      return
    }
    vars[`--theme-${key}`] = value
  })

  vars['--heart-opacity-min'] = String(hearts.opacityMin)
  vars['--heart-opacity-max'] = String(hearts.opacityMax)
  return vars
}

function writeThemeCache(appearance, vars) {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem(THEME_VARS_CACHE_KEY, JSON.stringify(vars))
    localStorage.setItem(
      THEME_APPEARANCE_CACHE_KEY,
      JSON.stringify(normalizeAppearance(appearance)),
    )
  } catch {
    // ignore quota / private mode
  }
}

export function readCachedAppearance() {
  if (typeof localStorage === 'undefined') return null

  try {
    const raw = localStorage.getItem(THEME_APPEARANCE_CACHE_KEY)
    if (!raw) return null
    return normalizeAppearance(JSON.parse(raw))
  } catch {
    return null
  }
}

export function applyCachedSiteTheme() {
  if (typeof document === 'undefined') return false

  try {
    const raw = localStorage.getItem(THEME_VARS_CACHE_KEY)
    if (!raw) return false

    const vars = JSON.parse(raw)
    const root = document.documentElement

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, String(value))
    })

    return true
  } catch {
    return false
  }
}

export function applySiteTheme(appearanceInput) {
  if (typeof document === 'undefined') return

  const appearance = normalizeAppearance(appearanceInput)
  const palette = buildPalette(appearance.primaryColor)
  const hearts = heartOpacityBounds(appearance.heartOpacity)
  const vars = collectThemeVars(palette, hearts)
  const root = document.documentElement

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, String(value))
  })

  writeThemeCache(appearance, vars)
}
