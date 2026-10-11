'use client';

import { useState, useCallback, useEffect } from 'react';
import { LocationData } from '@/types';

export function useGeolocation() {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("ലൊക്കേഷൻ പിന്തുണയ്ക്കുന്നില്ല");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLon(longitude);
        
        try {
          const res = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`);
          if (res.ok) {
            const data = await res.json();
            const newLocation = { lat: latitude, lon: longitude, village: data.village, district: data.district };
            setLocation(newLocation);
            sessionStorage.setItem('farmbot_location', JSON.stringify(newLocation));
          }
        } catch (e) {
           const newLocation = { lat: latitude, lon: longitude, village: 'Kerala', district: 'Kerala' };
           setLocation(newLocation);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setError("ലൊക്കേഷൻ ആക്സസ് നിരസിച്ചു");
      },
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('farmbot_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLat(parsed.lat);
        setLon(parsed.lon);
        setLocation(parsed);
      } catch (e) {}
    }
  }, []);

  return { lat, lon, location, loading, error, requestLocation };
}
