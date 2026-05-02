import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";

// Just test the logic of formatting
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
      if (!event.competitions || !event.competitions[0]) return null;
      const comp1 = event.competitions[0].competitors[0];
      const comp2 = event.competitions[0].competitors[1];
      const isFinal = event.status.type.state === 'post';
      const isLive = event.status.type.state === 'in';
      
      return {
        id: event.id,
        team1: comp1?.team?.abbreviation || comp1?.team?.shortDisplayName || comp1?.team?.name,
        team2: comp2?.team?.abbreviation || comp2?.team?.shortDisplayName || comp2?.team?.name,
        logo1: comp1?.team?.logo,
        logo2: comp2?.team?.logo,
        score1: (isLive || isFinal) ? comp1?.score : undefined,
        score2: (isLive || isFinal) ? comp2?.score : undefined,
        status: isFinal ? 'Final' : isLive ? 'Live' : event.status?.type?.shortDetail || event.status?.type?.detail,
        date: event.status?.type?.shortDetail || event.date
      };
    } catch(e) {
      console.error('Error formatting event:', e);
      return null;
    }
};

const formatF1Event = (event: any) => {
    try {
      return {
        id: event.id,
        race: event.name,
        country: event.competitions?.[0]?.venue?.address?.country || 'Unknown',
        circuit: event.competitions?.[0]?.venue?.fullName || 'Circuit',
        status: event.status.type.state === 'post' ? 'Final' : event.status.type.state === 'in' ? 'Live' : event.status.type.shortDetail,
        date: event.status.type.shortDetail
      }
    } catch(e) {
      return null;
    }
};

const main = async () => {
    try {
      const [nba, epl, laLiga, cricket1, cricket2, f1] = await Promise.all([
        fetchESPN("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard"),
        fetchESPN("https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard"),
        fetchESPN("https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard"),
        fetchESPN("https://site.api.espn.com/apis/site/v2/sports/cricket/8048/scoreboard"),
        fetchESPN("https://site.api.espn.com/apis/site/v2/sports/cricket/8039/scoreboard"),
        fetchESPN("https://site.api.espn.com/apis/site/v2/sports/racing/f1/scoreboard")
      ]);
      console.log('F1 items:', typeof f1, Array.isArray(f1));
      
      const payload = {
        nba: {
          upcoming: nba.filter((e: any) => e.status?.type?.state !== 'post').map((e: any) => formatEvent(e)).filter(Boolean),
          completed: nba.filter((e: any) => e.status?.type?.state === 'post').map((e: any) => formatEvent(e)).filter(Boolean)
        },
        football: {
          upcoming: [...epl, ...laLiga].filter((e: any) => e.status?.type?.state !== 'post').map((e: any) => formatEvent(e)).filter(Boolean),
          completed: [...epl, ...laLiga].filter((e: any) => e.status?.type?.state === 'post').map((e: any) => formatEvent(e)).filter(Boolean)
        },
        cricket: {
          upcoming: [...cricket1, ...cricket2].filter((e: any) => e.status?.type?.state !== 'post').map((e: any) => formatEvent(e, true)).filter(Boolean),
          completed: [...cricket1, ...cricket2].filter((e: any) => e.status?.type?.state === 'post').map((e: any) => formatEvent(e, true)).filter(Boolean)
        },
        f1: {
          upcoming: f1.filter((e: any) => e.status?.type?.state !== 'post').map((e: any) => formatF1Event(e)).filter(Boolean),
          completed: f1.filter((e: any) => e.status?.type?.state === 'post').map((e: any) => formatF1Event(e)).filter(Boolean)
        }
      };
      console.log("Success", !!payload);
    } catch(e) {
      console.error("FAIL", e);
    }
}
main();
