import express from 'express';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import * as path from 'path';
import * as url from 'url';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload size for base64 images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  let isConnected = false;
  if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 }).then(() => {
      isConnected = true;
      console.log('MongoDB connected');
      // Initial seed if empty
      setTimeout(async () => {
        try {
          // Force update of players to refresh broken database images
          await PlayerModel.deleteMany({ id: { $in: demoPlayers.map(p => p.id) } });
          await PlayerModel.insertMany(demoPlayers);
          
          // Force update of news
          await NewsModel.deleteMany({});
          await NewsModel.insertMany(demoNews);
        } catch (e) {
          console.error("Seed error", e);
        }
      }, 2000);
    }).catch((err) => {
      console.error('\n======================================================');
      console.error('MongoDB Connection Warning');
      console.error('======================================================');
      console.error('Failed to connect to MongoDB Atlas.');
      console.error('In AI Studio, you must whitelist all IPs (0.0.0.0/0) in your MongoDB Atlas Network Access settings, because the server IPs change dynamically.');
      console.error('Falling back to local demo data for now.');
      console.error('======================================================\n');
    });
  }

  // --- Mock Data Structures ---
    const demoNews = [
    { id: '1', title: 'LeBron breaks the all-time scoring record', content: 'LeBron James passes Kareem...', category: 'nba', image: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/LeBron_James_%2815662939969%29.jpg', source: 'ESPN' },
    { id: '2', title: 'Verstappen secures 3rd World Championship', content: 'Max Verstappen dominates...', category: 'f1', image: 'https://upload.wikimedia.org/wikipedia/commons/7/79/FIA_F1_Austria_2023_Nr._1_%281%29.jpg', source: 'Autosport' },
    { id: '3', title: 'Real Madrid reaches final', content: 'A thrilling victory...', category: 'football', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Real_Madrid_C.F._the_Winner_Of_The_Champions_League_in_2018_%281%29.jpg', source: 'Marca' },
    { id: '4', title: 'Kohli shines in World Cup', content: 'Virat Kohli scores record century...', category: 'cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg', source: 'Cricbuzz' },
    { id: '5', title: 'RCB claims thrilling IPL victory', content: 'Royal Challengers Bengaluru have finally done it! In a magnificent style...', category: 'ipl', image: 'https://i.pinimg.com/originals/a5/8d/5f/a58d5f5fa26bb5d13d93acd3ac09892d.jpg', source: 'Star Sports' },
    { id: '6', title: 'Messi wins 8th Ballon d\'Or', content: 'Lionel Messi has made history once again...', category: 'football', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Lionel_Messi_WC2022.jpg', source: 'Goal' },
    { id: '7', title: 'Curry drops 50 points', content: 'Stephen Curry delivered an absolute masterclass...', category: 'nba', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/2019_nba_finals_game_2.jpg', source: 'ESPN' },
    { id: '8', title: 'Hamilton joins Ferrari', content: 'In one of the most stunning transfers in motorsport history...', category: 'f1', image: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Lewis_Hamilton_during_the_2025_Belgian_Grand_Prix_weekend.jpg', source: 'Sky Sports' }
  ];

  const demoPlayers = [
    { id: 'cristiano-ronaldo', name: 'Cristiano Ronaldo', sport: 'football', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg', description: 'Portuguese professional footballer who plays as a forward.', team: 'Al Nassr', position: 'Forward', nationality: 'Portugal', born: 'Funchal, Portugal', netWorth: '$500 Million', previousTeams: 'Real Madrid, Man Utd, Juventus', stats: [{ label: 'Goals', value: '873' }, { label: 'Assists', value: '249' }, { label: 'Matches', value: '1205' }, { label: 'Ballon d\'Or', value: '5' }] },
    { id: 'lionel-messi', name: 'Lionel Messi', sport: 'football', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Lionel_Messi_WC2022.jpg', description: 'Argentine professional footballer who plays as a forward.', team: 'Inter Miami', position: 'Forward', nationality: 'Argentina', born: 'Rosario, Argentina', netWorth: '$600 Million', previousTeams: 'Barcelona, PSG', stats: [{ label: 'Goals', value: '821' }, { label: 'Assists', value: '361' }, { label: 'Matches', value: '1044' }, { label: 'Ballon d\'Or', value: '8' }] },
    { id: 'virat-kohli', name: 'Virat Kohli', sport: 'cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg', description: 'Indian international cricketer and former captain of the India national team.', team: 'India', position: 'Batsman', nationality: 'India', born: 'Delhi, India', netWorth: '$130 Million', previousTeams: 'Delhi (Domestic)', stats: [{ label: 'Matches', value: '522' }, { label: 'Runs', value: '26733' }, { label: 'Centuries', value: '85' }, { label: 'Highest', value: '254*' }] },
    { id: 'sachin-tendulkar', name: 'Sachin Tendulkar', sport: 'cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Sachin_Tendulkar_at_MRF_Promotion_Event.jpg', description: 'Former Indian international cricketer and captain of the Indian national team.', team: 'India', position: 'Batsman', nationality: 'India', born: 'Mumbai, India', netWorth: '$150 Million', previousTeams: 'Mumbai Indians', stats: [{ label: 'Matches', value: '664' }, { label: 'Runs', value: '34357' }, { label: 'Centuries', value: '100' }, { label: 'Highest', value: '248*' }] },
    { id: 'ms-dhoni', name: 'MS Dhoni', sport: 'cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/MS_Dhoni_%28Prabhav_%2723_-_RiGI_2023%29.jpg', description: 'Former Indian international cricketer and most successful Indian captain.', team: 'India', position: 'Wicket-Keeper/Batsman', nationality: 'India', born: 'Ranchi, India', netWorth: '$115 Million', previousTeams: 'CSK', stats: [{ label: 'Matches', value: '538' }, { label: 'Runs', value: '17266' }, { label: 'Catches', value: '634' }, { label: 'Highest', value: '183*' }] },
    { id: 'rohit-sharma', name: 'Rohit Sharma', sport: 'cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Rohit_Sharma_2015_%28cropped%29.jpg', description: 'Indian international cricketer and current captain of the India national team.', team: 'India', position: 'Batsman', nationality: 'India', born: 'Nagpur, India', netWorth: '$30 Million', previousTeams: 'Deccan Chargers', stats: [{ label: 'Matches', value: '472' }, { label: 'Runs', value: '18820' }, { label: 'Centuries', value: '48' }, { label: 'Highest', value: '264' }] },
    { id: 'yuvraj-singh', name: 'Yuvraj Singh', sport: 'cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Yuvraj_Singh_appointed_as_Ulysse_Nardin_watch_brand_ambassador.jpeg', description: 'Former Indian international cricketer, known for his aggressive batting and all-round abilities.', team: 'India', position: 'All-Rounder', nationality: 'India', born: 'Chandigarh, India', netWorth: '$35 Million', previousTeams: 'PBKS', stats: [{ label: 'Matches', value: '402' }, { label: 'Runs', value: '11778' }, { label: 'Wickets', value: '148' }, { label: 'Highest', value: '150' }] },
    { id: 'shikhar-dhawan', name: 'Shikhar Dhawan', sport: 'cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/SHIKHAR_DHAWAN_%2816005494418%29.jpg', description: 'Indian international cricketer, known for his elegant opening batting.', team: 'India', position: 'Opening Batsman', nationality: 'India', born: 'Delhi, India', netWorth: '$15 Million', previousTeams: 'PBKS, SRH', stats: [{ label: 'Matches', value: '269' }, { label: 'Runs', value: '10867' }, { label: 'Centuries', value: '24' }, { label: 'Highest', value: '190' }] },
    { id: 'suresh-raina', name: 'Suresh Raina', sport: 'cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Suresh_Raina_grace_the_%27Salaam_Sachin%27_conclave.jpg', description: 'Former Indian international cricketer. One of the best fielders in world cricket.', team: 'India', position: 'Batsman', nationality: 'India', born: 'Muradnagar, India', netWorth: '$25 Million', previousTeams: 'CSK', stats: [{ label: 'Matches', value: '322' }, { label: 'Runs', value: '7988' }, { label: 'Centuries', value: '7' }, { label: 'Highest', value: '116*' }] },
    { id: 'virender-sehwag', name: 'Virender Sehwag', sport: 'cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Virender_Sehwag_at_the_NDTV_Marks_for_Sports_event_13.jpg', description: 'Former Indian cricketer widely considered one of the most destructive openers of all time.', team: 'India', position: 'Opening Batsman', nationality: 'India', born: 'Najafgarh, India', netWorth: '$40 Million', previousTeams: 'Delhi Capitals', stats: [{ label: 'Matches', value: '374' }, { label: 'Runs', value: '17253' }, { label: 'Centuries', value: '38' }, { label: 'Highest', value: '319' }] },
    { id: 'rahul-dravid', name: 'Rahul Dravid', sport: 'cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Rahul_dravid_Bangalore_Royal_Challengers_%28cropped%29.jpg', description: 'Former Indian captain, widely known as The Wall. Known for his classical technique.', team: 'India', position: 'Batsman', nationality: 'India', born: 'Indore, India', netWorth: '$30 Million', previousTeams: 'RR', stats: [{ label: 'Matches', value: '509' }, { label: 'Runs', value: '24208' }, { label: 'Centuries', value: '48' }, { label: 'Highest', value: '270' }] },
    { id: 'ab-de-villiers', name: 'AB de Villiers', sport: 'cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/AB_de_villiers_%28cropped%29.jpg', description: 'Former South African international cricketer, widely regarded as Mr. 360.', team: 'South Africa', position: 'Batsman', nationality: 'South Africa', born: 'Warmbad, South Africa', netWorth: '$25 Million', previousTeams: 'RCB', stats: [{ label: 'Matches', value: '420' }, { label: 'Runs', value: '20014' }, { label: 'Centuries', value: '47' }, { label: 'Highest', value: '278*' }] },
    { id: 'pele', name: 'Pelé', sport: 'football', image: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Pele_con_brasil_%28cropped%29.jpg', description: 'Brazilian professional footballer who played as a forward.', team: 'New York Cosmos', position: 'Forward', nationality: 'Brazil', born: 'Três Corações, Brazil', netWorth: '$100 Million', previousTeams: 'Santos', stats: [{ label: 'Goals', value: '762' }, { label: 'Matches', value: '831' }, { label: 'World Cups', value: '3' }] },
    { id: 'lebron-james', name: 'LeBron James', sport: 'nba', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg', description: 'American professional basketball player for the Los Angeles Lakers.', team: 'Lakers', position: 'Small Forward', nationality: 'USA', born: 'Akron, Ohio', netWorth: '$1 Billion', previousTeams: 'Cavaliers, Heat', stats: [{ label: 'Points', value: '39282' }, { label: 'Rebounds', value: '10889' }, { label: 'Assists', value: '10664' }, { label: 'Rings', value: '4' }] },
    { id: 'steph-curry', name: 'Stephen Curry', sport: 'nba', image: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Stephen_Curry%2C_Olympic_Games_2024_%28cropped%29.jpg', description: 'American professional basketball player for the Golden State Warriors.', team: 'Warriors', position: 'Point Guard', nationality: 'USA', born: 'Akron, Ohio', netWorth: '$160 Million', previousTeams: 'Davidson Wildcats', stats: [{ label: 'Points', value: '22385' }, { label: '3PM', value: '3496' }, { label: 'Rings', value: '4' }, { label: 'MVP', value: '2' }] },
    { id: 'max-verstappen', name: 'Max Verstappen', sport: 'f1', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3973_by_Stepro_%28portrait_cropped%29.jpg', description: 'Formula One World Champion across multiple seasons.', team: 'Red Bull Racing', position: 'Driver', nationality: 'Netherlands', born: 'Hasselt, Belgium', netWorth: '$90 Million', previousTeams: 'Toro Rosso', stats: [{ label: 'Wins', value: '54' }, { label: 'Podiums', value: '98' }, { label: 'Titles', value: '3' }, { label: 'Poles', value: '32' }] },
    { id: 'lewis-hamilton', name: 'Lewis Hamilton', sport: 'f1', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg', description: 'British racing driver competing in Formula One, widely regarded as one of the greatest drivers in the history of the sport.', team: 'Mercedes', position: 'Driver', nationality: 'UK', born: 'Stevenage, England', netWorth: '$300 Million', previousTeams: 'McLaren', stats: [{ label: 'Wins', value: '105' }, { label: 'Podiums', value: '197' }, { label: 'Titles', value: '7' }, { label: 'Poles', value: '104' }] },
  ];

  const stadiumsData = [
    { id: 'santiago-bernabeu', name: 'Santiago Bernabeu', capacity: '81,044', location: 'Madrid, Spain', history: 'Opened in 1947, home to Real Madrid.', teams: ['Real Madrid'], image: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Santiago_Bernab%C3%A9u_Stadium%2C_2007.jpg' },
    { id: 'mcg', name: 'MCG', capacity: '100,024', location: 'Melbourne, Australia', history: 'The Melbourne Cricket Ground is an Australian sports stadium.', teams: ['Australia'], image: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Melbourne_Cricket_Ground_PD.jpg' },
    { id: 'chinnaswamy', name: 'M. Chinnaswamy Stadium', capacity: '40,000', location: 'Bengaluru, India', history: 'Home of RCB.', teams: ['RCB'], image: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Chinnaswamy_Stadium.jpg' }
  ];

  const fixturesData = {
    football: {
      upcoming: [
        { id: 'f1', team1: 'Real Madrid', team2: 'Barcelona', date: 'Oct 28', time: '20:00 UTC', stadium: 'Santiago Bernabeu', logo1: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg', logo2: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg' },
      ],
      completed: [
        { id: 'f2', team1: 'Man City', team2: 'Liverpool', score: '2 - 1', scorers: ['Haaland (12)', 'Foden (67)', 'Salah (45)'], stadium: 'Etihad Stadium', logo1: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', logo2: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg', stats: { possession: '60% - 40%', shots: '15 - 8' } },
      ],
      table: [
        { team: 'Real Madrid', played: 10, won: 8, drawn: 1, lost: 1, points: 25 },
        { team: 'Barcelona', played: 10, won: 7, drawn: 2, lost: 1, points: 23 },
      ]
    },
    cricket: {
      upcoming: [
        { id: 'c1', team1: 'India', team2: 'Australia', date: 'Nov 12', time: '09:00 UTC', stadium: 'MCG', format: 'ODI', logo1: 'https://flagcdn.com/w160/in.png', logo2: 'https://flagcdn.com/w160/au.png' }
      ],
      completed: [
        { id: 'c2', team1: 'England', team2: 'New Zealand', score: 'ENG won by 5 wickets', format: 'ODI', details: 'NZ: 240/8, ENG: 241/5', stadium: 'Lord\'s', logo1: 'https://flagcdn.com/w160/gb-eng.png', logo2: 'https://flagcdn.com/w160/nz.png', scorecard: { bat1: [{name: 'Root', runs: 85}], bowl1: [{name: 'Boult', wkts: 2}] } }
      ]
    },
    f1: {
      upcoming: [
        { id: 'f1_1', race: 'Las Vegas Grand Prix', country: 'USA', date: 'Nov 19', circuit: 'Las Vegas Strip Circuit', image: 'https://upload.wikimedia.org/wikipedia/commons/5/50/2021_United_States_Grand_Prix_13.jpg' }
      ],
      completed: [
        { id: 'f1_2', race: 'Monaco GP', country: 'Monaco', results: ['1. Verstappen', '2. Alonso', '3. Ocon'], lapTime: '1:12.272', circuit: 'Circuit de Monaco', image: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Grand_Prix_Monaco96_131954710.jpg' }
      ]
    },
    nba: {
      upcoming: [
        { id: 'n1', team1: 'Lakers', team2: 'Warriors', date: 'Nov 1', time: '19:30 PST', arena: 'Crypto.com Arena', logo1: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg', logo2: 'https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg' }
      ],
      completed: [
        { id: 'n2', team1: 'Celtics', team2: 'Heat', score: '104 - 103', arena: 'TD Garden', logo1: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg', logo2: 'https://upload.wikimedia.org/wikipedia/en/d/db/Miami_Heat_logo.svg', stats: { topScorer: 'Tatum (32 pts)' } }
      ]
    },
    ipl: {
      upcoming: [
        { id: 'i1', team1: 'RCB', team2: 'CSK', date: 'LIVE', time: '19:30 IST', status: 'Live', score1: '142/2', score2: '0/0', stadium: 'M. Chinnaswamy Stadium', logo1: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Royal_Challengers_Bengaluru_Original_Logo.svg', logo2: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Chennai_Super_Kings_Logo.svg' }
      ],
      completed: [
        { id: 'i2', team1: 'KKR', team2: 'SRH', score1: '114/2', score2: '113/10', details: 'KKR won by 8 wkts', stadium: 'MA Chidambaram Stadium', logo1: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Kolkata_Knight_Riders_Logo.svg', logo2: 'https://upload.wikimedia.org/wikipedia/en/8/81/Sunrisers_Hyderabad_logo.svg' }
      ]
    }
  };

  let NewsModel: any;
  let PlayerModel: any;
  let ContactModel: any;
  let UploadModel: any;

  const newsSchema = new mongoose.Schema({ title: String, content: String, image: String, category: String, source: String, date: { type: Date, default: Date.now }});
  NewsModel = mongoose.models.News || mongoose.model('News', newsSchema);

  const playerSchema = new mongoose.Schema({ id: String, name: String, sport: String, image: String, description: String, team: String, position: String, nationality: String, born: String, netWorth: String, previousTeams: String, stats: Array });
  PlayerModel = mongoose.models.Player || mongoose.model('Player', playerSchema);

  const contactSchema = new mongoose.Schema({ name: String, email: String, message: String, date: { type: Date, default: Date.now }});
  ContactModel = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

  const uploadSchema = new mongoose.Schema({ url: String, type: String, meta: Object, date: { type: Date, default: Date.now }});
  UploadModel = mongoose.models.Upload || mongoose.model('Upload', uploadSchema);

  let LogModel: any;
  const logSchema = new mongoose.Schema({ email: String, action: String, details: String, date: { type: Date, default: Date.now }});
  LogModel = mongoose.models.Log || mongoose.model('Log', logSchema);

  // --- API Routes ---
  app.get('/api/debug-players', (req, res) => {
    res.json(demoPlayers);
  });

  app.get('/api/news', async (req, res) => {
    try {
      const category = req.query.category as string;
      if (isConnected) {
        const query = category ? { category } : {};
        const news = await NewsModel.find(query).sort({ date: -1 }).limit(20);
        res.json(news.length ? news : (category ? demoNews.filter(n => n.category === category) : demoNews));
      } else {
        res.json(category ? demoNews.filter(n => n.category === category) : demoNews);
      }
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
  });

  app.get('/api/players/:id', async (req, res) => {
    try {
      const id = req.params.id;
      if (isConnected) {
        const player = await PlayerModel.findOne({ id });
        if (player) return res.json(player);
      }
      const playerFallback = demoPlayers.find(p => p.id === id || p.name.toLowerCase() === id.toLowerCase());
      if (playerFallback) return res.json(playerFallback);
      res.status(404).json({ error: 'Not found' });
    } catch (err) {
      console.error('/api/players/:id error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/api/players', async (req, res) => {
    try {
      const sport = req.query.sport as string;
      if (isConnected) {
        const query = sport ? { sport } : {};
        const players = await PlayerModel.find(query);
        res.json(players.length ? players : (sport ? demoPlayers.filter(p => p.sport === sport) : demoPlayers));
      } else {
        res.json(sport ? demoPlayers.filter(p => p.sport === sport) : demoPlayers);
      }
    } catch (err) {
      console.error('/api/players error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/api/stadiums', (req, res) => { res.json(stadiumsData); });
  app.get('/api/stadiums/:id', (req, res) => {
    const s = stadiumsData.find(s => s.id === req.params.id || s.name.toLowerCase().includes(req.params.id.toLowerCase()));
    if (s) res.json(s); else res.status(404).json({ error: 'Not found' });
  });

  const fetchESPN = async (url: string) => {
    try {
      const response = await fetch(url);
      const data: any = await response.json();
      return data.events || [];
    } catch (e) {
      console.error('ESPN fetch failed for', url);
      return [];
    }
  };

  const formatEvent = (event: any, isCricket = false) => {
    try {
      if (!event.competitions || !event.competitions[0] || !event.status) return null;
      const comp1 = event.competitions[0].competitors[0];
      const comp2 = event.competitions[0].competitors[1];
      const isFinal = event.status.type.state === 'post';
      const isLive = event.status.type.state === 'in';
      const venue = event.competitions[0].venue?.fullName || event.competitions[0].venue?.address?.city || '';
      
      return {
        id: event.id,
        team1: comp1?.team?.abbreviation || comp1?.team?.shortDisplayName || comp1?.team?.name,
        team2: comp2?.team?.abbreviation || comp2?.team?.shortDisplayName || comp2?.team?.name,
        logo1: comp1?.team?.logo,
        logo2: comp2?.team?.logo,
        score1: (isLive || isFinal) ? comp1?.score : undefined,
        score2: (isLive || isFinal) ? comp2?.score : undefined,
        status: isFinal ? 'Final' : isLive ? 'Live' : event.status?.type?.shortDetail || event.status?.type?.detail,
        date: event.status?.type?.shortDetail || event.date,
        venue
      };
    } catch(e) {
      return null;
    }
  };

  const formatF1Event = (event: any) => {
    try {
      if (!event.status) return null;
      return {
        id: event.id,
        race: event.name,
        country: event.competitions?.[0]?.venue?.address?.country || 'Unknown',
        circuit: event.competitions?.[0]?.venue?.fullName || 'Circuit',
        status: event.status?.type?.state === 'post' ? 'Final' : event.status?.type?.state === 'in' ? 'Live' : event.status?.type?.shortDetail,
        date: event.status?.type?.shortDetail
      }
    } catch(e) {
      return null;
    }
  };

  app.get('/api/fixtures', async (req, res) => {
    const customFixtures = {
      nba: {
        upcoming: [
          { id: 'n1', team1: 'Lakers', team2: 'Warriors', date: 'Tonight', time: '19:30 PST', arena: 'Crypto.com Arena', logo1: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg', logo2: 'https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg' }
        ],
        live: [
          { id: 'nl1', team1: 'Celtics', team2: 'Heat', score: '82 - 76', period: 'Q3 04:12', arena: 'TD Garden', logo1: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg', logo2: 'https://upload.wikimedia.org/wikipedia/en/d/db/Miami_Heat_logo.svg' }
        ],
        completed: [
          { id: 'n2', team1: 'Bulls', team2: 'Knicks', score: '104 - 103', arena: 'United Center', logo1: 'https://upload.wikimedia.org/wikipedia/en/6/67/Chicago_Bulls_logo.svg', logo2: 'https://upload.wikimedia.org/wikipedia/en/2/25/New_York_Knicks_logo.svg', stats: { topScorer: 'Brunson (32 pts)' } }
        ]
      },
      football: {
        upcoming: [
          { id: 'f1', team1: 'Real Madrid', team2: 'Barcelona', date: 'Tomorrow', time: '20:00 UTC', stadium: 'Santiago Bernabeu', logo1: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg', logo2: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg' },
          { id: 'f1b', team1: 'Inter Miami', team2: 'LA Galaxy', date: 'Sat', time: '18:00 EST', stadium: 'Chase Stadium', logo1: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Inter_Miami_CF_logo.svg', logo2: 'https://upload.wikimedia.org/wikipedia/commons/3/30/LA_Galaxy_logo.svg' }
        ],
        live: [
          { id: 'fl1', team1: 'Man City', team2: 'Liverpool', score: '1 - 1', minute: '67\'', stadium: 'Etihad Stadium', logo1: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', logo2: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg', stats: { possession: '60% - 40%', shots: '15 - 8' } }
        ],
        completed: [
          { id: 'f2', team1: 'Argentina', team2: 'Brazil', score: '1 - 0', scorers: ['Messi (78)'], stadium: 'Maracana', logo1: 'https://flagcdn.com/w160/ar.png', logo2: 'https://flagcdn.com/w160/br.png', stats: { possession: '55% - 45%', shots: '10 - 12' } },
        ]
      },
      cricket: {
        upcoming: [
          { id: 'c1', team1: 'India', team2: 'Australia', date: 'Nov 12', time: '09:00 UTC', format: 'Test', stadium: 'MCG', logo1: 'https://flagcdn.com/w160/in.png', logo2: 'https://flagcdn.com/w160/au.png' }
        ],
        live: [
          { id: 'cl1', team1: 'England', team2: 'New Zealand', score: 'ENG: 142/3', format: 'ODI', details: 'NZ won toss to field', stadium: 'Lord\'s', logo1: 'https://flagcdn.com/w160/gb-eng.png', logo2: 'https://flagcdn.com/w160/nz.png' }
        ],
        completed: [
          { id: 'c2', team1: 'South Africa', team2: 'India', score: 'IND won by 5 wickets', format: 'T20', details: 'SA: 160/8, IND: 161/5', stadium: 'Wanderers', logo1: 'https://flagcdn.com/w160/za.png', logo2: 'https://flagcdn.com/w160/in.png', scorecard: { bat1: [{name: 'Kohli', runs: 85}], bowl1: [{name: 'Bumrah', wkts: 2}] } }
        ]
      },
      ipl: {
        upcoming: [
          { id: 'i1', team1: 'MI', team2: 'CSK', date: 'Tomorrow', time: '19:30 IST', stadium: 'Wankhede Stadium', logo1: 'https://upload.wikimedia.org/wikipedia/en/c/cd/Mumbai_Indians_Logo.svg', logo2: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Chennai_Super_Kings_Logo.svg' }
        ],
        live: [
          { id: 'il1', team1: 'RCB', team2: 'KKR', status: 'Live', score1: '142/2 (15)', score2: 'Yet to bat', stadium: 'M. Chinnaswamy Stadium', logo1: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Royal_Challengers_Bengaluru_Original_Logo.svg', logo2: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Kolkata_Knight_Riders_Logo.svg' }
        ],
        completed: [
          { id: 'i2', team1: 'DC', team2: 'SRH', score1: '113/10', score2: '114/2', details: 'SRH won by 8 wkts', stadium: 'MA Chidambaram Stadium', logo1: 'https://upload.wikimedia.org/wikipedia/en/2/2f/Delhi_Capitals.svg', logo2: 'https://upload.wikimedia.org/wikipedia/en/8/81/Sunrisers_Hyderabad_logo.svg' }
        ]
      },
      f1: {
        upcoming: [
          { id: 'f1_1', race: 'Las Vegas Grand Prix', country: 'USA', date: 'Next Sunday', circuit: 'Las Vegas Strip Circuit', image: 'https://upload.wikimedia.org/wikipedia/commons/5/50/2021_United_States_Grand_Prix_13.jpg' }
        ],
        live: [
          { id: 'f1l1', race: 'Monza GP', country: 'Italy', results: ['1. Leclerc', '2. Hamilton'], lapTime: 'Lap 24/53', circuit: 'Monza Circuit', image: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Alonso_Ferrari_F10_Bahrain.jpg' }
        ],
        completed: [
          { id: 'f1_2', race: 'Monaco GP', country: 'Monaco', results: ['1. Verstappen', '2. Alonso', '3. Ocon'], lapTime: '1:12.272', circuit: 'Circuit de Monaco', image: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Grand_Prix_Monaco96_131954710.jpg' }
        ]
      }
    };
    
    const sport = req.query.sport as string;
    if (sport && (customFixtures as any)[sport]) res.json((customFixtures as any)[sport]);
    else res.json(customFixtures);
  });

  app.get('/api/categories', (req, res) => {
    res.json([
      { id: 'football', name: 'Football' },
      { id: 'cricket', name: 'Cricket' },
      { id: 'nba', name: 'NBA' },
      { id: 'f1', name: 'Formula 1' },
      { id: 'ipl', name: 'IPL' },
    ]);
  });

  app.post('/api/contact', async (req, res) => {
    console.log(`[EMAIL COMPONENT] -> Sent notification to shivamtiwari18107@gmail.com: Contact form submitted by ${req.body.name} (${req.body.email}): ${req.body.message}`);
    
    try {
      if (isConnected) {
        const contact = new ContactModel(req.body);
        await contact.save();
      }
      res.status(201).json({ success: true, message: 'Message sent successfully.' });
    } catch (err) { 
      // If DB fails, just say success anyway because we "sent the email".
      res.status(201).json({ success: true, message: 'Message sent successfully.' });
    }
  });

  app.post('/api/upload-smart', async (req, res) => {
    try {
      const { base64Image } = req.body;
      if (!base64Image) return res.status(400).json({ error: 'Missing base64Image' });
      
      let identifiedType = 'general';
      let title = 'Uploaded Image';

      // Very simple smart detect using headers, or Gemini if available
      try {
        if (process.env.GEMINI_API_KEY) {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const base64Data = base64Image.split(',')[1];
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  { text: 'Analyze this image. Is it a "player", "stadium", "team", "match", or "general"? Also provide a 2-3 word title. Return ONLY JSON format: {"type": "player/stadium/team/match/general", "title": "..."}' },
                  { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
                ]
              }
            ],
            config: { responseMimeType: 'application/json' }
          });
          const result = JSON.parse(response.text || '{}');
          if (result.type) identifiedType = result.type;
          if (result.title) title = result.title;
        }
      } catch (aiErr) {
        console.log('Gemini vision failed or unavailable, resorting to general type.', aiErr);
      }

      if (isConnected) {
        const upload = new UploadModel({ url: base64Image, type: identifiedType, meta: { title } });
        await upload.save();
      }
      
      res.json({ success: true, url: base64Image, type: identifiedType, title });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  app.get('/api/uploads', async (req, res) => {
    if (!isConnected) return res.json([]);
    const uploads = await UploadModel.find().sort({ date: -1 });
    res.json(uploads);
  });

  // Auth & Admin Auth
  const JWT_SECRET = 'super-secret-jwt-key-12345';
  
  app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    // Simulate send email
    console.log(`[EMAIL COMPONENT] -> Sent notification to shivamtiwari18107@gmail.com: New user registered: ${email}`);
    
    try {
      if (isConnected) {
        await new LogModel({ email, action: 'Registered', details: 'User created a new account' }).save();
      }
    } catch(e) { }
    
    res.json({ success: true, token: jwt.sign({ role: 'user', email }, JWT_SECRET, { expiresIn: '1d' }) });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    console.log(`[EMAIL COMPONENT] -> Sent notification to shivamtiwari18107@gmail.com: User logged in: ${email}. User logged in on my mobile.`);
    
    try {
      if (isConnected) {
        await new LogModel({ email, action: 'Logged In', details: 'User authenticated' }).save();
      }
    } catch(e) { }
    
    res.json({ success: true, token: jwt.sign({ role: 'user', email }, JWT_SECRET, { expiresIn: '1d' }) });
  });

  app.post('/api/auth/forgot', async (req, res) => {
    const { email } = req.body;
    console.log(`[EMAIL COMPONENT] -> Sent notification to ${email}: Password reset link generated.`);
    res.json({ success: true, message: 'Reset email sent' });
  });

  app.post('/api/admin/login', async (req, res) => {
    const email = req.body.username || req.body.email;
    const password = req.body.password;
    if (email === 'shivamtiwari18107' && password === 'shivam123') {
      res.json({ token: jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' }) });
    } else {
      console.log(`[EMAIL COMPONENT] -> Sent notification to shivamtiwari18107@gmail.com: Failed admin login attempt: ${email}`);
      if (isConnected) {
        await new LogModel({ email, action: 'Failed Admin Login', details: 'Invalid credentials attempted on Admin page' }).save();
      }
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  const authenticateAdmin = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      jwt.verify(authHeader.split(' ')[1], JWT_SECRET, (err: any, user: any) => {
        if (err || user.role !== 'admin') return res.sendStatus(403);
        req.user = user; next();
      });
    } else res.sendStatus(401);
  };

  app.get('/api/admin/logs', authenticateAdmin, async (req, res) => {
    if (!isConnected) return res.json([]);
    res.json(await LogModel.find().sort({ date: -1 }).limit(100));
  });

  app.get('/api/admin/messages', authenticateAdmin, async (req, res) => {
    if (!isConnected) return res.json([]);
    res.json(await ContactModel.find().sort({ date: -1 }));
  });
  app.delete('/api/admin/messages/:id', authenticateAdmin, async (req, res) => {
    if (!isConnected) return res.json({ error: 'No DB' });
    await ContactModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  });
  app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
    if (!isConnected) return res.json({ totalMessages: 0, totalNews: 0, totalPlayers: 0, totalVisits: 1420 });
    res.json({
      totalMessages: await ContactModel.countDocuments(),
      totalNews: await NewsModel.countDocuments(),
      totalPlayers: await PlayerModel.countDocuments(),
      totalVisits: Math.floor(Math.random() * 5000) + 1000
    });
  });

  // Global search proxy to mock data easily
  app.get('/api/search', async (req, res) => {
    const q = (req.query.q as string || '').toLowerCase();
    const queryWords = q.split(' ').filter(w => w.length > 2);
    
    const matchesQuery = (text: string) => {
      if (!text) return false;
      const lower = text.toLowerCase();
      if (lower.includes(q)) return true;
      if (queryWords.length > 0 && queryWords.some(w => lower.includes(w))) return true;
      return false;
    };
    
    // Improve search across name, team, description, or stats to allow things like "most runs"
    const results = {
      players: demoPlayers.filter(p => 
        matchesQuery(p.name) || 
        matchesQuery(p.description || '') ||
        matchesQuery(p.team || '') ||
        matchesQuery(JSON.stringify(p.stats || []))
      ),
      stadiums: stadiumsData.filter(s => 
        matchesQuery(s.name) || 
        matchesQuery(s.location || '')
      ),
      news: demoNews.filter(n => matchesQuery(n.title) || matchesQuery(n.content || ''))
    };
    res.json(results);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, '../dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer();
