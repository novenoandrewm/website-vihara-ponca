// src/config/social.ts
export type SocialLink = {
  key: string
  labelKey: string
  href: string
  category: 'vihara' | 'pmv' | 'gabi'
}

// 1. Social Media Vihara
const viharaSocials: SocialLink[] = [
  {
    key: 'whatsapp',
    labelKey: 'social.wa_admin',
    href: 'https://wa.me/62217401177',
    category: 'vihara',
  },
  {
    key: 'vihara-ig',
    labelKey: 'social.vihara_ig',
    href: 'https://www.instagram.com/avalokitesvaraponca/',
    category: 'vihara',
  },
]

// 2. Social Media PMV
const pmvSocials: SocialLink[] = [
  {
    key: 'pmv-ig',
    labelKey: 'social.pmv_ig',
    href: 'https://www.instagram.com/pmvavalokitesvaraponca/',
    category: 'pmv',
  },
  {
    key: 'pmv-tiktok',
    labelKey: 'social.pmv_tiktok',
    href: 'https://www.tiktok.com/@pmvavalokitesvaraponca?lang=en',
    category: 'pmv',
  },
]

// 3. Social Media GABI
const gabiSocials: SocialLink[] = [
  {
    key: 'gabi-ig',
    labelKey: 'social.gabi_ig',
    href: 'https://www.instagram.com/gabi_avalokitesvaraponca/',
    category: 'gabi',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  ...viharaSocials,
  ...pmvSocials,
  ...gabiSocials,
]
