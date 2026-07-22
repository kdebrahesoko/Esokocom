/**
 * Esoko brand design tokens — synced from artifacts/esoko-website/src/index.css
 *
 * Primary:   Forest Green  hsl(149,81%,23%)  #0B6A39
 * Secondary: Earth Gold    hsl(44,100%,48%)  #F5B300
 * Accent:    Emerald       hsl(142,76%,36%)  #16A149
 * Brand:     Orange        hsl(25,88%,40%)   #C0570C
 */

const colors = {
  light: {
    text: '#1A2B3C',
    tint: '#0B6A39',

    background: '#FFFFFF',
    foreground: '#1A2B3C',

    card: '#FFFFFF',
    cardForeground: '#1A2B3C',
    cardBorder: '#DDE4EE',

    primary: '#0B6A39',
    primaryForeground: '#FFFFFF',

    secondary: '#F5B300',
    secondaryForeground: '#1A2B3C',

    muted: '#F5F8FC',
    mutedForeground: '#6B7A8F',

    accent: '#16A149',
    accentForeground: '#FFFFFF',

    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',

    border: '#DDE4EE',
    input: '#DDE4EE',

    // Brand orange (Esoko wordmark)
    brand: '#C0570C',
  },

  dark: {
    text: '#FFFFFF',
    tint: '#12A04E',

    background: '#0C1523',
    foreground: '#FFFFFF',

    card: '#14203A',
    cardForeground: '#FFFFFF',
    cardBorder: '#1C2A3D',

    primary: '#12A04E',
    primaryForeground: '#FFFFFF',

    secondary: '#F5B300',
    secondaryForeground: '#1A2B3C',

    muted: '#1C2A3D',
    mutedForeground: '#8A9DB5',

    accent: '#16A149',
    accentForeground: '#FFFFFF',

    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',

    border: '#1C2A3D',
    input: '#1C2A3D',

    brand: '#D97429',
  },

  // Matches --radius: 1.25rem (20px) from the web artifact
  radius: 16,
};

export default colors;
