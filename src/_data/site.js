export default {
  url: "https://torstencurdt.com",
  domain: "torstencurdt.com",
  language: "en-US",
  description:
    "Central hub for Torsten Curdt (tcurdt) on the web. Hosts the Torsten on Tech articles, Flip Flop Fix.",
  feed: {
    articles: {
      title: "Articles by Torsten Curdt",
      url: "https://torstencurdt.com/articles/feed.xml",
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
