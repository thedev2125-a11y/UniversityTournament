import PageTransition from '../components/common/PageTransition';
import PageHero from '../components/common/PageHero';
import SectionTitle from '../components/common/SectionTitle';
import StandingsTable from '../components/standings/StandingsTable';
import Bracket from '../components/fixtures/Bracket';

import { useData } from '../hooks/useData';
import { getTeamsByGroup } from '../utils/tournamentStats';

export default function Standings() {
  const {
    teamsWithStats,
    fixturesDisplay,
  } = useData();

  const groupA = getTeamsByGroup(teamsWithStats, 'A');
  const groupB = getTeamsByGroup(teamsWithStats, 'B');

  return (
    <PageTransition>
      <PageHero
        eyebrow="Tournament Standings"
        title="Standings"
        subtitle="Group-stage standings and the road to the Final."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* GROUP A */}
        <section>
          <SectionTitle
            eyebrow="Group A"
            title="Standings — Group A"
          />

          <StandingsTable teams={groupA} />
        </section>

        {/* GROUP B */}
        <section>
          <SectionTitle
            eyebrow="Group B"
            title="Standings — Group B"
          />

          <StandingsTable teams={groupB} />
        </section>

        {/* QUALIFICATION NOTE */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="h-3 w-3 rounded-sm bg-emerald-500/60 dark:bg-white" />

          Highlighted rows qualify for the knockout stage.
        </div>

        {/* KNOCKOUT STAGE */}
        <section className="space-y-6 pt-4">
          <SectionTitle
            eyebrow="Knockout Stage"
            title="Road to the Final"
          />

          <Bracket fixtures={fixturesDisplay} />
        </section>

      </div>
    </PageTransition>
  );
}