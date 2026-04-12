export default function sitemap() {
  const baseUrl = 'https://madycloud.me';
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/admin`, lastModified: new Date() }
  ];
}