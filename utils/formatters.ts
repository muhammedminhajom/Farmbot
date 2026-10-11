const MALAYALAM_MONTHS = [
  'ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്', 'ഏപ്രിൽ', 'മെയ്', 'ജൂൺ',
  'ജൂലൈ', 'ഓഗസ്റ്റ്', 'സെപ്റ്റംബർ', 'ഒക്ടോബർ', 'നവംബർ', 'ഡിസംബർ'
];

export function formatDateMalayalam(date: Date | string | any): string {
  try {
    const d = new Date(date?.seconds ? date.seconds * 1000 : date);
    if (isNaN(d.getTime())) return "തീയതി ലഭ്യമല്ല";
    
    const day = d.getDate();
    const month = MALAYALAM_MONTHS[d.getMonth()];
    const year = d.getFullYear();
    
    return `${day} ${month} ${year}`;
  } catch (e) {
    return "തീയതി ലഭ്യമല്ല";
  }
}

export function formatTemp(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function getWeatherEmoji(description: string, iconUrl?: string): string {
  const desc = description.toLowerCase();
  if (desc.includes('rain') || desc.includes('drizzle')) return '🌧️';
  if (desc.includes('thunder')) return '⛈️';
  if (desc.includes('cloud')) return '☁️';
  if (desc.includes('clear') || desc.includes('sun')) return '☀️';
  return '⛅';
}
