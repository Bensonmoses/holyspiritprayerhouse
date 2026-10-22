/* ══════════════════════════════════════════════════════════════════
   EVENTS DATA — the only file to edit when there is a church update.
   ══════════════════════════════════════════════════════════════════
   Times are India time (IST). The page works out by itself whether a
   session is Upcoming, Today, LIVE or Completed from date + time.

   Program fields
     id        unique, lowercase-with-dashes
     title     { en, te }
     place     { en, te }
     poster    image path (16:9 or any shape)
     playlist  YouTube playlist id (optional) — once a multi-day program is over, the card
               shows its poster with "▶ Watch all days" and a Day 1 → last day schedule
     sessions  list of days / meetings (one item for a single program)

   Session fields
     date      "YYYY-MM-DD"
     time      "HH:MM" 24-hour IST, or null if not announced yet
     label     { en, te }            e.g. Day 1 · Night
     speaker   { en, te }            optional
     poster    that day's own poster (optional) — shown in "Today / Up next"
     live      YouTube/Facebook live link — shows "LIVE NOW" while it is on
     video     recording link (YouTube) — shown after it ends
     photos    [ "images/Events/<id>/day1-1.jpg", ... ]   (square thumbnails)
     collage   one wide highlights image — shown full width under the day
   ══════════════════════════════════════════════════════════════════ */

window.HSPH_EVENTS = [
  {
    id: "pentecost-fasting-2026",
    title: {
      en: "Pentecost Prayer — Altar of Incense Fasting Meetings",
      te: "పెంతెకొస్తు ప్రార్ధన ధూపవేదిక ఉపవాస కూడికలు"
    },
    tagline: { en: "12 Days of Fasting Prayer", te: "12 రోజుల ఉపవాస ప్రార్థనలు" },
    place: {
      en: "I.P.C Church, Oduru, West Godavari",
      te: "ఐ.పి.సి చర్చి, ఓడూరు, ప.గో. జిల్లా"
    },
    hosts: { en: "Bishop P. Moses", te: "బిషప్ పి. మోజెస్" },
    verse: { en: "So the church … had peace and was being built up. — Acts 9:31",
             te: "సంఘము క్షేమాభివృద్ధి నొందుచు సమాధానము కలిగియుండెను. — అపొ 9:31" },
    poster: "images/Events/pentecost-fasting-2026/poster.jpg",
    playlist: "PLbuE7ilDdduw",
    sessions: [
      { date: "2026-10-11", time: "19:00",
        label:   { en: "Day 1 · Night", te: "మొదటి రోజు రాత్రి" },
        speaker: { en: "Bishop K. Daniel", te: "బిషప్ కె. దానియేల్ గారు" },
        poster:  "images/Events/pentecost-fasting-2026/poster.jpg",
        video:   "https://youtube.com/live/6iD4mw73LYY",
        collage: "images/Events/pentecost-fasting-2026/day-01-collab.jpeg",
        photos:  [] },
      { date: "2026-10-12", time: "10:00",
        label:   { en: "Day 2 · Morning", te: "రెండవ రోజు పగలు" },
        speaker: { en: "Bishop Dr. B. Prema Sekhar", te: "బిషప్ డా. బి. ప్రేమ శేఖర్ గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-02-poster.jpg",
        live:    "https://www.youtube.com/live/9YM2pcQwpKU" },
      { date: "2026-10-12", time: "18:00",
        label:   { en: "Day 2 · Night", te: "రెండవ రోజు రాత్రి" },
        speaker: { en: "Bishop Dr. B. Prema Sekhar", te: "బిషప్ డా. బి. ప్రేమ శేఖర్ గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-02-night-poster.jpg",
        live:    "https://www.youtube.com/live/_-EVw_vImF0",
        collage: "images/Events/pentecost-fasting-2026/day-02-night-collab.jpeg" },
      { date: "2026-10-13", time: "10:00",
        label:   { en: "Day 3 · Morning", te: "మూడవ రోజు పగలు" },
        speaker: { en: "Brother Praneed", te: "బ్రదర్ ప్రణీద్ గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-03-poster.jpg",
        live:    "https://www.youtube.com/live/BGHTulapFfc" },
      { date: "2026-10-13", time: "18:00",
        label:   { en: "Day 3 · Night", te: "మూడవ రోజు రాత్రి" },
        speaker: { en: "Brother P. Billy Graham Moses", te: "బ్రదర్ పి. బిల్లిగ్రహం మోజెస్ గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-03-night-poster.jpg",
        live:    "https://youtube.com/live/cUfJSa5DkDY",
        collage: "images/Events/pentecost-fasting-2026/day-03-night-collab.jpeg" },
      { date: "2026-10-14", time: "10:00",
        label:   { en: "Day 4 · Morning", te: "నాల్గవ రోజు పగలు" },
        speaker: { en: "Rev. Father P. Rajababu", te: "రెవ. ఫాదర్ పి. రాజబాబు గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-04-poster.jpg",
        live:    "https://youtube.com/live/JIjSim4Omvc",
        collage: "images/Events/pentecost-fasting-2026/day-04-morning-collab.jpeg" },
      { date: "2026-10-14", time: "18:00",
        label:   { en: "Day 4 · Night", te: "నాల్గవ రోజు రాత్రి" },
        speaker: { en: "Rev. V. Shalem Raju", te: "రెవ. వి. షాలేం రాజు గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-04-night-poster.jpg",
        live:    "https://youtube.com/live/Imlx-g_b8h4" },
      { date: "2026-10-15", time: "10:00",
        label:   { en: "Day 5 · Morning", te: "ఐదవ రోజు పగలు" },
        speaker: { en: "Rev. V. Shalem Raju", te: "రెవ. వి. షాలేం రాజు గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-05-poster.jpg",
        live:    "https://youtube.com/live/-t8K8ShoPQ0",
        collage: "images/Events/pentecost-fasting-2026/day-05-morning-collab.jpeg" },
      { date: "2026-10-15", time: "18:00",
        label:   { en: "Day 5 · Night", te: "ఐదవ రోజు రాత్రి" },
        speaker: { en: "Rev. V. Shalem Raju", te: "రెవ. వి. షాలేం రాజు గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-05-night-poster.jpg",
        live:    "https://youtube.com/live/NBGaSfCVTLw" },
      { date: "2026-10-16", time: "10:00",
        label:   { en: "Day 6 · Morning", te: "ఆరవ రోజు పగలు" },
        speaker: { en: "Rev. Father P. Rajababu", te: "రెవ. ఫాదర్ పి. రాజబాబు గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-06-poster.jpg",
        live:    "https://youtube.com/live/K2RuqfGEhQI" },
      { date: "2026-10-16", time: "18:00",
        label:   { en: "Day 6 · Night", te: "ఆరవ రోజు రాత్రి" },
        speaker: { en: "Rev. Golla David Raju", te: "రెవ. గొల్లా డేవిడ్ రాజు గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-06-night-poster.jpg",
        live:    "https://youtube.com/live/ehqEhelpWjY" },
      { date: "2026-10-17", time: "10:00",
        label:   { en: "Day 7 · Morning", te: "ఏడవ రోజు పగలు" },
        speaker: { en: "Pastor Jaya Prasad Vardhanapu", te: "పాస్టర్ జయ ప్రసాద్ వర్ధనపు గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-07-poster.jpg",
        live:    "https://youtube.com/live/1JqTNU_JIlY" },
      { date: "2026-10-17", time: "18:00",
        label:   { en: "Day 7 · Night", te: "ఏడవ రోజు రాత్రి" },
        speaker: { en: "Rev. V. Jyothi Babu", te: "రెవ. వి. జ్యోతి బాబు గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-07-night-poster.jpg",
        live:    "https://youtube.com/live/Sh526cx2UK0" },
      { date: "2026-10-18", time: "11:00",
        label:   { en: "Day 8 · Morning", te: "ఎనిమిదవ రోజు పగలు" },
        speaker: { en: "Bishop P. Moses", te: "బిషప్ పి. మోజెస్ గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-08-poster.jpg",
        live:    "https://youtube.com/live/agMOuUXAfT8" },
      { date: "2026-10-18", time: "18:00",
        label:   { en: "Day 8 · Night", te: "ఎనిమిదవ రోజు రాత్రి" },
        speaker: { en: "Rev. Golla David Raju", te: "రెవ. గొల్లా డేవిడ్ రాజు గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-08-night-poster.jpg",
        live:    "https://youtube.com/live/ync-33gAli0" },
      { date: "2026-10-19", time: "10:00",
        label:   { en: "Day 9 · Morning", te: "తొమ్మిదవ రోజు పగలు" },
        speaker: { en: "Rev. P. David Raju", te: "రెవ. పి. డేవిడ్ రాజు గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-09-poster.jpg",
        live:    "https://youtube.com/live/Enonxx6umTg" },
      { date: "2026-10-19", time: "18:00",
        label:   { en: "Day 9 · Night", te: "తొమ్మిదవ రోజు రాత్రి" },
        speaker: { en: "Rev. P. David Raju", te: "రెవ. పి. డేవిడ్ రాజు గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-09-night-poster.jpg",
        live:    "https://youtube.com/live/_QVDchCMv6w" },
      { date: "2026-10-20", time: "10:00",
        label:   { en: "Day 10 · Morning", te: "పదవ రోజు పగలు" },
        speaker: { en: "Rev. D. Dasanna", te: "రెవ. డి. దాసన్న గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-10-poster.jpg",
        live:    "https://youtube.com/live/PpkX205PwZY" },
      { date: "2026-10-20", time: "18:00",
        label:   { en: "Day 10 · Night", te: "పదవ రోజు రాత్రి" },
        speaker: { en: "Rev. D. Dasanna", te: "రెవ. డి. దాసన్న గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-10-night-poster.jpg",
        live:    "https://youtube.com/live/IVthtbF2L94" },
      { date: "2026-10-21", time: "10:00",
        label:   { en: "Day 11 · Morning", te: "పదకొండవ రోజు పగలు" },
        speaker: { en: "Pastor D. Koteswara Rao", te: "పాస్టర్ డి. కోటేశ్వరరావు గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-11-poster.jpg",
        live:    "https://youtube.com/live/w4JAXQldwqY" },
      { date: "2026-10-21", time: "18:00",
        label:   { en: "Day 11 · Night", te: "పదకొండవ రోజు రాత్రి" },
        speaker: { en: "Pastor D. Koteswara Rao", te: "పాస్టర్ డి. కోటేశ్వరరావు గారు" },
        poster:  "images/Events/pentecost-fasting-2026/day-11-night-poster.jpg",
        live:    "https://youtube.com/live/dAQXbDhuqiM" },
      { date: "2026-10-22", time: "10:00",
        label:   { en: "Day 12 · Morning", te: "పన్నెండవ రోజు పగలు" },
        speaker: { en: "Pastor Jaya Prasad Vardhanapu", te: "పాస్టర్ జయ ప్రసాద్ వర్ధనపు గారు" },
        live:    "https://youtube.com/live/8uMyi0EE9Qg" },
      { date: "2026-10-22", time: "18:00",
        label:   { en: "Day 12 · Night", te: "పన్నెండవ రోజు రాత్రి" },
        speaker: { en: "Pastor Jaya Prasad Vardhanapu", te: "పాస్టర్ జయ ప్రసాద్ వర్ధనపు గారు" },
        live:    "https://youtube.com/live/MGvnJKciEJ8" }
    ]
  },

  {
    id: "a-day-with-jesus-2026",
    title: { en: "A Day with Jesus", te: "యేసుతో ఒకరోజు" },
    tagline: { en: "Special Meeting", te: "ప్రత్యేక కూడిక" },
    place: {
      en: "I.P.C Church, Oduru, West Godavari",
      te: "ఐ.పి.సి చర్చి, ఓడూరు, ప.గో. జిల్లా"
    },
    hosts: { en: "Bishop P. Moses", te: "బిషప్ పి. మోజెస్" },
    poster: "images/Events/a-day-with-jesus-2026/poster.jpg",
    sessions: [
      { date: "2026-10-04", time: "19:00", status: "done",
        label:   { en: "Evening Meeting", te: "సాయంత్రం కూడిక" },
        speaker: { en: "Rev. Joseph Stanley · Grace Generation Church, USA",
                   te: "రెవ. జోసెఫ్ స్టాన్లీ గారు · గ్రేస్ జనరేషన్ చర్చి, USA" },
        video:   "https://youtube.com/live/CFnnHih_eoI",
        photos:  [] }
    ]
  }
];
