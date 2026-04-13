export default function sitemap() {
  const baseUrl = 'https://madycloud.me';
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/admin`, lastModified: new Date() },
    { url: `${baseUrl}/#home`, lastModified: new Date() },
    { url: `${baseUrl}/#certifications`, lastModified: new Date() },
    { url: `${baseUrl}/#education`, lastModified: new Date() },
    { url: `${baseUrl}/#experience`, lastModified: new Date() },
    { url: `${baseUrl}/#projects`, lastModified: new Date() },
    { url: `${baseUrl}/#skills`, lastModified: new Date() },
    { url: `${baseUrl}/#contact`, lastModified: new Date() }
  ];
}