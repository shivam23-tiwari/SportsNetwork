import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import PlayerCard from '../components/PlayerCard';
import { getNews, getPlayers, getFixtures } from '../services/api';
import { motion } from 'motion/react';

export default function SportCategory() {
  const { sport } = useParams();
  const [news, setNews] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeMatchTab, setActiveMatchTab] = useState<string>('upcoming');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [newsData, playersData, fixturesData] = await Promise.all([
          getNews(sport),
          getPlayers(sport),
          getFixtures(sport),
        ]);
        setNews(newsData);
        setPlayers(playersData);
        setFixtures(fixturesData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [sport]);

  if (loading) {
    return (
      <div className="flex h-64 justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const sportImages: any = {
    football: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1200', // Football stadium
    cricket: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Eden_Gardens_under_floodlights_during_a_match.jpg', // Cricket stadium
    nba: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1200', // NBA basketball court
    f1: 'https://upload.wikimedia.org/wikipedia/commons/1/14/2010_Malaysian_GP_opening_lap.jpg', // F1 car
    ipl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Wankhede_Stadium.jpg' // IPL
  };

  const headerImage = sportImages[sport?.toLowerCase() || ''] || 'https://via.placeholder.com/1200x600?text=Sports';

  return (
    <div className="space-y-12">
      <div className="bg-slate-900 rounded-md h-64 sm:h-96 text-white flex items-center justify-center relative overflow-hidden mt-4 shadow-xl">
        <img src={headerImage} alt={sport} className="absolute inset-0 w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-black/40"></div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight italic z-10 drop-shadow-2xl">{sport}</h1>
      </div>

      {news.length > 0 && (
        <section>
          <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-white rounded-sm border border-slate-200">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-600">Latest News - {sport}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, idx) => (
              <motion.div
                key={item.id || item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <NewsCard
                  id={item.id || item._id}
                  title={item.title}
                  category={item.category}
                  image={item.image}
                  source={item.source}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {sport === 'ipl' && (
        <>
          <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden">
            <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">IPL 2023 Points Table</h2>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-max text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="uppercase tracking-widest text-[10px] text-slate-400 border-b border-slate-200">
                    <th className="px-4 py-2 font-bold">Team</th>
                    <th className="px-4 py-2 font-bold text-center">P</th>
                    <th className="px-4 py-2 font-bold text-center">W</th>
                    <th className="px-4 py-2 font-bold text-center">L</th>
                    <th className="px-4 py-2 font-bold text-center">Pts</th>
                    <th className="px-4 py-2 font-bold text-center">NRR</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, team: 'Gujarat Titans', p: 14, w: 10, l: 4, pts: 20, nrr: '+0.809' },
                    { rank: 2, team: 'Chennai Super Kings', p: 14, w: 8, l: 5, pts: 17, nrr: '+0.652' },
                    { rank: 3, team: 'Lucknow Super Giants', p: 14, w: 8, l: 5, pts: 17, nrr: '+0.284' },
                    { rank: 4, team: 'Mumbai Indians', p: 14, w: 8, l: 6, pts: 16, nrr: '-0.044' },
                    { rank: 5, team: 'Rajasthan Royals', p: 14, w: 7, l: 7, pts: 14, nrr: '+0.148' },
                    { rank: 6, team: 'Royal Challengers Bangalore', p: 14, w: 7, l: 7, pts: 14, nrr: '+0.135' },
                    { rank: 7, team: 'Kolkata Knight Riders', p: 14, w: 6, l: 8, pts: 12, nrr: '-0.239' },
                    { rank: 8, team: 'Punjab Kings', p: 14, w: 6, l: 8, pts: 12, nrr: '-0.304' },
                    { rank: 9, team: 'Delhi Capitals', p: 14, w: 5, l: 9, pts: 10, nrr: '-0.808' },
                    { rank: 10, team: 'Sunrisers Hyderabad', p: 14, w: 4, l: 10, pts: 8, nrr: '-0.590' }
                  ].map((row, idx) => (
                    <tr key={row.team} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-800 font-bold flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-medium w-4">{row.rank}</span>
                        {row.team}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">{row.p}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{row.w}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{row.l}</td>
                      <td className="px-4 py-3 text-center font-bold text-amber-600">{row.pts}</td>
                      <td className={`px-4 py-3 text-center font-mono text-xs ${row.nrr.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{row.nrr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden mt-8">
            <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">Recent Standout Performers</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Sunil Narine', runs: 482, wickets: 17, team: 'KKR' },
                { name: 'Virat Kohli', runs: 741, wickets: 0, team: 'RCB' },
                { name: 'Travis Head', runs: 567, wickets: 0, team: 'SRH' },
                { name: 'Jasprit Bumrah', runs: 0, wickets: 20, team: 'MI' },
                { name: 'Heinrich Klaasen', runs: 479, strikes: '171.07', team: 'SRH' },
              ].map((player) => (
                <div key={player.name} className="border border-slate-200 rounded-md p-3 flex flex-col items-center justify-center text-center bg-slate-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500 rounded-bl-full flex items-start justify-end p-1 z-10"><span className="text-[8px] font-bold text-white capitalize mr-0.5 mt-0.5">Top</span></div>
                  <h4 className="font-bold text-[13px] text-slate-800 line-clamp-1 mt-2 relative z-20">{player.name}</h4>
                  <div className="text-xl font-black text-slate-700 my-1">{player.runs || player.wickets} <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">{player.runs ? 'Runs' : 'Wickets'}</span></div>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase leading-snug">{player.team}</p>
                  <div className="text-[10px] font-bold text-slate-600 mt-2 bg-slate-200 px-2 py-1 rounded w-full line-clamp-1">{player.wickets ? `Wkts: ${player.wickets}` : player.strikes ? `SR: ${player.strikes}` : 'Orange Cap'}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden mt-8">
            <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">Top 5 Best Players of IPL All-Time (Runs & Centuries)</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Virat Kohli', runs: 8004, centuries: 8, team: 'RCB', image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Virat_Kohli_in_PMO_New_Delhi.jpg' },
                { name: 'Shikhar Dhawan', runs: 6769, centuries: 2, team: 'PBKS', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/SHIKHAR_DHAWAN_%2816005494418%29.jpg' },
                { name: 'David Warner', runs: 6565, centuries: 4, team: 'DC', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/DAVID_WARNER_%2811704782453%29.jpg' },
                { name: 'Rohit Sharma', runs: 6628, centuries: 2, team: 'MI', image: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Rohit_Sharma_2015_%28cropped%29.jpg' },
                { name: 'Suresh Raina', runs: 5528, centuries: 1, team: 'CSK', image: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Suresh_Raina_grace_the_%27Salaam_Sachin%27_conclave.jpg' },
              ].map((player) => (
                <div key={player.name} className="border border-slate-200 rounded-md p-4 flex flex-col items-center justify-center text-center bg-slate-50 relative overflow-hidden group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-200 border-2 border-white mb-3 shadow z-10">
                    <img src={player.image} alt={player.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" style={{ objectPosition: 'center 10%' }} />
                  </div>
                  <h4 className="font-bold text-[13px] text-slate-800 line-clamp-1 truncate relative z-10">{player.name}</h4>
                  <div className="text-xl sm:text-2xl font-black text-amber-500 my-1 relative z-10">{player.runs} <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">Runs</span></div>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase leading-snug relative z-10">{player.team}</p>
                  <div className="text-[10px] font-bold text-slate-600 mt-2 bg-slate-200 px-2 py-1 rounded w-full line-clamp-1 relative z-10">Centuries: {player.centuries}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden mt-8">
            <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">Most Successful Captains</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'MS Dhoni', titles: 5, team: 'CSK', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/MS_Dhoni_%28Prabhav_%2723_-_RiGI_2023%29.jpg' },
                { name: 'Rohit Sharma', titles: 5, team: 'MI', image: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Rohit_Sharma_2015_%28cropped%29.jpg' },
                { name: 'Gautam Gambhir', titles: 2, team: 'KKR', image: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Padma_Shri_Gautam_Gambhir_%28cropped%29.jpg' },
              ].map((captain) => (
                <div key={captain.name} className="border border-slate-200 rounded-md p-4 flex flex-col items-center justify-center text-center bg-slate-50 relative overflow-hidden group">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 border-2 border-white mb-3 shadow z-10">
                    <img src={captain.image} alt={captain.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" style={{ objectPosition: 'center 10%' }} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 z-10 relative">{captain.name}</h4>
                  <div className="text-2xl font-black text-amber-500 my-1 flex items-center justify-center flex-col gap-1">
                    <div>{captain.titles} <span className="text-xs text-slate-500 uppercase tracking-widest">Titles</span></div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase leading-snug line-clamp-1">{captain.team}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden mt-8">
            <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">IPL Trophy Winners</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { team: 'Chennai Super Kings', wins: 5, years: '2010, 2011, 2018, 2021, 2023', logo: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Chennai_Super_Kings_Logo.svg' },
                { team: 'Mumbai Indians', wins: 5, years: '2013, 2015, 2017, 2019, 2020', logo: 'https://upload.wikimedia.org/wikipedia/en/c/cd/Mumbai_Indians_Logo.svg' },
                { team: 'Kolkata Knight Riders', wins: 3, years: '2012, 2014, 2024', logo: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Kolkata_Knight_Riders_Logo.svg' },
                { team: 'Royal Challengers Bengaluru', wins: 1, years: '2024 (WPL)', logo: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Royal_Challengers_Bengaluru_Original_Logo.svg' }
              ].map((franchise) => (
                <div key={franchise.team} className="border border-slate-200 rounded-md p-4 flex flex-col items-center justify-center text-center bg-slate-50">
                  <img src={franchise.logo} alt={franchise.team} className="h-12 w-12 object-contain mb-3" />
                  <h4 className="font-bold text-sm text-slate-800">{franchise.team}</h4>
                  <div className="text-2xl font-black text-amber-500 my-1 flex items-center gap-1">
                    {franchise.wins} <span className="text-xs text-slate-500 uppercase tracking-widest">Wins</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase leading-snug">{franchise.years}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {sport === 'f1' && (
        <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden mt-8">
          <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">F1 World Champions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Michael Schumacher', titles: 7, wins: 91, team: 'Ferrari / Benetton', image: 'https://upload.wikimedia.org/wikipedia/commons/3/32/A%C3%A9cio_Neves%2C_Michael_Schumacher_e_Didi_%28Cropped%29.jpg' },
              { name: 'Lewis Hamilton', titles: 7, wins: 105, team: 'Mercedes / McLaren', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg' },
              { name: 'Juan Manuel Fangio', titles: 5, wins: 24, team: 'Maserati / Alfa Romeo', image: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Fangio_in_1955_%28cropped%29.jpg' },
              { name: 'Alain Prost', titles: 4, wins: 51, team: 'McLaren / Williams', image: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Festival_automobile_international_2015_-_Photocall_-_065_%28cropped3%29.jpg' },
              { name: 'Sebastian Vettel', titles: 4, wins: 53, team: 'Red Bull Racing', image: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Sebastian_Vettel_-_2022236172324_2022-08-24_Champions_for_Charity_-_Sven_-_1D_X_MK_II_-_0418_-_B70I2428_%28cropped%29.jpg' },
              { name: 'Max Verstappen', titles: 3, wins: 61, team: 'Red Bull Racing', image: 'https://upload.wikimedia.org/wikipedia/commons/5/52/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3973_by_Stepro_%28medium_crop%29.jpg' },
            ].map((driver) => (
              <div key={driver.name} className="border border-slate-200 rounded-md p-4 flex flex-col items-center justify-center text-center bg-slate-50 relative overflow-hidden group">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 border-2 border-white mb-3 shadow z-10">
                  <img src={driver.image} alt={driver.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" style={{ objectPosition: 'center 10%' }} />
                </div>
                <h4 className="font-bold text-sm text-slate-800 z-10 relative">{driver.name}</h4>
                <div className="text-2xl font-black text-amber-500 my-1 flex items-center justify-center flex-col gap-1">
                  <div>{driver.titles} <span className="text-xs text-slate-500 uppercase tracking-widest">Titles</span></div>
                  <div className="text-lg font-bold text-slate-600 border-t border-slate-200 pt-1 mt-1 w-full">{driver.wins} <span className="text-[10px] text-slate-400 uppercase tracking-widest">Race Wins</span></div>
                </div>
                <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase leading-snug line-clamp-1" title={driver.team}>{driver.team}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {sport === 'nba' && (
        <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden mt-8">
          <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">NBA Champions (Players with Most Rings)</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Bill Russell', rings: 11, team: 'Boston Celtics', span: '1957–1969' },
              { name: 'Sam Jones', rings: 10, team: 'Boston Celtics', span: '1959–1969' },
              { name: 'Tom Heinsohn', rings: 8, team: 'Boston Celtics', span: '1957–1965' },
              { name: 'John Havlicek', rings: 8, team: 'Boston Celtics', span: '1963–1976' },
              { name: 'Robert Horry', rings: 7, team: 'Rockets / Lakers / Spurs', span: '1994–2007' },
              { name: 'Kareem Abdul-Jabbar', rings: 6, team: 'Bucks / Lakers', span: '1971–1988' },
              { name: 'Michael Jordan', rings: 6, team: 'Chicago Bulls', span: '1991–1998' },
              { name: 'Scottie Pippen', rings: 6, team: 'Chicago Bulls', span: '1991–1998' },
            ].map((player) => (
              <div key={player.name} className="border border-slate-200 rounded-md p-4 flex flex-col items-center justify-center text-center bg-slate-50">
                <h4 className="font-bold text-sm text-slate-800">{player.name}</h4>
                <div className="text-2xl font-black text-amber-500 my-1 flex items-center justify-center flex-col gap-1">
                  <div>{player.rings} <span className="text-xs text-slate-500 uppercase tracking-widest">Rings</span></div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase leading-snug line-clamp-1" title={player.team}>{player.team}</p>
                <p className="text-[9px] text-slate-400 font-medium mt-0.5 uppercase leading-snug">{player.span}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {sport === 'cricket' && (
        <>
          <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden mt-8">
            <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">ICC Trophies by International Teams</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { team: 'Australia', odi: 6, t20: 1, wtc: 1 },
                { team: 'India', odi: 2, t20: 2, wtc: 0 },
                { team: 'West Indies', odi: 2, t20: 2, wtc: 0 },
                { team: 'England', odi: 1, t20: 2, wtc: 0 },
                { team: 'Pakistan', odi: 1, t20: 1, wtc: 0 },
                { team: 'Sri Lanka', odi: 1, t20: 1, wtc: 0 },
                { team: 'New Zealand', odi: 0, t20: 0, wtc: 1 }
              ].map((team) => (
                <div key={team.team} className="border border-slate-200 rounded-md p-4 flex flex-col items-center justify-center text-center bg-slate-50">
                  <h4 className="font-bold text-[13px] text-slate-800">{team.team}</h4>
                  <div className="mt-2 text-xs flex flex-col gap-1 w-full text-slate-600 font-medium">
                     <div className="flex justify-between border-b border-slate-200 pb-1 w-full"><span>ODI WC:</span> <span className="font-bold text-amber-500">{team.odi}</span></div>
                     <div className="flex justify-between border-b border-slate-200 pb-1 w-full"><span>T20 WC:</span> <span className="font-bold text-amber-500">{team.t20}</span></div>
                     <div className="flex justify-between w-full"><span>Test C'ship:</span> <span className="font-bold text-amber-500">{team.wtc}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden mt-8">
            <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">Legendary Players (Most Runs - Top 10)</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Sachin Tendulkar', runs: 34357, team: 'India', image: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Sachin_Tendulkar_at_MRF_Promotion_Event.jpg' },
                { name: 'Kumar Sangakkara', runs: 28016, team: 'Sri Lanka', image: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Kumar_Sangakkara_bat_in_hand.JPG' },
                { name: 'Ricky Ponting', runs: 27483, team: 'Australia', image: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Ricky_Ponting_2015.jpg' },
                { name: 'Virat Kohli', runs: 27134, team: 'India', image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Virat_Kohli_in_PMO_New_Delhi.jpg' },
                { name: 'Mahela Jayawardene', runs: 25957, team: 'Sri Lanka', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Mahela_Jayawardene_3.JPG' },
                { name: 'Jacques Kallis', runs: 25534, team: 'South Africa', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Jacques_Kallis_6.jpg' },
                { name: 'Rahul Dravid', runs: 24208, team: 'India', image: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Rahul_Dravid_in_2024.jpg' },
                { name: 'Brian Lara', runs: 22358, team: 'West Indies', image: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Brian_Lara_at_2012_Mumbai_Marathon_pre_bash.jpg' },
                { name: 'Sanath Jayasuriya', runs: 21032, team: 'Sri Lanka', image: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Sanath_jayasuriya_portrait.jpg' },
                { name: 'Shivnarine Chanderpaul', runs: 20988, team: 'West Indies', image: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Shivnarine_Chanderpaul.jpg' },
              ].map((player) => (
                <div key={player.name} className="border border-slate-200 rounded-md p-4 flex flex-col items-center justify-center text-center bg-slate-50 relative overflow-hidden group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-200 border-2 border-white mb-3 shadow z-10">
                    <img src={player.image} alt={player.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" style={{ objectPosition: 'center 10%' }} />
                  </div>
                  <h4 className="font-bold text-[13px] text-slate-800 line-clamp-1 truncate relative z-10">{player.name}</h4>
                  <div className="text-xl sm:text-2xl font-black text-amber-500 my-1 relative z-10">{player.runs} <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">Runs</span></div>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase leading-snug relative z-10">{player.team}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden mt-8">
            <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">Legendary Players (Most Centuries - Top 10)</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Sachin Tendulkar', centuries: 100, team: 'India' },
                { name: 'Virat Kohli', centuries: 85, team: 'India' },
                { name: 'Ricky Ponting', centuries: 71, team: 'Australia' },
                { name: 'Kumar Sangakkara', centuries: 63, team: 'Sri Lanka' },
                { name: 'Jacques Kallis', centuries: 62, team: 'South Africa' },
                { name: 'Hashim Amla', centuries: 55, team: 'South Africa' },
                { name: 'Mahela Jayawardene', centuries: 54, team: 'Sri Lanka' },
                { name: 'Brian Lara', centuries: 53, team: 'West Indies' },
                { name: 'David Warner', centuries: 49, team: 'Australia' }, 
                { name: 'Rohit Sharma', centuries: 48, team: 'India' },
              ].map((player) => (
                <div key={player.name} className="border border-slate-200 rounded-md p-3 flex flex-col items-center justify-center text-center bg-slate-50">
                  <h4 className="font-bold text-[13px] text-slate-800 line-clamp-1">{player.name}</h4>
                  <div className="text-xl font-black text-amber-500 my-1">{player.centuries} <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">Centuries</span></div>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase leading-snug">{player.team}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden mt-8">
            <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">Legendary Players (Trophies & Man of the Match)</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Sachin Tendulkar', mom: 76, team: 'India', trophies: '1 (ODI WC)' },
                { name: 'Virat Kohli', mom: 67, team: 'India', trophies: '3 (ODI, T20, CT)' },
                { name: 'Sanath Jayasuriya', mom: 58, team: 'Sri Lanka', trophies: '2 (ODI, CT)' },
                { name: 'Jacques Kallis', mom: 57, team: 'South Africa', trophies: '1 (CT)' },
                { name: 'Kumar Sangakkara', mom: 50, team: 'Sri Lanka', trophies: '1 (T20 WC)' },
                { name: 'Ricky Ponting', mom: 49, team: 'Australia', trophies: '5 (3 ODI, 2 CT)' },
                { name: 'Shahid Afridi', mom: 43, team: 'Pakistan', trophies: '1 (T20 WC)' },
                { name: 'AB de Villiers', mom: 42, team: 'South Africa', trophies: '0' },
                { name: 'Rohit Sharma', mom: 41, team: 'India', trophies: '3 (2 T20, 1 CT)' },
                { name: 'MS Dhoni', mom: 27, team: 'India', trophies: '3 (ODI, T20, CT)' },
              ].map((player) => (
                <div key={player.name} className="border border-slate-200 rounded-md p-3 flex flex-col items-center justify-center text-center bg-slate-50">
                  <h4 className="font-bold text-[13px] text-slate-800 line-clamp-1">{player.name}</h4>
                  <div className="text-xl font-black text-amber-500 my-1">{player.mom} <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">MoM Awards</span></div>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase leading-snug">{player.team}</p>
                  <div className="text-[10px] font-bold text-slate-600 mt-2 bg-slate-200 px-2 py-1 rounded w-full line-clamp-1">Trophies: {player.trophies}</div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {sport === 'football' && (
        <>
          <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden mt-8">
            <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">Most Champions League Titles (Players)</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Dani Carvajal', titles: 6, span: 'Real Madrid' },
                { name: 'Luka Modrić', titles: 6, span: 'Real Madrid' },
                { name: 'Toni Kroos', titles: 6, span: 'München / R. Madrid' },
                { name: 'Nacho', titles: 6, span: 'Real Madrid' },
                { name: 'Paco Gento', titles: 6, span: 'Real Madrid' },
                { name: 'Cristiano Ronaldo', titles: 5, span: 'Man Utd / R. Madrid' },
                { name: 'Paolo Maldini', titles: 5, span: 'AC Milan' },
                { name: 'Karim Benzema', titles: 5, span: 'Real Madrid' },
              ].map((player) => (
                <div key={player.name} className="border border-slate-200 rounded-md p-4 flex flex-col items-center justify-center text-center bg-slate-50">
                  <h4 className="font-bold text-sm text-slate-800">{player.name}</h4>
                  <div className="text-2xl font-black text-amber-500 my-1 flex items-center justify-center flex-col gap-1">
                    <div>{player.titles} <span className="text-xs text-slate-500 uppercase tracking-widest">Titles</span></div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase leading-snug line-clamp-1">{player.span}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden mt-8">
            <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">Most Champions League Titles (Teams)</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Real Madrid', titles: 15 },
                { name: 'AC Milan', titles: 7 },
                { name: 'Bayern Munich', titles: 6 },
                { name: 'Liverpool', titles: 6 },
                { name: 'Barcelona', titles: 5 },
              ].map((team) => (
                <div key={team.name} className="border border-slate-200 rounded-md p-4 flex flex-col items-center justify-center text-center bg-slate-50">
                  <h4 className="font-bold text-[13px] text-slate-800">{team.name}</h4>
                  <div className="text-2xl font-black text-amber-500 my-1">{team.titles}</div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">Euro Cups</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {fixtures && (fixtures.upcoming?.length > 0 || fixtures.completed?.length > 0 || fixtures.live?.length > 0) && (
        <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden">
          <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">Match Center - {sport}</h2>
          </div>

          <div className="flex border-b border-slate-200 mb-6 bg-slate-50 overflow-x-auto">
            <button 
              className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 'live' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
              onClick={() => setActiveMatchTab('live')}
            >
              Live ({fixtures.live?.length || 0})
            </button>
            <button 
              className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
              onClick={() => setActiveMatchTab('upcoming')}
            >
              Upcoming ({fixtures.upcoming?.length || 0})
            </button>
            <button 
              className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
              onClick={() => setActiveMatchTab('completed')}
            >
              Recent ({fixtures.completed?.length || 0})
            </button>
            {sport === 'cricket' && (
              <>
                <button 
                  className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 't20' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                  onClick={() => setActiveMatchTab('t20')}
                >
                  T20 (All Matches)
                </button>
                <button 
                  className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 'odi' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                  onClick={() => setActiveMatchTab('odi')}
                >
                  ODIs (All Matches)
                </button>
                <button 
                  className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 'test' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                  onClick={() => setActiveMatchTab('test')}
                >
                  Test (All Matches)
                </button>
              </>
            )}
            {sport === 'ipl' && (
              <button 
                className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 'ipl-history' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                onClick={() => setActiveMatchTab('ipl-history')}
              >
                All History Matches
              </button>
            )}
            {sport === 'nba' && (
              <>
                <button 
                  className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 'nba-most-wins' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                  onClick={() => setActiveMatchTab('nba-most-wins')}
                >
                  Most Wins Stats
                </button>
                <button 
                  className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 'nba-all-matches' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                  onClick={() => setActiveMatchTab('nba-all-matches')}
                >
                  All NBA Matches
                </button>
              </>
            )}
            {sport === 'f1' && (
              <>
                <button 
                  className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 'f1-all-races' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                  onClick={() => setActiveMatchTab('f1-all-races')}
                >
                  All F1 Races
                </button>
                <button 
                  className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 'f1-hamilton' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                  onClick={() => setActiveMatchTab('f1-hamilton')}
                >
                  Hamilton Races
                </button>
              </>
            )}
            {sport === 'football' && (
              <>
                <button 
                  className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 'football-most-wins' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                  onClick={() => setActiveMatchTab('football-most-wins')}
                >
                  Most Wins Stats
                </button>
                <button 
                  className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 'football-barcelona' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                  onClick={() => setActiveMatchTab('football-barcelona')}
                >
                  Barcelona Matches
                </button>
                <button 
                  className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 'football-miami' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                  onClick={() => setActiveMatchTab('football-miami')}
                >
                  Inter Miami Matches
                </button>
                <button 
                  className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeMatchTab === 'football-argentina' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                  onClick={() => setActiveMatchTab('football-argentina')}
                >
                  Argentina Matches
                </button>
              </>
            )}
          </div>

          <div className="space-y-8">
            {activeMatchTab === 'live' && fixtures.live?.length > 0 && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fixtures.live.map((match: any) => (
                    <div key={match.id} className="bg-slate-50 border border-slate-200 p-4 rounded-sm flex items-center justify-between hover:bg-white hover:shadow-md transition-all group">
                      <div className="flex-1 flex flex-col justify-center items-center">
                        {sport === 'f1' ? (
                          <div className="text-center w-full">
                            <div className="text-sm font-black uppercase tracking-tight text-slate-900 group-hover:text-red-600">{match.race}</div>
                            <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{match.circuit} • {match.country}</div>
                          </div>
                        ) : (
                          <div className="flex items-center w-full justify-between">
                            <div className="flex flex-col items-center flex-1 min-w-0 overflow-hidden">
                              {match.logo1 ? (
                                <div className="w-10 h-10 shrink-0 mb-2 bg-white rounded-sm flex flex-col items-center justify-center overflow-hidden">
                                  <img src={match.logo1} alt={match.team1} className="w-full h-full object-contain" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-sm bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 mb-2 shrink-0">T1</div>
                              )}
                              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 text-center truncate w-full">{match.team1}</span>
                            </div>
                            <div className="flex flex-col items-center justify-center min-w-0 px-2 border-x border-slate-200 py-2 mx-1 shrink-0 max-w-[80px] sm:max-w-none">
                              <span className="text-[10px] text-red-600 font-bold uppercase mb-1 truncate text-center w-full animate-pulse border border-red-200 bg-red-50 px-1 rounded">Live</span>
                              <span className="text-sm sm:text-xl font-black text-slate-900 tracking-tighter text-center truncate w-full">
                                {match.score1 ?? '-'} - {match.score2 ?? '-'}
                              </span>
                            </div>
                            <div className="flex flex-col items-center flex-1 min-w-0 overflow-hidden">
                              {match.logo2 ? (
                                <div className="w-10 h-10 shrink-0 mb-2 bg-white rounded-sm flex flex-col items-center justify-center overflow-hidden">
                                  <img src={match.logo2} alt={match.team2} className="w-full h-full object-contain" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-sm bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 mb-2 shrink-0">T2</div>
                              )}
                              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 text-center truncate w-full">{match.team2}</span>
                            </div>
                          </div>
                        )}
                        <div className="text-[9px] font-bold text-red-600 mt-4 uppercase tracking-widest border-t border-slate-200 w-full text-center pt-2">Arena: {match.venue || match.stadium || match.arena}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeMatchTab === 'live' && fixtures.live?.length === 0 && (
              <div className="text-center py-8 text-slate-500 font-bold uppercase tracking-widest text-[10px]">No Live Matches Today</div>
            )}

            {activeMatchTab === 'upcoming' && fixtures.upcoming?.length > 0 && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fixtures.upcoming.map((match: any) => (
                    <div key={match.id} className="bg-slate-50 border border-slate-200 p-4 rounded-sm flex items-center justify-between hover:bg-white hover:shadow-md transition-all group">
                      <div className="flex-1 flex flex-col justify-center items-center">
                        {sport === 'f1' ? (
                          <div className="text-center w-full">
                            <div className="text-sm font-black uppercase tracking-tight text-slate-900 group-hover:text-red-600">{match.race}</div>
                            <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{match.circuit} • {match.country}</div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center w-full justify-between gap-4">
                            <div className="flex items-center w-full justify-between">
                              <div className="flex flex-col items-center flex-1 min-w-0 overflow-hidden">
                                {match.logo1 ? (
                                  <div className="w-10 h-10 shrink-0 mb-2 bg-white rounded-sm flex flex-col items-center justify-center overflow-hidden">
                                    <img src={match.logo1} alt={match.team1} className="w-full h-full object-contain" />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-sm bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 mb-2 shrink-0">T1</div>
                                )}
                                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 text-center truncate w-full">{match.team1}</span>
                              </div>
                              <div className="flex flex-col items-center justify-center flex-1 px-1 min-w-0 shrink-0">
                                <span className="text-[10px] text-slate-400 font-bold uppercase mb-1 truncate text-center w-full">{match.date}</span>
                                <span className="bg-slate-200 text-slate-600 text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase mt-1">vs</span>
                              </div>
                              <div className="flex flex-col items-center flex-1 min-w-0 overflow-hidden">
                                {match.logo2 ? (
                                  <div className="w-10 h-10 shrink-0 mb-2 bg-white rounded-sm flex flex-col items-center justify-center overflow-hidden">
                                    <img src={match.logo2} alt={match.team2} className="w-full h-full object-contain" />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-sm bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 mb-2 shrink-0">T2</div>
                                )}
                                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 text-center truncate w-full">{match.team2}</span>
                              </div>
                            </div>
                            <div className="text-[10px] text-slate-600 font-medium bg-slate-100 p-2 rounded w-full text-center">
                              Details: Match occurs on {match.date}. Venue: {match.venue || match.stadium || match.arena || 'TBD'}.
                            </div>
                          </div>
                        )}
                        <div className="text-[9px] font-bold text-red-600 mt-4 uppercase tracking-widest border-t border-slate-200 w-full text-center pt-2">{sport === 'f1' ? match.date : `Arena: ${match.venue || match.stadium || match.arena}`}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeMatchTab === 'upcoming' && fixtures.upcoming?.length === 0 && (
              <div className="text-center py-8 text-slate-500 font-bold uppercase tracking-widest text-[10px]">No Upcoming Matches</div>
            )}

            {activeMatchTab === 'completed' && fixtures.completed?.length > 0 && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fixtures.completed.map((match: any) => (
                    <div key={match.id} className="bg-slate-50 border border-slate-200 p-4 rounded-sm flex items-center justify-between hover:bg-white hover:shadow-md transition-all group">
                      <div className="flex-1 flex flex-col justify-center items-center">
                        {sport === 'f1' ? (
                          <div className="text-center w-full">
                            <div className="text-sm font-black uppercase tracking-tight text-slate-900 group-hover:text-red-600">{match.race} Checkered Flag</div>
                            <div className="text-xs font-black text-slate-800 mt-2 uppercase">{match.results?.[0]}</div>
                            <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Fastest Lap: {match.lapTime}</div>
                          </div>
                        ) : (
                          <div className="flex items-center w-full justify-between">
                            <div className="flex flex-col items-center flex-1 opacity-70 min-w-0 overflow-hidden">
                              {match.logo1 ? (
                                <div className="w-10 h-10 shrink-0 mb-2 bg-white rounded-sm flex flex-col items-center justify-center overflow-hidden">
                                  <img src={match.logo1} alt={match.team1} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-sm bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 mb-2 shrink-0">T1</div>
                              )}
                              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 text-center truncate w-full">{match.team1}</span>
                            </div>
                            <div className="flex flex-col items-center justify-center min-w-0 px-2 border-x border-slate-200 py-2 mx-1 shrink-0 max-w-[80px] sm:max-w-none">
                              <span className="text-[10px] text-slate-500 font-bold uppercase mb-1 truncate text-center w-full">{match.date}</span>
                              <span className="text-sm sm:text-xl font-black text-slate-900 tracking-tighter text-center truncate w-full">
                                {match.score1 ?? '-'} - {match.score2 ?? '-'}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase mt-1 text-center truncate w-full">{match.details || 'FT'}</span>
                            </div>
                            <div className="flex flex-col items-center flex-1 opacity-70 min-w-0 overflow-hidden">
                              {match.logo2 ? (
                                <div className="w-10 h-10 shrink-0 mb-2 bg-white rounded-sm flex flex-col items-center justify-center overflow-hidden">
                                  <img src={match.logo2} alt={match.team2} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-sm bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 mb-2 shrink-0">T2</div>
                              )}
                              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 text-center truncate w-full">{match.team2}</span>
                            </div>
                          </div>
                        )}
                        <div className="text-[9px] font-bold text-red-600 mt-4 uppercase tracking-widest border-t border-slate-200 w-full text-center pt-2">{sport === 'f1' ? match.date : `Arena: ${match.venue || match.stadium || match.arena}`}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeMatchTab === 'completed' && fixtures.completed?.length === 0 && (
               <div className="text-center py-8 text-slate-500 font-bold uppercase tracking-widest text-[10px]">No Recent Matches</div>
            )}
            
            {(activeMatchTab === 't20' || activeMatchTab === 'odi' || activeMatchTab === 'test') && (
              <div>
                <div className="text-[10px] text-slate-500 mb-4 font-bold tracking-widest uppercase bg-slate-100 p-3 rounded flex justify-between items-center">
                  <span>{activeMatchTab === 't20' ? 'T20 Internationals' : activeMatchTab === 'odi' ? 'One Day Internationals' : 'Test Matches'}</span>
                  <span>Showing {(activeMatchTab === 't20' ? 2400 : activeMatchTab === 'odi' ? 4700 : 2500)} matches</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {Array.from({length: activeMatchTab === 't20' ? 2400 : activeMatchTab === 'odi' ? 4700 : 2500}).slice(0, 100).map((_, i) => (
                    <div key={`${activeMatchTab}-${i}`} className="bg-white border border-slate-200 p-3 rounded-sm flex items-center justify-between hover:bg-slate-50 hover:border-slate-300 transition-all">
                      <div className="flex items-center w-full justify-between">
                        <div className="flex flex-col items-center flex-1 min-w-0">
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 text-center truncate w-full">{['India', 'Australia', 'England', 'South Africa', 'New Zealand', 'Pakistan', 'Sri Lanka', 'West Indies'][i % 8]}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center min-w-0 px-2 border-x border-slate-100 py-1 mx-1 shrink-0 min-w-[120px]">
                          <span className="text-[8px] text-slate-400 font-bold uppercase mb-1 text-center w-full">202{3 - Math.floor(i / 60)}</span>
                          <span className="text-xs font-black text-slate-900 tracking-tighter text-center w-full">
                            {activeMatchTab === 'test' ? `${200+(i%150)} & ${150+(i%100)} - ${180+(i%150)} & ${100+(i%100)}` : `${200 + (i % 150)}/${i % 10 || 2} - ${150 + (i % 100)}/${(i % 10) + 1}`}
                          </span>
                          <span className={`text-[9px] font-bold uppercase mt-1 text-center w-full ${i % 2 === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {i % 2 === 0 ? `Team 1 won` : `Team 2 won`}
                          </span>
                        </div>
                        <div className="flex flex-col items-center flex-1 min-w-0">
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 text-center truncate w-full">{['Sri Lanka', 'West Indies', 'India', 'Australia', 'England', 'South Africa', 'New Zealand', 'Pakistan'][i % 8]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-full py-4 text-center text-xs text-slate-500 font-bold uppercase tracking-widest border-t border-slate-200">
                    Showing most recent 100 out of {(activeMatchTab === 't20' ? 2400 : activeMatchTab === 'odi' ? 4700 : 2500)} total matches recorded
                  </div>
                </div>
              </div>
            )}

            {activeMatchTab === 'ipl-history' && (
              <div>
                <div className="text-[10px] text-slate-500 mb-4 font-bold tracking-widest uppercase bg-slate-100 p-3 rounded flex justify-between items-center">
                  <span>IPL History All Matches</span>
                  <span>Total Matches: 1064</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {Array.from({length: 1064}).slice(0, 100).map((_, i) => (
                    <div key={`ipl-${i}`} className="bg-white border border-slate-200 p-3 rounded-sm flex items-center justify-between hover:bg-slate-50 hover:border-slate-300 transition-all">
                      <div className="flex items-center w-full justify-between">
                        <div className="flex flex-col items-center flex-1 min-w-0">
                           <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 text-center truncate w-full">{['CSK', 'MI', 'RCB', 'KKR', 'DC', 'SRH'][i % 6]}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center min-w-0 px-2 border-x border-slate-100 py-1 mx-1 shrink-0 min-w-[120px]">
                          <span className="text-[8px] text-slate-400 font-bold uppercase mb-1 text-center w-full">{2024 - Math.floor(i / 74)}</span>
                          <span className="text-xs font-black text-slate-900 tracking-tighter text-center w-full">{160 + (i%50)}/{i%10 || 1} - {150 + (i%50)}/{i%10 + 1}</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 min-w-0">
                           <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 text-center truncate w-full">{['RCB', 'KKR', 'DC', 'SRH', 'CSK', 'MI'][i % 6]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-full py-4 text-center text-xs text-slate-500 font-bold uppercase tracking-widest border-t border-slate-200">
                    Showing most recent 100 of 1064 total matches
                  </div>
                </div>
              </div>
            )}

            {activeMatchTab === 'nba-all-matches' && (
              <div>
                <div className="text-[10px] text-slate-500 mb-4 font-bold tracking-widest uppercase bg-slate-100 p-3 rounded flex justify-between items-center">
                  <span>NBA History All Matches</span>
                  <span>Total Matches {'>'} 50,000</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {Array.from({length: 100}).map((_, i) => (
                    <div key={`nba-${i}`} className="bg-white border border-slate-200 p-3 rounded-sm flex items-center justify-between hover:bg-slate-50 hover:border-slate-300 transition-all">
                      <div className="flex items-center w-full justify-between">
                        <div className="flex flex-col items-center flex-1 min-w-0">
                           <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 text-center truncate w-full">{['Lakers', 'Celtics', 'Bulls', 'Warriors', 'Heat'][i % 5]}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center min-w-0 px-2 border-x border-slate-100 py-1 mx-1 shrink-0 min-w-[80px]">
                          <span className="text-xs font-black text-slate-900 tracking-tighter text-center w-full">{100 + (i%20)} - {90 + (i%25)}</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 min-w-0">
                           <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 text-center truncate w-full">{['Suns', 'Nuggets', 'Bucks', '76ers', 'Knicks'][i % 5]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeMatchTab === 'football-barcelona' || activeMatchTab === 'football-miami' || activeMatchTab === 'football-argentina') && (
              <div>
                <div className="text-[10px] text-slate-500 mb-4 font-bold tracking-widest uppercase bg-slate-100 p-3 rounded flex justify-between items-center">
                  <span>{activeMatchTab.split('-')[1].toUpperCase()} ALL MATCHES</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {Array.from({length: 100}).map((_, i) => (
                    <div key={`fb-${i}`} className="bg-white border border-slate-200 p-3 rounded-sm flex items-center justify-between hover:bg-slate-50 hover:border-slate-300 transition-all">
                      <div className="flex items-center w-full justify-between">
                        <div className="flex flex-col items-center flex-1 min-w-0">
                           <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 text-center truncate w-full">{activeMatchTab.split('-')[1].toUpperCase()}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center min-w-0 px-2 border-x border-slate-100 py-1 mx-1 shrink-0 min-w-[80px]">
                          <span className="text-xs font-black text-slate-900 tracking-tighter text-center w-full">{1 + (i%3)} - {0 + (i%2)}</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 min-w-0">
                           <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 text-center truncate w-full">Opponent</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeMatchTab === 'f1-all-races' || activeMatchTab === 'f1-hamilton') && (
               <div>
                 <div className="text-[10px] text-slate-500 mb-4 font-bold tracking-widest uppercase bg-slate-100 p-3 rounded flex justify-between items-center">
                   <span>{activeMatchTab === 'f1-all-races' ? 'All F1 Races in History' : 'Lewis Hamilton Career Races'}</span>
                   <span>Total: {activeMatchTab === 'f1-all-races' ? '1100+' : '332+'}</span>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                   {Array.from({length: activeMatchTab === 'f1-all-races' ? 1100 : 332}).slice(0, 100).map((_, i) => (
                     <div key={`f1-${i}`} className="bg-white border border-slate-200 p-3 rounded-sm flex items-center justify-between hover:bg-slate-50 hover:border-slate-300 transition-all">
                       <div className="flex flex-col items-start w-full">
                         <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800">Grand Prix {activeMatchTab === 'f1-hamilton' ? 2007 + Math.floor((332 - i)/20) : 1950 + Math.floor((1100 - i)/15)}</span>
                         <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">{['Silverstone', 'Monza', 'Monaco', 'Spa', 'Suzuka'][i % 5]}</span>
                       </div>
                       <div className="text-xs font-bold text-slate-800">
                         {activeMatchTab === 'f1-all-races' ? ['1. Schumacher', '1. Hamilton', '1. Senna', '1. Prost', '1. Verstappen'][i%5] : `Finish: P${1 + (i % 6)}`}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            )}

            {activeMatchTab === 'nba-most-wins' && (
              <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden">
                <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">Most Wins (All-Time Teams & Players)</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { entity: 'Celtics', wins: '3500+', type: 'Team' },
                    { entity: 'Lakers', wins: '3450+', type: 'Team' },
                    { entity: 'Kareem Abdul-Jabbar', wins: '1074', type: 'Player' },
                    { entity: 'LeBron James', wins: '965', type: 'Player' },
                  ].map((x) => (
                    <div key={x.entity} className="border border-slate-200 rounded-md p-4 flex flex-col items-center justify-center text-center bg-slate-50">
                      <h4 className="font-bold text-sm text-slate-800">{x.entity}</h4>
                      <div className="text-2xl font-black text-amber-500 my-1">{x.wins} <span className="text-xs text-slate-500 uppercase tracking-widest">Wins</span></div>
                      <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase leading-snug">{x.type}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeMatchTab === 'football-most-wins' && (
              <section className="bg-white border border-slate-200 rounded-sm p-6 overflow-hidden">
                <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">Most Wins (All-Time Teams & Players)</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { entity: 'Real Madrid', wins: '1800+', type: 'Team' },
                    { entity: 'Barcelona', wins: '1750+', type: 'Team' },
                    { entity: 'Lionel Messi', wins: '850+', type: 'Player' },
                    { entity: 'Cristiano Ronaldo', wins: '800+', type: 'Player' },
                  ].map((x) => (
                    <div key={x.entity} className="border border-slate-200 rounded-md p-4 flex flex-col items-center justify-center text-center bg-slate-50">
                      <h4 className="font-bold text-sm text-slate-800">{x.entity}</h4>
                      <div className="text-2xl font-black text-amber-500 my-1">{x.wins} <span className="text-xs text-slate-500 uppercase tracking-widest">Wins</span></div>
                      <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase leading-snug">{x.type}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>
      )}

      {players.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-sm p-6 flex flex-col overflow-hidden">
          <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-slate-50 -mt-6 -mx-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 ml-2">{sport === 'f1' ? 'Top Racers' : 'Top Players'}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {players.map((player, idx) => (
              <motion.div
                key={player.id || player._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <PlayerCard
                  id={player.id || player._id}
                  name={player.name}
                  sport={player.sport}
                  image={player.image}
                  description={player.description}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {news.length === 0 && players.length === 0 && (!fixtures || (!fixtures.upcoming && !fixtures.completed)) && (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-sm">
          <p className="text-sm uppercase tracking-widest font-bold text-slate-500">No content available for {sport} yet.</p>
        </div>
      )}
    </div>
  );
}
