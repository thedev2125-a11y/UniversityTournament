/**
 * Pure helper functions that derive view-ready data from the raw JSON
 * "database". Keeping this logic here (instead of inline in pages) means
 * every page that needs, say, group standings, computes it the same way.
 */

export function getTeamsByGroup(teams, group) {
  return teams
    .filter((t) => t.group === group)
    .slice()
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor
    );
}

export function getTopScorers(players, limit = 100) {
  return players
    .filter((p) => p.goals > 0)
    .slice()
    .sort(
      (a, b) =>
        b.goals - a.goals ||
        a.yellowCards - b.yellowCards
    )
    .slice(0, limit);
}

export function getPlayersByTeamId(players, teamId) {
  return players.filter((p) => p.teamId === teamId);
}

export function getResultsByTeamId(results, teamId) {
  return results.filter(
    (m) =>
      m.homeTeam.id === teamId ||
      m.awayTeam.id === teamId
  );
}

export function getFixturesByTeamId(fixtures, teamId) {
  return fixtures.filter(
    (m) =>
      m.homeTeam.id === teamId ||
      m.awayTeam.id === teamId
  );
}

export function getNextMatchForTeam(fixtures, teamId) {
  return fixtures.find(
    (m) =>
      (m.homeTeam.id === teamId ||
        m.awayTeam.id === teamId) &&
      (m.status === "upcoming" || m.status === "live")
  );
}

export function getUpcomingFixtures(fixtures, limit = 100) {
  return fixtures
    .filter((m) => m.status === "upcoming")
    .slice(0, limit);
}

export function getLiveFixtures(fixtures) {
  return fixtures.filter((m) => m.status === "live");
}

/**
 * Returns the earliest upcoming (or currently live) match — used for the
 * homepage hero card and the countdown timer.
 */
export function getFeaturedMatch(fixtures) {
  const live = getLiveFixtures(fixtures);

  if (live.length) return live[0];

  return (
    fixtures.find((m) => m.status === "upcoming") || null
  );
}

/**
 * Groups fixtures by their `round` label and always displays
 * rounds in tournament order:
 *
 * Round 1
 * Round 2
 * Round 3
 * Round 4
 * Round 5
 * Quarter Final
 * Semi Final
 * Final
 */
export function groupByRound(fixtures) {
  const roundOrder = {
    "Quarter Final": 100,
    "Semi Final": 110,
    Final: 120,
  };

  const getRoundOrder = (round) => {
    if (roundOrder[round] !== undefined) {
      return roundOrder[round];
    }

    const match = round.match(/Round\s+(\d+)/i);

    if (match) {
      return Number(match[1]);
    }

    return 0;
  };

  const map = {};

  fixtures.forEach((match) => {
    const round = match.round || "Unknown";

    if (!map[round]) {
      map[round] = [];
    }

    map[round].push(match);
  });

  return Object.entries(map)
    .sort(([roundA], [roundB]) => {
      return (
        getRoundOrder(roundA) -
        getRoundOrder(roundB)
      );
    })
    .map(([round, matches]) => ({
      round,
      matches,
    }));
}

/**
 * The team(s) sitting out in a given round — used for the "Bye Team" widget.
 * Only meaningful for the 5-team group rounds (Round 1–5).
 */
export function getByeTeams(teams, fixtures, round) {
  const playingIds = new Set();

  fixtures
    .filter((m) => m.round === round)
    .forEach((m) => {
      playingIds.add(m.homeTeam.id);
      playingIds.add(m.awayTeam.id);
    });

  return teams.filter(
    (t) =>
      !playingIds.has(t.id) &&
      !t.id.startsWith("tbd")
  );
}

export function parseMatchDate(dateStr, timeStr) {
  // dateStr: "Jul 21, 2026", timeStr: "3:00 PM"
  const combined = `${dateStr} ${timeStr}`;
  const d = new Date(combined);

  return isNaN(d.getTime()) ? null : d;
}

export function isGroupStageRound(round) {
  return ![
    "Quarter Final",
    "Semi Final",
    "Final",
  ].includes(round);
}