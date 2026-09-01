/**
 * Everything in here is a pure function.
 *
 * Group standings use ONLY group-stage rounds.
 * Individual team tournament statistics use ALL completed matches,
 * including Quarter Final, Semi Final and Final.
 */

const GROUP_STAGE_ROUNDS = new Set([
  "Round 1",
  "Round 2",
  "Round 3",
  "Round 4",
  "Round 5",
]);

const KNOCKOUT_ROUNDS = new Set([
  "Quarter Final",
  "Semi Final",
  "Final",
]);

const ALL_MATCH_ROUNDS = new Set([
  ...GROUP_STAGE_ROUNDS,
  ...KNOCKOUT_ROUNDS,
]);

/**
 * ---------------------------------------------------------
 * GROUP STANDINGS
 * ---------------------------------------------------------
 *
 * This is the normal league/group table.
 *
 * IMPORTANT:
 * Quarter Final, Semi Final and Final are NOT included here.
 *
 * This means knockout matches never affect group points or
 * group standings.
 */
export function computeStandings(teams, fixtures) {
  const stats = new Map(
    teams.map((t) => [
      t.id,
      {
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        gf: 0,
        ga: 0,
        points: 0,
      },
    ]),
  );

  fixtures
    .filter(
      (f) =>
        GROUP_STAGE_ROUNDS.has(f.round) &&
        f.status === "completed" &&
        f.homeScore != null &&
        f.awayScore != null,
    )
    .forEach((f) => {
      const home = stats.get(f.homeTeamId);
      const away = stats.get(f.awayTeamId);

      if (!home || !away) return;

      home.played += 1;
      away.played += 1;

      home.gf += Number(f.homeScore);
      home.ga += Number(f.awayScore);

      away.gf += Number(f.awayScore);
      away.ga += Number(f.homeScore);

      if (f.homeScore > f.awayScore) {
        home.wins += 1;
        away.losses += 1;
        home.points += 3;
      } else if (f.homeScore < f.awayScore) {
        away.wins += 1;
        home.losses += 1;
        away.points += 3;
      } else {
        home.draws += 1;
        away.draws += 1;
        home.points += 1;
        away.points += 1;
      }
    });

  return teams.map((t) => {
    const s = stats.get(t.id);

    return {
      ...t,

      played: s.played,
      wins: s.wins,
      draws: s.draws,
      losses: s.losses,

      goalsFor: s.gf,
      goalsAgainst: s.ga,
      goalDifference: s.gf - s.ga,

      points: s.points,

      goals: s.gf,
    };
  });
}

/**
 * ---------------------------------------------------------
 * OVERALL TEAM TOURNAMENT STATISTICS
 * ---------------------------------------------------------
 *
 * This includes:
 *
 * Round 1
 * Round 2
 * Round 3
 * Round 4
 * Round 5
 * Quarter Final
 * Semi Final
 * Final
 *
 * Therefore Team Details can show the team's complete
 * tournament record.
 *
 * Points intentionally remain GROUP-STAGE points because
 * knockout matches do not award league points.
 */
export function computeTeamTournamentStats(teams, fixtures) {
  const stats = new Map(
    teams.map((t) => [
      t.id,
      {
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        gf: 0,
        ga: 0,

        // Points come only from group stage.
        points: 0,

        groupPlayed: 0,
        groupWins: 0,
        groupDraws: 0,
        groupLosses: 0,
        groupGoalsFor: 0,
        groupGoalsAgainst: 0,
        groupPoints: 0,

        knockoutPlayed: 0,
        knockoutWins: 0,
        knockoutDraws: 0,
        knockoutLosses: 0,
        knockoutGoalsFor: 0,
        knockoutGoalsAgainst: 0,
      },
    ]),
  );

  fixtures
    .filter(
      (f) =>
        ALL_MATCH_ROUNDS.has(f.round) &&
        f.status === "completed" &&
        f.homeScore != null &&
        f.awayScore != null,
    )
    .forEach((f) => {
      const home = stats.get(f.homeTeamId);
      const away = stats.get(f.awayTeamId);

      if (!home || !away) return;

      const homeScore = Number(f.homeScore);
      const awayScore = Number(f.awayScore);

      const isGroupStage = GROUP_STAGE_ROUNDS.has(f.round);
      const isKnockout = KNOCKOUT_ROUNDS.has(f.round);

      // -----------------------------------------
      // Overall statistics
      // -----------------------------------------

      home.played += 1;
      away.played += 1;

      home.gf += homeScore;
      home.ga += awayScore;

      away.gf += awayScore;
      away.ga += homeScore;

      if (homeScore > awayScore) {
        home.wins += 1;
        away.losses += 1;
      } else if (homeScore < awayScore) {
        away.wins += 1;
        home.losses += 1;
      } else {
        home.draws += 1;
        away.draws += 1;
      }

      // -----------------------------------------
      // Group-stage statistics
      // -----------------------------------------

      if (isGroupStage) {
        home.groupPlayed += 1;
        away.groupPlayed += 1;

        home.groupGoalsFor += homeScore;
        home.groupGoalsAgainst += awayScore;

        away.groupGoalsFor += awayScore;
        away.groupGoalsAgainst += homeScore;

        if (homeScore > awayScore) {
          home.groupWins += 1;
          away.groupLosses += 1;

          home.groupPoints += 3;
        } else if (homeScore < awayScore) {
          away.groupWins += 1;
          home.groupLosses += 1;

          away.groupPoints += 3;
        } else {
          home.groupDraws += 1;
          away.groupDraws += 1;

          home.groupPoints += 1;
          away.groupPoints += 1;
        }
      }

      // -----------------------------------------
      // Knockout statistics
      // -----------------------------------------

      if (isKnockout) {
        home.knockoutPlayed += 1;
        away.knockoutPlayed += 1;

        home.knockoutGoalsFor += homeScore;
        home.knockoutGoalsAgainst += awayScore;

        away.knockoutGoalsFor += awayScore;
        away.knockoutGoalsAgainst += homeScore;

        if (homeScore > awayScore) {
          home.knockoutWins += 1;
          away.knockoutLosses += 1;
        } else if (homeScore < awayScore) {
          away.knockoutWins += 1;
          home.knockoutLosses += 1;
        } else {
          home.knockoutDraws += 1;
          away.knockoutDraws += 1;
        }
      }
    });

  return teams.map((t) => {
    const s = stats.get(t.id);

    return {
      ...t,

      // Overall tournament record
      played: s.played,
      wins: s.wins,
      draws: s.draws,
      losses: s.losses,

      goalsFor: s.gf,
      goalsAgainst: s.ga,
      goalDifference: s.gf - s.ga,

      // League points remain group-stage points
      points: s.groupPoints,

      goals: s.gf,

      // Explicit group statistics
      groupPlayed: s.groupPlayed,
      groupWins: s.groupWins,
      groupDraws: s.groupDraws,
      groupLosses: s.groupLosses,
      groupGoalsFor: s.groupGoalsFor,
      groupGoalsAgainst: s.groupGoalsAgainst,
      groupGoalDifference:
        s.groupGoalsFor - s.groupGoalsAgainst,
      groupPoints: s.groupPoints,

      // Explicit knockout statistics
      knockoutPlayed: s.knockoutPlayed,
      knockoutWins: s.knockoutWins,
      knockoutDraws: s.knockoutDraws,
      knockoutLosses: s.knockoutLosses,
      knockoutGoalsFor: s.knockoutGoalsFor,
      knockoutGoalsAgainst: s.knockoutGoalsAgainst,
      knockoutGoalDifference:
        s.knockoutGoalsFor - s.knockoutGoalsAgainst,
    };
  });
}

/**
 * ---------------------------------------------------------
 * PLAYER STATISTICS
 * ---------------------------------------------------------
 */

export function computePlayerStats(players, fixtures, teams) {
  const teamNameById = new Map(
    teams.map((t) => [t.id, t.name]),
  );

  const goals = new Map();
  const yellow = new Map();
  const red = new Map();
  const matches = new Map();

  fixtures.forEach((f) => {
    const countsForMatches =
      f.status === "completed" || f.status === "live";

    if (countsForMatches) {
      players
        .filter(
          (p) =>
            p.teamId === f.homeTeamId ||
            p.teamId === f.awayTeamId,
        )
        .forEach((p) => {
          matches.set(
            p.id,
            (matches.get(p.id) || 0) + 1,
          );
        });
    }

    (f.goals || []).forEach((g) => {
      goals.set(
        g.playerId,
        (goals.get(g.playerId) || 0) + 1,
      );
    });

    (f.cards || []).forEach((c) => {
      const map =
        c.cardType === "red" ? red : yellow;

      map.set(
        c.playerId,
        (map.get(c.playerId) || 0) + 1,
      );
    });
  });

  return players.map((p) => ({
    ...p,

    team: teamNameById.get(p.teamId) || "",

    goals: goals.get(p.id) || 0,

    matches: matches.get(p.id) || 0,

    yellowCards: yellow.get(p.id) || 0,

    redCards: red.get(p.id) || 0,
  }));
}

/**
 * ---------------------------------------------------------
 * FIXTURE DISPLAY
 * ---------------------------------------------------------
 */

export function computeFixtureDisplay(
  fixtures,
  teams,
  players,
) {
  const teamById = new Map(
    teams.map((t) => [t.id, t]),
  );

  const playerById = new Map(
    players.map((p) => [p.id, p]),
  );

  return fixtures.map((f) => {
    const home = teamById.get(f.homeTeamId);
    const away = teamById.get(f.awayTeamId);

    const motmPlayer = f.motmPlayerId
      ? playerById.get(f.motmPlayerId)
      : null;

    const goalScorers = (f.goals || [])
      .map((g) => {
        const player = playerById.get(g.playerId);
        const team = teamById.get(g.teamId);

        return player && team
          ? `${player.name} (${team.name})`
          : null;
      })
      .filter(Boolean);

    return {
      id: f.id,

      round: f.round,

      date: formatDisplayDate(f.date),

      time: f.time,

      venue: f.venue,

      status: f.status,

      homeTeam: home
        ? {
            id: home.id,
            name: home.name,
            group: home.group,
          }
        : {
            id: f.homeTeamId,
            name: "TBD",
          },

      awayTeam: away
        ? {
            id: away.id,
            name: away.name,
            group: away.group,
          }
        : {
            id: f.awayTeamId,
            name: "TBD",
          },

      homeScore: f.homeScore ?? undefined,

      awayScore: f.awayScore ?? undefined,

      motm: motmPlayer
        ? motmPlayer.name
        : undefined,

      goalScorers:
        goalScorers.length
          ? goalScorers
          : undefined,

      rawDate: f.date,
    };
  });
}

/**
 * ---------------------------------------------------------
 * DATE FORMAT
 * ---------------------------------------------------------
 */

export function formatDisplayDate(isoDate) {
  if (!isoDate) return "";

  const d = new Date(`${isoDate}T00:00:00`);

  if (isNaN(d.getTime())) {
    return isoDate;
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}