export default {
  url: "https://torstencurdt.com",
  domain: "torstencurdt.com",
  language: "en-US",
  description: "Central hub for Torsten Curdt (tcurdt) on the web.",
  feed: {
    tech: {
      title: "Torsten Curdt writing about tech",
      url: "https://torstencurdt.com/tech/feed.xml",
    },
    tech: {
      title: "Torsten Curdt writing about travel",
      url: "https://torstencurdt.com/travel/feed.xml",
    },
  },
  author: {
    nick: "tcurdt",
    name: "Torsten Curdt",
    email: "hi@torstencurdt.com",
  },
  env: {
    url: process.env.URL,
  },
};
