import { Calendar, Clock, MapPin, Star, Trophy } from 'lucide-react';

import Card from '../common/Card';
import Badge from '../common/Badge';

const STATUS_TONE = {
  live: 'live',
  upcoming: 'upcoming',
  completed: 'completed',
};

const STATUS_LABEL = {
  live: 'Live',
  upcoming: 'Upcoming',
  completed: 'Full Time',
};

/**
 * match shape:
 * {
 *   id, round, date, time, venue, status: 'live'|'upcoming'|'completed',
 *   homeTeam: { name, logo }, awayTeam: { name, logo },
 *   homeScore?, awayScore?, motm? // Man of the Match, results only
 * }
 */

export default function MatchCard({ match, showRound = true }) {
  const {
    round,
    date,
    time,
    venue,
    status,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    motm,
  } = match;

  const isCompleted = status === 'completed';
  const isFinal = round === 'Final';

  return (
    <Card
      className={
        isFinal
          ? 'relative overflow-hidden p-5 border-2 border-gold-500/70 bg-gradient-to-br from-pitch-950 via-pitch-900 to-black shadow-[0_0_30px_rgba(212,175,55,0.25)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all duration-300'
          : 'p-5'
      }
    >
      {isFinal && (
        <>
          {/* Golden glow */}
          <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />

          {/* Top championship line */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

          {/* Final label */}
          <div className="relative flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
              <Trophy size={12} />
              The Grand Final
            </span>
          </div>
        </>
      )}

      <div className="flex items-center justify-between mb-4">
        {showRound && !isFinal && (
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {round}
          </span>
        )}

        {showRound && isFinal && <span />}

        <Badge tone={STATUS_TONE[status]}>
          {STATUS_LABEL[status]}
        </Badge>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamBlock
          team={homeTeam}
          align="right"
          isFinal={isFinal}
        />

        <div className="flex flex-col items-center min-w-[64px]">
          {isCompleted || status === 'live' ? (
            <span
              className={
                isFinal
                  ? 'font-display text-3xl text-gold-400 drop-shadow-[0_0_10px_rgba(212,175,55,0.35)]'
                  : 'font-display text-2xl text-ink dark:text-chalk-50'
              }
            >
              {homeScore}{' '}
              <span
                className={
                  isFinal
                    ? 'text-gold-500/60 mx-0.5'
                    : 'text-slate-400 mx-0.5'
                }
              >
                -
              </span>{' '}
              {awayScore}
            </span>
          ) : (
            <span
              className={
                isFinal
                  ? 'font-mono text-sm font-bold text-gold-400'
                  : 'font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400'
              }
            >
              {time}
            </span>
          )}

          {isFinal && (
            <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-gold-500/70">
              Championship
            </span>
          )}
        </div>

        <TeamBlock
          team={awayTeam}
          align="left"
          isFinal={isFinal}
        />
      </div>

      <div
        className={
          isFinal
            ? 'mt-4 pt-4 border-t border-dashed border-gold-500/20 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400'
            : 'mt-4 pt-4 border-t border-dashed border-black/[0.08] dark:border-white/[0.08] flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400'
        }
      >
        <span className="flex items-center gap-1.5">
          <Calendar
            size={13}
            className={isFinal ? 'text-gold-500/80' : ''}
          />
          {date}
        </span>

        <span className="flex items-center gap-1.5">
          <Clock
            size={13}
            className={isFinal ? 'text-gold-500/80' : ''}
          />
          {time}
        </span>

        <span className="flex items-center gap-1.5">
          <MapPin
            size={13}
            className={isFinal ? 'text-gold-500/80' : ''}
          />
          {venue}
        </span>

        {motm && (
          <span className="flex items-center gap-1.5 text-gold-600 dark:text-gold-400">
            <Star size={13} />
            {motm}
          </span>
        )}
      </div>
    </Card>
  );
}

function TeamBlock({ team, align, isFinal }) {
  const isRight = align === 'right';

  return (
    <div
      className={`flex items-center gap-2.5 min-w-0 ${
        isRight ? 'flex-row-reverse text-right' : 'text-left'
      }`}
    >
      <span
        className={
          isFinal
            ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 font-display text-xs border-2 border-gold-500/60 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
            : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-pitch-800 text-emerald-700 dark:text-emerald-400 font-display text-xs border-2 border-dashed border-emerald-500/40'
        }
      >
        {team.name.slice(0, 2).toUpperCase()}
      </span>

      <span
  className={
    isFinal
      ? 'text-sm font-bold text-gold-400 leading-tight break-words'
      : 'text-sm font-semibold text-ink dark:text-chalk-50 leading-tight break-words'
  }
>
  {team.name}
</span>
    </div>
  );
}