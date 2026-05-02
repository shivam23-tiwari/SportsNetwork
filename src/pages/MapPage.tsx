import { useState, useEffect, useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Globe2, Rocket } from 'lucide-react';
import * as d3geo from 'd3-geo';

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export default function MapPage() {
  const [view, setView] = useState<'earth' | 'map' | 'space'>('earth');
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState<any>(null);
  const [clickedCountry, setClickedCountry] = useState<any>(null);
  const [width, height] = useWindowSize();
  const globeRef = useRef<any>(null);
  const transformRef = useRef<any>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);
  
  const getContinentColor = (continent: string) => {
    const colors: Record<string, string> = {
      'Africa': '#f59e0b', // Amber
      'Europe': '#10b981', // Emerald
      'Asia': '#ef4444', // Red
      'North America': '#3b82f6', // Blue
      'South America': '#8b5cf6', // Violet
      'Oceania': '#ec4899', // Pink
      'Antarctica': '#94a3b8', // Slate
      'Seven seas (open ocean)': '#0ea5e9'
    };
    return colors[continent] || '#334155';
  };

  // Projection for the fast 2D map
  const projection = useMemo(() => {
    return d3geo.geoMercator().scale(150).translate([500, 350]);
  }, []);
  const geoPath = useMemo(() => {
    return d3geo.geoPath().projection(projection);
  }, [projection]);

  const handleCountryClick = (d: any, i?: number) => {
    setClickedCountry(d);
    if (view === 'earth' && globeRef.current) {
      const [lng, lat] = d3geo.geoCentroid(d);
      globeRef.current.pointOfView({ lat, lng, altitude: 0.8 }, 1000);
      globeRef.current.controls().autoRotate = false; // Stop rotating when focused
    } else if (view === 'map' && transformRef.current) {
      const countryId = `country-${d.properties.ADM0_A3 || i}`;
      transformRef.current.zoomToElement(countryId, 2.5, 800);
    }
  };

  const getSpecialty = (country: string) => {
    const specialties: Record<string, string> = {
      'Brazil': 'Football legends & 5 World Cups',
      'India': 'Cricket fanaticism & IPL',
      'Argentina': 'Diego Maradona & Lionel Messi',
      'United States': 'Basketball (NBA), Baseball & American Football',
      'United Kingdom': 'Birthplace of modern Football & Cricket',
      'Australia': 'Dominant in Cricket & Rugby',
      'New Zealand': 'Rugby (All Blacks)',
      'France': 'Football powerhouses & cycling (Tour de France)',
      'Spain': 'Tiki-taka football & Tennis legends (Nadal)',
      'Italy': 'Catenaccio football & passionate fans',
      'Germany': 'Football efficiency & 4 World Cups',
      'Japan': 'Baseball & Martial Arts',
    };
    return specialties[country] || 'Rich sporting culture with diverse local games and passion.';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] -mt-4 -mx-4 sm:-mx-4 overflow-hidden bg-black text-white relative rounded-lg">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex flex-wrap justify-center gap-2 p-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
        <button 
          onClick={() => { setView('earth'); setClickedCountry(null); }}
          className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${view === 'earth' ? 'bg-[#cc0000] text-white shadow-lg' : 'hover:bg-white/10'}`}
        >
          <Globe2 size={16} /> Our Earth
        </button>
        <button 
          onClick={() => { setView('map'); setClickedCountry(null); }}
          className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${view === 'map' ? 'bg-[#cc0000] text-white shadow-lg' : 'hover:bg-white/10'}`}
        >
          <MapPin size={16} /> Our Map
        </button>
        <button 
          onClick={() => { setView('space'); setClickedCountry(null); }}
          className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${view === 'space' ? 'bg-[#cc0000] text-white shadow-lg' : 'hover:bg-white/10'}`}
        >
          <Rocket size={16} /> Space
        </button>
      </div>

      <div className="flex-grow w-full h-full relative cursor-grab active:cursor-grabbing pb-0">
        <AnimatePresence>
          {clickedCountry && (view === 'earth' || view === 'map') && (
              <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 backdrop-blur border border-slate-700 p-6 rounded-xl shadow-[0_10px_40px_rgba(204,0,0,0.5)] max-w-sm w-[90%] sm:w-full"
              >
                  <div className="flex items-start justify-between mb-2">
                      <div>
                          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">{clickedCountry.properties.ADMIN || clickedCountry.properties.NAME}</h3>
                          <div className="text-[#cc0000] font-bold text-xs mb-0 uppercase tracking-widest">{clickedCountry.properties.CONTINENT}</div>
                      </div>
                      <button onClick={() => setClickedCountry(null)} className="text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center shrink-0 ml-4">✕</button>
                  </div>
                  <p className="text-slate-300 text-sm italic border-l-2 border-[#cc0000] pl-3 py-1">
                      {getSpecialty(clickedCountry.properties.ADMIN || clickedCountry.properties.NAME)}
                  </p>
              </motion.div>
          )}
        </AnimatePresence>

        {view === 'earth' && (
          <div className="w-full h-full absolute inset-0 flex items-center justify-center">
            <Globe
              ref={(el) => {
                globeRef.current = el;
                if (el) {
                  el.controls().autoRotate = !clickedCountry;
                  el.controls().autoRotateSpeed = 1.2;
                }
              }}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
              polygonsData={countries.features}
              polygonAltitude={d => (d === hoverD || d === clickedCountry) ? 0.08 : 0.01}
              polygonCapColor={d => (d === hoverD || d === clickedCountry) ? 'rgba(204, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.0)'}
              polygonSideColor={() => 'rgba(0, 0, 0, 0.0)'}
              polygonStrokeColor={() => '#333'}
              onPolygonHover={setHoverD}
              onPolygonClick={handleCountryClick}
              polygonsTransitionDuration={300}
              width={width}
              height={height - 100}
            />
          </div>
        )}

        {view === 'map' && (
            <div className="w-full h-full bg-[#0a0f1d] relative z-0">
                <TransformWrapper ref={transformRef} initialScale={1} minScale={0.8} maxScale={8} centerOnInit>
                    <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 1000 650" preserveAspectRatio="xMidYMid meet" className="w-[1000px] h-[650px] max-w-full max-h-full drop-shadow-2xl">
                            <g>
                            {countries.features.map((d: any, i) => (
                                <path
                                    key={`path-${i}`}
                                    id={`country-${d.properties.ADM0_A3 || i}`}
                                    d={geoPath(d) || ''}
                                    className={`transition-all duration-300 cursor-pointer ${hoverD === d ? 'stroke-white stroke-2' : ''} ${clickedCountry === d ? 'stroke-white stroke-2' : ''}`}
                                    fill={hoverD === d ? '#ffffff' : (clickedCountry === d ? '#ffffff' : getContinentColor(d.properties.CONTINENT))}
                                    stroke={hoverD === d || clickedCountry === d ? '#fff' : 'rgba(255,255,255,0.2)'}
                                    strokeWidth={hoverD === d || clickedCountry === d ? "1.5" : "0.5"}
                                    onMouseEnter={() => setHoverD(d)}
                                    onMouseLeave={() => setHoverD(null)}
                                    onClick={() => handleCountryClick(d, i)}
                                />
                            ))}
                            </g>
                        </svg>
                    </TransformComponent>
                </TransformWrapper>
            </div>
        )}

        {view === 'space' && (
            <div className="w-full h-full absolute inset-0 z-0">
                <iframe 
                  src="https://eyes.nasa.gov/apps/solar-system/#/home?rel=0" 
                  className="w-full h-full border-0 absolute top-0 left-0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
                {/* Fallback if iframe takes time to load */}
                <div className="absolute inset-0 -z-10 bg-black flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-700"></div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
