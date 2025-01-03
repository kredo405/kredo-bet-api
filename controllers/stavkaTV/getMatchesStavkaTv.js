import axios from "axios";

export const getMatchesStavkaTv = async (
  limit,
  dateFrom,
  dateTo,
  status,
  sport
) => {
  const desktop_agents = [
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0.1 Safari/602.2.14",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0",
  ];

  let rand = Math.floor(Math.random() * desktop_agents.length);

  let url;

  if (status === "upcoming" && sport === "onlyTopLeagues=true") {
    url = `https://stavka.tv/api/v2/matches/center?dateFrom=${dateFrom}&dateTo=${dateTo}&onlyTopLeagues=true&status=upcoming&withHigherTopLeagues=true&sort=league_country_asc&offset=0&limit=${limit}`;
  } else if (status === "ended") {
    url = `https://stavka.tv/api/v2/matches/center?dateFrom=${dateFrom}&dateTo=${dateTo}&status=ended&withHigherTopLeagues=true&sort=league_country_asc&offset=0&limit=${limit}&${sport}`;
  } else if (status === "upcoming") {
    url = `https://stavka.tv/api/v2/matches/center?dateFrom=${dateFrom}&dateTo=${dateTo}&status=upcoming&withHigherTopLeagues=true&sort=league_country_asc&offset=0&limit=${limit}&${sport}`;
  }

  const options = {
    method: "GET",
    url: url,

    // https://stavka.tv/api/v2/matches/center?dateFrom=2024-12-28&dateTo=2024-12-29&onlyTopLeagues=true&status=upcoming&withHigherTopLeagues=true&sort=league_country_asc&offset=0&limit=150
    // https://stavka.tv/api/v2/matches/center?dateFrom=2024-12-28&dateTo=2024-12-29&status=upcoming&withHigherTopLeagues=true&sort=league_country_asc&offset=0&limit=150&sport=soccer
    // https://stavka.tv/api/v2/matches/center?dateFrom=2024-12-28&dateTo=2024-12-29&status=ended&withHigherTopLeagues=true&sort=league_country_asc&offset=0&limit=150&sport=soccer
    headers: {
      "User-Agent": desktop_agents[rand],
    },
  };
  try {
    const response = await axios.request(options);
    const result = await response.data;
    return result;
  } catch (error) {
    console.log(error);
  }
};
