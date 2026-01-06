export type SocialLink = {
  key: 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'whatsapp'
  label: string
  href: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/avalokitesvaraponca/',
  },
  { key: 'facebook', label: 'Facebook', href: 'https://facebook.com/...' },
  { key: 'youtube', label: 'YouTube', href: 'https://youtube.com/@...' },
  { key: 'tiktok', label: 'TikTok', href: 'https://tiktok.com/@...' },
  { key: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/62xxxxxxxxxx' },
]
