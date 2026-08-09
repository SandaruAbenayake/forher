export const getVisitorLocation = async () => {
  try {
    const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
    if (!res.ok) throw new Error('geo lookup failed');
    const { ip, city, region, country } = await res.json();
    return { ip, location: [city, region, country].filter(Boolean).join(', ') };
  } catch {
    return { ip: 'unknown', location: 'unknown' };
  }
};
