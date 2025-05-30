import axios from "axios";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
export const getAllMatchesExcaper = async () => {
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

  const options = {
    method: "GET",
    url: `https://www.excapper.com/`,
    headers: {
      "User-Agent": desktop_agents[rand],
    },
  };

  try {
    const response = await axios.request(options);
    const result = await response.data;

    const dom = new JSDOM(result);
    let element = dom.window.document.querySelector("#premach");
    let arrEl = element.querySelectorAll(".a_link");
    const match = Array.from(arrEl).map((el) => {
      const teams = el.querySelectorAll("td")[3].textContent.trim();
      const [homeTeam, awayTeam] = teams
        .split(" - ")
        .map((team) => team.trim());
      const dateString = el.querySelectorAll("td")[0].textContent.trim();
      const [day, month, year, hours, minutes] = dateString
        .match(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/)
        .slice(1)
        .map(Number);
      const date = new Date(year, month - 1, day, hours, minutes);

      return {
        link: el.getAttribute("data-game-link").trim(),
        date,
        flag: el.querySelector("img").getAttribute("src").trim(),
        league: el.querySelectorAll("td")[2].textContent.trim(),
        homeTeam,
        awayTeam,
        amoney: parseInt(el.querySelectorAll("td")[4].textContent.trim(), 10),
      };
    });

    return match;
  } catch (error) {
    console.log(error);
  }
};
