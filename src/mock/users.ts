import ladybugAvatar from "../assets/profile-ladybug.png";
import beeAvatar from "../assets/profile-bee.png";
import spiderAvatar from "../assets/spider.png";
import flyAvatar from "../assets/fly.png";
import mosquitoAvatar from "../assets/mosquito.png";
import beetleAvatar from "../assets/brown-beetle.png";
import antAvatar from "../assets/ant.png";
import mothAvatar from "../assets/moth.png";
import cockroachAvatar from "../assets/cockroach.png";
import caterpillarAvatar from "../assets/caterpillar.png";

/**
 * Demo leaderboard data – feel free to tweak!
 * `bugs` is an array of dummy entries so `bugs.length` is the total.
 */
export const users = [
  {
    id: 1,
    name: "Lara the Ladybug",
    avatar: ladybugAvatar,
    bugs: new Array(27).fill(0),
    bounty: 5400,
  },
  {
    id: 2,
    name: "Queen Beeatrix",
    avatar: beeAvatar,
    bugs: new Array(22).fill(0),
    bounty: 4950,
  },
  {
    id: 3,
    name: "Peter Spider-Man",
    avatar: spiderAvatar,
    bugs: new Array(19).fill(0),
    bounty: 4100,
  },
  {
    id: 4,
    name: "Buzz the Fly",
    avatar: flyAvatar,
    bugs: new Array(18).fill(0),
    bounty: 3600,
  },
  {
    id: 5,
    name: "Mia Mosquito",
    avatar: mosquitoAvatar,
    bugs: new Array(16).fill(0),
    bounty: 3200,
  },
  {
    id: 6,
    name: "Benny Beetle",
    avatar: beetleAvatar,
    bugs: new Array(14).fill(0),
    bounty: 2800,
  },
  {
    id: 7,
    name: "Annie Ant",
    avatar: antAvatar,
    bugs: new Array(12).fill(0),
    bounty: 2200,
  },
  {
    id: 8,
    name: "Martha Moth",
    avatar: mothAvatar,
    bugs: new Array(11).fill(0),
    bounty: 2000,
  },
  {
    id: 9,
    name: "Rick Roach",
    avatar: cockroachAvatar,
    bugs: new Array(9).fill(0),
    bounty: 1600,
  },
  {
    id: 10,
    name: "Cathy Caterpillar",
    avatar: caterpillarAvatar,
    bugs: new Array(7).fill(0),
    bounty: 1200,
  },
];