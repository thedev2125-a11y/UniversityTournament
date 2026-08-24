import Card from '../common/Card';
import Badge from '../common/Badge';
import { Clock, Trophy } from 'lucide-react';

/**
 * Knockout bracket structure
 *
 * Quarter Finals:
 * QF1 = 1A vs 4B
 * QF2 = 2A vs 3B
 * QF3 = 1B vs 4A
 * QF4 = 2B vs 3A
 *
 * Semi Finals:
 * SF1 = Winner QF1 vs Winner QF4
 * SF2 = Winner QF3 vs Winner QF2
 *
 * Final:
 * Winner SF1 vs Winner SF2
 */

export default function Bracket({ fixtures }) {
  const quarters = fixtures.filter(
    (match) => match.round === 'Quarter Final'
  );

  const semis = fixtures.filter(
    (match) => match.round === 'Semi Final'
  );

  const final = fixtures.find(
    (match) => match.round === 'Final'
  );

  /*
   * Current fixture ordering:
   *
   * QF1 → 1A vs 4B
   * QF2 → 2A vs 3B
   * QF3 → 1B vs 4A
   * QF4 → 2B vs 3A
   */
  const qf1 = quarters[0];
  const qf2 = quarters[1];
  const qf3 = quarters[2];
  const qf4 = quarters[3];

  /*
   * Semi Finals:
   *
   * SF1 → Winner QF1 vs Winner QF4
   * SF2 → Winner QF3 vs Winner QF2
   */
  const sf1 = semis[0];
  const sf2 = semis[1];

  const isFinalPlayed =
    final?.status === 'completed' &&
    final.homeScore != null &&
    final.awayScore != null;

  const champion = isFinalPlayed
    ? getWinner(final)
    : null;

  return (
    <div className="w-full">

      {/* =====================================================
          DESKTOP BRACKET
          ===================================================== */}

      <div className="hidden lg:block w-full overflow-x-auto pb-4">
        <div className="min-w-[1050px] rounded-[var(--radius-card)] bg-white dark:bg-pitch-900 p-6 lg:p-8">

          {/* Column headings */}
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-10 mb-8">
            <BracketHeading title="Quarter Finals" />
            <BracketHeading title="Semi Finals" />
            <BracketHeading title="Final" />
          </div>

          {/* Bracket */}
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-10 items-center">

            {/* =========================
                QUARTER FINALS
            ========================== */}

            <div className="grid grid-rows-4 gap-8">

              <BracketSlot
                match={qf1}
                label="QF1"
                fallbackHome="1A"
                fallbackAway="4B"
              />

              <BracketSlot
                match={qf2}
                label="QF2"
                fallbackHome="2A"
                fallbackAway="3B"
              />

              <BracketSlot
                match={qf3}
                label="QF3"
                fallbackHome="1B"
                fallbackAway="4A"
              />

              <BracketSlot
                match={qf4}
                label="QF4"
                fallbackHome="2B"
                fallbackAway="3A"
              />

            </div>

            {/* =========================
                SEMI FINALS
            ========================== */}

            <div className="flex flex-col justify-center gap-24">

              <BracketSlot
                match={sf1}
                label="SF1"
                fallbackHome={
                  getWinnerName(qf1) || 'Winner QF1'
                }
                fallbackAway={
                  getWinnerName(qf4) || 'Winner QF4'
                }
              />

              <BracketSlot
                match={sf2}
                label="SF2"
                fallbackHome={
                  getWinnerName(qf3) || 'Winner QF3'
                }
                fallbackAway={
                  getWinnerName(qf2) || 'Winner QF2'
                }
              />

            </div>

            {/* =========================
                FINAL + CHAMPION
            ========================== */}

            <div className="flex flex-col items-center justify-center gap-6">

              {final ? (
                <BracketSlot
                  match={final}
                  label="Final"
                  highlight
                  fallbackHome={
                    getWinnerName(sf1) || 'Winner SF1'
                  }
                  fallbackAway={
                    getWinnerName(sf2) || 'Winner SF2'
                  }
                />
              ) : (
                <BracketPlaceholder
                  label="Final"
                  home="Winner SF1"
                  away="Winner SF2"
                />
              )}

              <ChampionCard champion={champion} />

            </div>

          </div>
        </div>
      </div>


      {/* =====================================================
          MOBILE BRACKET
          ===================================================== */}

      <div className="lg:hidden w-full">

        <div className="rounded-[var(--radius-card)] bg-white dark:bg-pitch-900 p-3 sm:p-4">

          {/* =========================
              QUARTER FINALS
          ========================== */}

          <MobileRoundTitle title="Quarter Finals" />

          <div className="grid grid-cols-2 gap-3">

            <BracketSlot
              match={qf1}
              label="QF1"
              fallbackHome="1A"
              fallbackAway="4B"
              compact
            />

            <BracketSlot
              match={qf2}
              label="QF2"
              fallbackHome="2A"
              fallbackAway="3B"
              compact
            />

            <BracketSlot
              match={qf3}
              label="QF3"
              fallbackHome="1B"
              fallbackAway="4A"
              compact
            />

            <BracketSlot
              match={qf4}
              label="QF4"
              fallbackHome="2B"
              fallbackAway="3A"
              compact
            />

          </div>


          {/* Connector */}
          <MobileConnector />


          {/* =========================
              SEMI FINALS
          ========================== */}

          <MobileRoundTitle title="Semi Finals" />

          <div className="grid grid-cols-2 gap-5 items-center">

            <BracketSlot
              match={sf1}
              label="SF1"
              fallbackHome={
                getWinnerName(qf1) || 'Winner QF1'
              }
              fallbackAway={
                getWinnerName(qf4) || 'Winner QF4'
              }
              compact
            />

            <BracketSlot
              match={sf2}
              label="SF2"
              fallbackHome={
                getWinnerName(qf3) || 'Winner QF3'
              }
              fallbackAway={
                getWinnerName(qf2) || 'Winner QF2'
              }
              compact
            />

          </div>


          {/* Connector */}
          <MobileConnector />


          {/* =========================
              FINAL
          ========================== */}

          <MobileRoundTitle title="Final" />

          <div className="flex justify-center">

            {final ? (
              <div className="w-[180px] max-w-full">

                <BracketSlot
                  match={final}
                  label="Final"
                  highlight
                  fallbackHome={
                    getWinnerName(sf1) || 'Winner SF1'
                  }
                  fallbackAway={
                    getWinnerName(sf2) || 'Winner SF2'
                  }
                  compact
                />

              </div>
            ) : (
              <div className="w-[180px] max-w-full">

                <BracketPlaceholder
                  label="Final"
                  home="Winner SF1"
                  away="Winner SF2"
                  compact
                />

              </div>
            )}

          </div>


          {/* Connector */}
          <MobileConnector />


          {/* =========================
              CHAMPION
          ========================== */}

          <div className="flex justify-center">

            <div className="w-full max-w-[240px]">
              <ChampionCard champion={champion} />
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}


/* =========================================================
   BRACKET HEADING
========================================================= */

function BracketHeading({ title }) {
  return (
    <div className="text-center">

      <span className="font-display text-sm uppercase tracking-[0.18em] text-ink dark:text-chalk-100">
        {title}
      </span>

    </div>
  );
}


/* =========================================================
   MOBILE ROUND TITLE
========================================================= */

function MobileRoundTitle({ title }) {
  return (
    <div className="flex items-center gap-3 my-5">

      <div className="h-px flex-1 bg-slate-500/20" />

      <span className="font-display text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {title}
      </span>

      <div className="h-px flex-1 bg-slate-500/20" />

    </div>
  );
}


/* =========================================================
   MOBILE CONNECTOR
========================================================= */

function MobileConnector() {
  return (
    <div className="flex justify-center py-3">

      <div className="h-8 w-px bg-slate-500/30" />

    </div>
  );
}


/* =========================================================
   BRACKET SLOT
========================================================= */

function BracketSlot({
  match,
  label,
  fallbackHome,
  fallbackAway,
  highlight = false,
  compact = false,
}) {
  if (!match) {
    return (
      <BracketPlaceholder
        label={label}
        home={fallbackHome}
        away={fallbackAway}
        compact={compact}
      />
    );
  }

  return (
    <div className="relative">

      <Card
        hover={false}
        className={[
          'w-full',
          compact ? 'p-2.5' : 'p-4',
          highlight
            ? 'border-gold-500/40 bg-gradient-to-br from-gold-500/10 to-transparent'
            : '',
        ].join(' ')}
      >

        {/* Match header */}
        <div className="flex items-center justify-between mb-2 gap-1">

          <span
            className={
              compact
                ? 'font-mono text-[8px] uppercase tracking-widest text-slate-500 dark:text-slate-400'
                : 'font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400'
            }
          >
            {label}
          </span>

          <Badge
            tone={
              match.status === 'completed'
                ? 'completed'
                : match.status === 'live'
                  ? 'live'
                  : 'upcoming'
            }
          >
            {match.status === 'completed'
              ? 'FT'
              : match.status === 'live'
                ? 'Live'
                : match.date || 'TBD'}
          </Badge>

        </div>


        {/* Time */}
        <div
          className={[
            'flex items-center gap-1.5 text-slate-500 dark:text-slate-400',
            compact ? 'mb-2 text-[9px]' : 'mb-3 text-xs',
          ].join(' ')}
        >
          <Clock size={compact ? 10 : 13} />

          <span>
            {match.time || 'TBD'}
          </span>
        </div>


        {/* Teams */}
        <div className={compact ? 'space-y-1.5' : 'space-y-2'}>

          <TeamRow
            name={
              match.homeTeam?.name ||
              fallbackHome ||
              'TBD'
            }
            score={match.homeScore}
            showScore={match.status === 'completed'}
            winner={
              match.status === 'completed'
                ? isHomeWinner(match)
                : false
            }
            compact={compact}
          />

          <TeamRow
            name={
              match.awayTeam?.name ||
              fallbackAway ||
              'TBD'
            }
            score={match.awayScore}
            showScore={match.status === 'completed'}
            winner={
              match.status === 'completed'
                ? isAwayWinner(match)
                : false
            }
            compact={compact}
          />

        </div>

      </Card>

    </div>
  );
}


/* =========================================================
   PLACEHOLDER
========================================================= */

function BracketPlaceholder({
  label,
  home,
  away,
  compact = false,
}) {
  return (
    <Card
      hover={false}
      className={[
        'w-full border-dashed border-slate-400/30',
        compact ? 'p-2.5' : 'p-4',
      ].join(' ')}
    >

      <div className="flex items-center justify-between mb-3 gap-1">

        <span
          className={
            compact
              ? 'font-mono text-[8px] uppercase tracking-widest text-slate-500 dark:text-slate-400'
              : 'font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400'
          }
        >
          {label}
        </span>

        <Badge tone="upcoming">
          TBD
        </Badge>

      </div>


      <div className={compact ? 'space-y-1.5' : 'space-y-2'}>

        <TeamRow
          name={home || 'TBD'}
          compact={compact}
        />

        <TeamRow
          name={away || 'TBD'}
          compact={compact}
        />

      </div>

    </Card>
  );
}


/* =========================================================
   TEAM ROW
========================================================= */

function TeamRow({
  name,
  score,
  showScore = false,
  winner = false,
  compact = false,
}) {
  return (
    <div className="flex items-center justify-between gap-1.5">

      <span
        className={[
          'font-semibold truncate',
          compact ? 'text-[10px]' : 'text-sm',
          winner
            ? 'text-emerald-700 dark:text-emerald-400'
            : 'text-ink dark:text-chalk-50',
        ].join(' ')}
      >
        {name}
      </span>


      {showScore && (
        <span
          className={[
            'font-mono shrink-0',
            compact ? 'text-[10px]' : 'text-sm',
            winner
              ? 'font-bold text-emerald-700 dark:text-emerald-400'
              : 'text-ink dark:text-chalk-50',
          ].join(' ')}
        >
          {score}
        </span>
      )}

    </div>
  );
}


/* =========================================================
   CHAMPION
========================================================= */

function ChampionCard({ champion }) {
  return (
    <Card
      hover={false}
      className="w-full p-5 flex flex-col items-center gap-2 text-center bg-gradient-to-br from-gold-500/10 to-transparent"
    >

      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400">
        <Trophy size={20} />
      </span>


      {champion ? (
        <>
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Champion
          </span>

          <span className="font-display text-xl text-ink dark:text-chalk-50">
            {champion}
          </span>
        </>
      ) : (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          The champion will be crowned after the Final.
        </span>
      )}

    </Card>
  );
}


/* =========================================================
   WINNER HELPERS
========================================================= */

function getWinner(match) {
  if (
    !match ||
    match.status !== 'completed' ||
    match.homeScore == null ||
    match.awayScore == null
  ) {
    return null;
  }


  if (match.homeScore > match.awayScore) {
    return match.homeTeam?.name || null;
  }


  if (match.awayScore > match.homeScore) {
    return match.awayTeam?.name || null;
  }


  /*
   * A draw in a knockout match requires a penalty/winner field.
   *
   * We intentionally don't guess the winner here.
   */
  return null;
}


function getWinnerName(match) {
  return getWinner(match);
}


function isHomeWinner(match) {
  return (
    match.homeScore != null &&
    match.awayScore != null &&
    match.homeScore > match.awayScore
  );
}


function isAwayWinner(match) {
  return (
    match.homeScore != null &&
    match.awayScore != null &&
    match.awayScore > match.homeScore
  );
}