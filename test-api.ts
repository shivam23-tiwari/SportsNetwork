import https from "https";
https.get("https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard", res => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    const events = JSON.parse(data).events;
    if (events && events.length > 0) {
      console.log(JSON.stringify(events[0].competitions[0].competitors, null, 2));
      console.log("Status:", events[0].status.type.detail);
    }
  });
});
