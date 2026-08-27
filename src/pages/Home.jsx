import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';
import {
  Users,
  Trophy,
  Goal,
  CalendarDays,
  ArrowRight,
  CircleDot,
} from 'lucide-react';

import PageTransition from '../components/common/PageTransition';
import SectionTitle from '../components/common/SectionTitle';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import StatCard from '../components/cards/StatCard';
import MatchCard from '../components/fixtures/MatchCard';
import Countdown from '../components/fixtures/Countdown';
import NewsCard from '../components/news/NewsCard';
import GalleryCard from '../components/gallery/GalleryCard';
import StandingsTable from '../components/standings/StandingsTable';

import { useData } from '../hooks/useData';
import { formatDisplayDate } from '../utils/computeStats';

import {
  getTeamsByGroup,
  getTopScorers,
  getFeaturedMatch,
  getUpcomingFixtures,
  getByeTeams,
  isGroupStageRound,
} from '../utils/tournamentStats';

export default function Home() {
  useEffect(() => {
    async function testSupabase() {
      const { data, error } = await supabase
        .from('teams')
        .select('*');

      console.log('Supabase teams:', data);
      console.log('Supabase error:', error);
    }

    testSupabase();
  }, []);

  const {
    teamsWithStats: teams,
    playersWithStats: players,
    fixturesDisplay: fixtures,
    resultsDisplay: results,
    news: newsRaw,
    gallery,
    sponsors,
  } = useData();

  const news = [...newsRaw]
    .map((a) => ({
      ...a,
      date: formatDisplayDate(a.publishedAt),
    }))
    .sort((a, b) =>
      a.publishedAt < b.publishedAt ? 1 : -1
    );

  const featuredMatch = getFeaturedMatch(fixtures);
  const thisWeek = getUpcomingFixtures(fixtures, 4);
  const topScorers = getTopScorers(players, 3);

  const standingsA = getTeamsByGroup(teams, 'A').slice(0, 3);
  const standingsB = getTeamsByGroup(teams, 'B').slice(0, 3);

  const byeTeams =
    featuredMatch && isGroupStageRound(featuredMatch.round)
      ? getByeTeams(
          teams,
          fixtures,
          featuredMatch.round
        )
      : [];

  const totalGoals = players.reduce(
    (s, p) => s + p.goals,
    0
  );

  const matchesPlayed = results.length;

  /*
   * ---------------------------------------------------------
   * CHAMPION DETECTION
   * ---------------------------------------------------------
   *
   * The championship hero appears only when:
   * 1. The Final exists
   * 2. The Final is completed
   * 3. The Final has a winner
   */

  const finalMatch = results.find(
    (match) =>
      match.round === 'Final' &&
      match.status === 'completed'
  );

  const champion =
    finalMatch &&
    finalMatch.homeScore !== undefined &&
    finalMatch.awayScore !== undefined &&
    finalMatch.homeScore !== finalMatch.awayScore
      ? finalMatch.homeScore > finalMatch.awayScore
        ? finalMatch.homeTeam
        : finalMatch.awayTeam
      : null;

  const tournamentFinished = Boolean(
    finalMatch && champion
  );

  return (
    <PageTransition>

      {/* =====================================================
          HERO
      ===================================================== */}

      {tournamentFinished ? (

        /* ---------------------------------------------------
           CHAMPIONSHIP HERO
        --------------------------------------------------- */

        <section className="relative min-h-[650px] overflow-hidden bg-pitch-950">

          {/* Championship image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/Bedr Cup 2026 Champions Celebration.png')",
            }}
          />

          {/* Main dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-pitch-950/95 via-pitch-950/70 to-pitch-950" />

          {/* Side emerald atmosphere */}
          <div className="absolute inset-0 bg-emerald-950/30" />

          {/* Golden central glow */}
          <div className="absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-gold-500/20 blur-[110px]" />

          {/* Subtle stadium grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)',
            }}
          />

          {/* Gold top border */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

          {/* Hero content */}
          <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">

            <div className="w-full max-w-5xl text-center">

              {/* Tournament badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-500/50 bg-gold-500/10 px-4 py-2 backdrop-blur-sm">
                <Trophy
                  size={16}
                  className="text-gold-400"
                />

                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
                  Bedr Cup 2026
                </span>
              </div>

              {/* Champions title */}
              <h1 className="font-display text-6xl font-bold uppercase tracking-[0.08em] text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.7)] sm:text-7xl md:text-8xl">
                Champions
              </h1>

              {/* Gold divider */}
              <div className="mx-auto my-5 flex items-center justify-center gap-3">
                <span className="h-px w-12 bg-gold-500/60 sm:w-20" />

                <Trophy
                  size={24}
                  className="text-gold-400"
                />

                <span className="h-px w-12 bg-gold-500/60 sm:w-20" />
              </div>

              {/* Champion team name */}
              <h2 className="font-display text-3xl font-bold tracking-wide text-gold-400 drop-shadow-[0_0_18px_rgba(212,175,55,0.45)] sm:text-4xl md:text-5xl">
                {champion.name}
              </h2>

              {/* Championship photo */}
              <div className="relative mx-auto mt-8 w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-gold-500/60 bg-pitch-950/60 shadow-[0_0_55px_rgba(212,175,55,0.25)]">

                {/* Image */}
                <img
                  src="/BedrLogo.png"
                  alt={`${champion.name} - Bedr Cup 2026 Champions`}
                  className="h-64 w-full object-cover object-center sm:h-80 md:h-[380px]"
                />

                {/* Image bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-pitch-950/90 to-transparent" />

                {/* Image label */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-5 text-left sm:px-7">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-gold-300">
                    Bedr Cup Champions
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white/90">
                    The champions have been crowned.
                  </p>
                </div>
              </div>

              {/* Final information */}
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-white/70 sm:text-sm">
                September 6, 2026 · The Grand Final
              </p>

              {/* Message */}
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                Congratulations to the champions of
                Bedr Cup 2026.
                <br className="hidden sm:block" />
                <span className="text-gold-400">
                  Unity Through Football.
                </span>
              </p>

              {/* Championship buttons */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">

                <Link to="/results">
                  <Button
                    variant="primary"
                    size="lg"
                  >
                    View Final Results
                  </Button>
                </Link>

                <Link to="/gallery">
                  <Button
                    variant="outline"
                    size="lg"
                  >
                    Championship Gallery
                  </Button>
                </Link>

              </div>

            </div>
          </div>
        </section>

      ) : (

        /* ---------------------------------------------------
           NORMAL TOURNAMENT HERO
        --------------------------------------------------- */

        <section className="relative overflow-hidden bg-gradient-to-br from-pitch-950 via-pitch-900 to-dark-700">

          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)',
            }}
          />

          <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">

            <Badge tone="gold" className="mb-5">
              Jul 19 – Sep 6, 2026 · Jemo 1 And Abichu Community Pitch
            </Badge>

            <h1 className="font-display text-5xl leading-[0.95] tracking-wide text-chalk-50 sm:text-6xl md:text-7xl">
              Bedr Summer
              <br />
              Tournament{' '}
              <span className="text-gold-500">
                2026
              </span>
            </h1>

            <p className="mt-5 font-mono text-sm uppercase tracking-[0.25em] text-emerald-400 sm:text-base">
              Unity Through Football
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">

              <Link to="/fixtures">
                <Button
                  variant="primary"
                  size="lg"
                >
                  View Fixtures
                </Button>
              </Link>

              <Link to="/standings">
                <Button
                  variant="outline"
                  size="lg"
                >
                  View Standings
                </Button>
              </Link>

            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          FEATURED MATCH + COUNTDOWN
          Hidden after tournament completion
      ===================================================== */}

      {featuredMatch && !tournamentFinished && (
        <section className="bg-pitch-900">

          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">

            <div>

              <span className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-chalk-100/60">

                <CircleDot
                  size={13}
                  className="text-emerald-400"
                />

                {featuredMatch.status === 'live'
                  ? "Today's Match"
                  : 'Next Match'}

              </span>

              <div className="max-w-md">
                <MatchCard match={featuredMatch} />
              </div>

            </div>

            <div className="flex flex-col items-center gap-3 lg:items-end">

              <span className="font-mono text-xs uppercase tracking-widest text-chalk-100/60">
                {featuredMatch.status === 'live'
                  ? 'Status'
                  : 'Kicks off in'}
              </span>

              <Countdown match={featuredMatch} />

              {byeTeams.length > 0 && (
                <span className="text-xs text-chalk-100/50">
                  Bye this round:{' '}
                  <span className="font-semibold text-gold-400">
                    {byeTeams
                      .map((t) => t.name)
                      .join(', ')}
                  </span>
                </span>
              )}

            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">

       {/* ---------- This week's matches / Tournament complete ---------- */}

<section>
  {tournamentFinished ? (
    <Card className="relative overflow-hidden border border-gold-500/30 bg-gradient-to-br from-pitch-950 via-pitch-900 to-dark-700 p-8 sm:p-10">

      {/* Golden glow */}
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gold-500/10 blur-3xl" />

      {/* Subtle golden glow on the left */}
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gold-500/5 blur-3xl" />

      <div className="relative text-center">

        {/* Trophy icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10">
          <Trophy
            size={26}
            className="text-gold-400"
          />
        </div>

        {/* Eyebrow */}
        <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
          Tournament Complete
        </p>

        {/* Title */}
        <h2 className="mt-2 font-display text-3xl tracking-wide text-chalk-50 sm:text-4xl">
          Bedr Cup 2026 has come to an end.
        </h2>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Congratulations to the champions and thank you to every
          team, player, supporter, and volunteer who made this
          tournament possible.
        </p>

        {/* Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">

          {/* Top scorers */}
          <Link to="/top-scorers">
            <Button
              variant="primary"
              size="lg"
            >
              Top Scorers
            </Button>
          </Link>

          {/* Champion team */}
          <Link to={`/teams/${champion.id}`}>
            <Button
              variant="outline"
              size="lg"
            >
              Champions Team Statistics
            </Button>
          </Link>

        </div>
      </div>
    </Card>
  ) : (
    <>
      <SectionTitle
        eyebrow="Matchday"
        title="This Week's Matches"
        action={
          <Link
            to="/fixtures"
            className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-all hover:gap-2.5 dark:text-emerald-400"
          >
            All Fixtures
            <ArrowRight size={15} />
          </Link>
        }
      />

      {thisWeek.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {thisWeek.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No matches scheduled this week.
        </p>
      )}
    </>
  )}
</section>

        {/* ---------- Standings preview ---------- */}

        <section>

          <SectionTitle
            eyebrow="Group Stage"
            title="Standings Preview"
            action={
              <Link
                to="/standings"
                className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-all hover:gap-2.5 dark:text-emerald-400"
              >
                Full Standings
                <ArrowRight size={15} />
              </Link>
            }
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            <div>
              <h3 className="mb-3 font-display text-lg tracking-wide text-ink dark:text-chalk-50">
                Group A
              </h3>

              <StandingsTable teams={standingsA} />
            </div>

            <div>
              <h3 className="mb-3 font-display text-lg tracking-wide text-ink dark:text-chalk-50">
                Group B
              </h3>

              <StandingsTable teams={standingsB} />
            </div>

          </div>
        </section>

        {/* ---------- Top scorers preview ---------- */}

        <section>

          <SectionTitle
            eyebrow="Golden Boot Race"
            title="Top Scorers"
            action={
              <Link
                to="/top-scorers"
                className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-all hover:gap-2.5 dark:text-emerald-400"
              >
                Full Rankings
                <ArrowRight size={15} />
              </Link>
            }
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            {topScorers.map((p, i) => (
              <PreviewScorer
                key={p.id}
                player={p}
                rank={i + 1}
              />
            ))}

          </div>
        </section>

        {/* ---------- Latest news ---------- */}

        <section>

          <SectionTitle
            eyebrow="Community"
            title="Latest News"
            action={
              <Link
                to="/news"
                className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-all hover:gap-2.5 dark:text-emerald-400"
              >
                All News
                <ArrowRight size={15} />
              </Link>
            }
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

            {news.slice(0, 3).map((a) => (
              <NewsCard
                key={a.id}
                article={a}
              />
            ))}

          </div>
        </section>

        {/* ---------- Tournament stats ---------- */}

        <section>

          <SectionTitle
            eyebrow="By The Numbers"
            title="Tournament Statistics"
            align="left"
          />

          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">

            <StatCard
              icon={Users}
              value={teams.length}
              label="Teams"
            />

            <StatCard
              icon={Trophy}
              value={players.length}
              label="Players"
            />

            <StatCard
              icon={Goal}
              value={totalGoals}
              label="Goals"
            />

            <StatCard
              icon={CalendarDays}
              value={matchesPlayed}
              label="Matches Played"
            />

          </div>
        </section>

        {/* ---------- Gallery preview ---------- */}

        <section>

          <SectionTitle
            eyebrow="Moments"
            title="Gallery"
            action={
              <Link
                to="/gallery"
                className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-all hover:gap-2.5 dark:text-emerald-400"
              >
                Full Gallery
                <ArrowRight size={15} />
              </Link>
            }
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

            {gallery.slice(0, 4).map((photo) => (
              <GalleryCard
                key={photo.id}
                photo={photo}
              />
            ))}

          </div>
        </section>

        {/* ---------- Sponsors ---------- */}

        <section>

          <SectionTitle
            eyebrow="With Thanks To"
            title="Our Sponsors"
            align="left"
          />

          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">

            {sponsors.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400"
              >

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 font-display text-sm text-gold-600 dark:text-gold-400">
                  {s.logoInitials}
                </span>

                <span className="text-sm font-semibold">
                  {s.name}
                </span>

              </div>
            ))}

          </div>
        </section>

      </div>
    </PageTransition>
  );
}

function PreviewScorer({ player, rank }) {
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <Card className="flex items-center gap-4 p-5">

      <span className="text-2xl">
        {medals[rank - 1]}
      </span>

      <div className="min-w-0 flex-1">

        <h4 className="truncate text-sm font-semibold text-ink dark:text-chalk-50">
          {player.name}
        </h4>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {player.team}
        </p>

      </div>

      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
        {player.goals}G
      </span>

    </Card>
  );
}