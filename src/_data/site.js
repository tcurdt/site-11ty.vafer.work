export default {
  url: "https://torstencurdt.com",
  domain: "torstencurdt.com",
  language: "en-US",
  description:
    "Central hub for Torsten Curdt (tcurdt) on the web. Hosts the Torsten on Tech articles, Flip Flop Fix.",
  feed: {
    tech: {
      title: "Torsten on Tech",
      url: "https://torstencurdt.com/tech/feed.xml",
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
