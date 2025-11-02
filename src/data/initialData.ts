import { Team, Formation } from '../models/Team';
import { Player, Position } from '../models/Player';

export const generatePlayer = (
  name: string,
  age: number,
  position: Position,
  nationality: string,
  overall: number
): Player => ({
  id: Math.random().toString(36).substr(2, 9),
  name,
  age,
  position,
  nationality,
  overall,
  pace: overall + Math.floor(Math.random() * 10 - 5),
  shooting: overall + Math.floor(Math.random() * 10 - 5),
  passing: overall + Math.floor(Math.random() * 10 - 5),
  dribbling: overall + Math.floor(Math.random() * 10 - 5),
  defending: overall + Math.floor(Math.random() * 10 - 5),
  physical: overall + Math.floor(Math.random() * 10 - 5),
  stamina: 100,
  morale: 75 + Math.floor(Math.random() * 25),
  form: 5 + Math.floor(Math.random() * 5),
  injured: false,
  marketValue: overall * 100000,
});

const createSquad = (teamName: string): Player[] => {
  const baseRating = 70 + Math.floor(Math.random() * 15);
  
  return [
    // Goalkeepers
    generatePlayer(`${teamName} GK 1`, 28, Position.GK, 'England', baseRating),
    generatePlayer(`${teamName} GK 2`, 22, Position.GK, 'England', baseRating - 10),
    
    // Defenders
    generatePlayer(`${teamName} LB`, 25, Position.LB, 'Spain', baseRating - 5),
    generatePlayer(`${teamName} CB 1`, 27, Position.CB, 'Brazil', baseRating),
    generatePlayer(`${teamName} CB 2`, 26, Position.CB, 'France', baseRating - 2),
    generatePlayer(`${teamName} RB`, 24, Position.RB, 'Portugal', baseRating - 5),
    generatePlayer(`${teamName} CB 3`, 29, Position.CB, 'Italy', baseRating - 8),
    
    // Midfielders
    generatePlayer(`${teamName} CDM`, 27, Position.CDM, 'Germany', baseRating - 3),
    generatePlayer(`${teamName} CM 1`, 25, Position.CM, 'Belgium', baseRating + 2),
    generatePlayer(`${teamName} CM 2`, 23, Position.CM, 'Argentina', baseRating),
    generatePlayer(`${teamName} CAM`, 26, Position.CAM, 'Spain', baseRating + 5),
    generatePlayer(`${teamName} LM`, 22, Position.LM, 'Brazil', baseRating - 5),
    generatePlayer(`${teamName} RM`, 24, Position.RM, 'Netherlands', baseRating - 5),
    
    // Forwards
    generatePlayer(`${teamName} ST 1`, 28, Position.ST, 'Uruguay', baseRating + 8),
    generatePlayer(`${teamName} ST 2`, 23, Position.ST, 'France', baseRating + 3),
    generatePlayer(`${teamName} LW`, 21, Position.LW, 'Portugal', baseRating),
    generatePlayer(`${teamName} RW`, 26, Position.RW, 'Egypt', baseRating + 2),
  ];
};

export const initialTeams: Team[] = [
  {
    id: 'team1',
    name: 'Manchester City FC',
    shortName: 'MCI',
    country: 'England',
    league: 'Premier League',
    budget: 200000000,
    reputation: 5,
    players: createSquad('Man City'),
    formation: Formation.F_4_3_3,
    tactics: {
      mentality: 'attacking',
      width: 8,
      tempo: 9,
      passingStyle: 'short',
    },
  },
  {
    id: 'team2',
    name: 'Real Madrid CF',
    shortName: 'RMA',
    country: 'Spain',
    league: 'La Liga',
    budget: 250000000,
    reputation: 5,
    players: createSquad('Real Madrid'),
    formation: Formation.F_4_3_3,
    tactics: {
      mentality: 'attacking',
      width: 7,
      tempo: 8,
      passingStyle: 'mixed',
    },
  },
  {
    id: 'team3',
    name: 'Bayern Munich',
    shortName: 'BAY',
    country: 'Germany',
    league: 'Bundesliga',
    budget: 180000000,
    reputation: 5,
    players: createSquad('Bayern'),
    formation: Formation.F_4_2_3_1,
    tactics: {
      mentality: 'attacking',
      width: 7,
      tempo: 8,
      passingStyle: 'short',
    },
  },
  {
    id: 'team4',
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    country: 'France',
    league: 'Ligue 1',
    budget: 220000000,
    reputation: 5,
    players: createSquad('PSG'),
    formation: Formation.F_4_3_3,
    tactics: {
      mentality: 'attacking',
      width: 8,
      tempo: 9,
      passingStyle: 'short',
    },
  },
  {
    id: 'team5',
    name: 'Liverpool FC',
    shortName: 'LIV',
    country: 'England',
    league: 'Premier League',
    budget: 170000000,
    reputation: 4,
    players: createSquad('Liverpool'),
    formation: Formation.F_4_3_3,
    tactics: {
      mentality: 'attacking',
      width: 9,
      tempo: 10,
      passingStyle: 'mixed',
    },
  },
  {
    id: 'team6',
    name: 'FC Barcelona',
    shortName: 'BAR',
    country: 'Spain',
    league: 'La Liga',
    budget: 150000000,
    reputation: 5,
    players: createSquad('Barcelona'),
    formation: Formation.F_4_3_3,
    tactics: {
      mentality: 'attacking',
      width: 7,
      tempo: 7,
      passingStyle: 'short',
    },
  },
];
