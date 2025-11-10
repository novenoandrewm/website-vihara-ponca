export function formatDate(
  iso: string,
  locale = 'id-ID',
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    ...opts,
  }).format(new Date(iso))
}
// test
// touch
