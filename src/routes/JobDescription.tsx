import { memo, type FC } from 'react'
import Meta from '../components/Meta'
import type { WindowComponentProps } from '../types/window'
import { Badge } from '../components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Button, Frame } from 'react95'
import { motion } from 'framer-motion'
import { useWindowManager } from '../contexts/WindowManagerContext'
import { raised, sunken } from '../utils/win95'
import {
  BugIcon,
  CoffeeIcon,
  ShieldCheckIcon,
  TrophyIcon,
  UsersIcon,
  ZapIcon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const metaDescription =
  'Join the Bug Basher squad to squash pixel pests, earn bounties, and keep our retroverse stable.'

type Highlight = {
  icon: LucideIcon
  title: string
  description: string
}

const HIGHLIGHTS: Highlight[] = [
  {
    icon: ZapIcon,
    title: 'Arcade-paced missions',
    description:
      'Drop into timed raids to squash waves of pixel critters and stack bounty combos.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Pro-grade toolkit',
    description:
      'Gear up with experimental debuggers, squad dashboards, and QA gadgets built for speed.',
  },
  {
    icon: CoffeeIcon,
    title: 'Remote & async',
    description:
      'Pick raid slots that match your timezone — the guild runs 24/7 with plenty of coffee breaks.',
  },
]

const RESPONSIBILITIES: string[] = [
  'Triage incoming reports from the Bug Dashboard and target the bounties that matter most.',
  'Lead daily extermination runs inside the Bug Basher arena while keeping combo streaks alive.',
  'Swap tactics with fellow hunters, sharing GIF-worthy discoveries and countermeasures.',
  'Document your victories with concise repro steps so the next recruit knows exactly where to aim.',
  'Stress-test top-secret features before release to ensure the retroverse stays glitch-free.',
]

const QUALITIES: string[] = [
  'Calm under flashing error lights with a knack for turning chaos into action items.',
  'Able to explain a repro in three sentences or less — bonus points for screenshots.',
  'Comfortable navigating vintage interfaces, shortcuts, and quirky dev tools.',
  'Believe documentation, teamwork, and memes can peacefully coexist.',
]

const PERKS: string[] = [
  'Leaderboard bonuses and bounty multipliers for every flawless streak.',
  'Unlimited virtual PTO (Pixel Time Off) to recharge those clicking fingers.',
  'Quarterly retro swag drops plus access to the premium sticker archive.',
  'Invite-only bug bash events packed with surprise mini-games.',
]

const JobDescription: FC<WindowComponentProps> = () => {
  const { openWindow } = useWindowManager()

  return (
    <>
      <Meta
        title="Bug Basher Job Description"
        description={metaDescription}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title: 'Bug Basher',
          description: metaDescription,
          employmentType: 'Contract',
          jobLocationType: 'Remote',
          applicantLocationRequirements: 'Worldwide',
          hiringOrganization: {
            '@type': 'Organization',
            name: 'Bug Basher Guild',
          },
          responsibilities: RESPONSIBILITIES,
          qualifications: QUALITIES,
          benefits: PERKS,
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-[#E0E0E0] shadow-sm">
          <CardHeader className="space-y-4 border-b border-[#C0C0C0]">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">Bug Basher</CardTitle>
                <CardDescription className="mt-1 text-base">
                  Keep our retroverse stable by leading high-energy hunts and
                  taming glitchy foes.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="default"
                  className="border-[#000080] bg-[#000080] text-white"
                >
                  Recruiting Now
                </Badge>
                <Badge
                  variant="outline"
                  className="border-[#000080] bg-white text-[#000080]"
                >
                  Remote Friendly
                </Badge>
                <Badge
                  variant="outline"
                  className="border-[#000080] bg-white text-[#000080]"
                >
                  Flexible Hours
                </Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-800">
              <span>Squad: Bug Hunter Guild</span>
              <span className="hidden text-gray-500 md:inline">•</span>
              <span>Reports to: Chief Exterminator</span>
              <span className="hidden text-gray-500 md:inline">•</span>
              <span>Level: Mid to Senior</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {HIGHLIGHTS.map(highlight => (
                <Frame
                  key={highlight.title}
                  className={`${raised} bg-white/80 p-4`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#000080]">
                    <highlight.icon className="h-4 w-4" />
                    <span>{highlight.title}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-700">
                    {highlight.description}
                  </p>
                </Frame>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <section>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-[#000080]">
                    <BugIcon className="h-5 w-5" />
                    What you'll do
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-800">
                    {RESPONSIBILITIES.map(responsibility => (
                      <li key={responsibility} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#000080]" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-[#000080]">
                    <UsersIcon className="h-5 w-5" />
                    What we're looking for
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-800">
                    {QUALITIES.map(quality => (
                      <li key={quality} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#000080]" />
                        <span>{quality}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
              <aside className="space-y-4">
                <Frame className={`${sunken} bg-white/80 p-4`}>
                  <h3 className="flex items-center gap-2 text-base font-semibold text-[#000080]">
                    <TrophyIcon className="h-5 w-5" />
                    Perks & Rewards
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-800">
                    {PERKS.map(perk => (
                      <li key={perk} className="flex gap-2">
                        <span className="text-[#000080]">✶</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </Frame>
                <Frame className={`${raised} space-y-3 bg-[#F4F4F4] p-4`}>
                  <h3 className="text-base font-semibold text-[#000080]">
                    Ready to apply?
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-800">
                    Drop your handle and join the guild. We'll line up a trial
                    run in the arena.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button primary onClick={() => openWindow('signUp')}>
                      Apply Now
                    </Button>
                    <Button onClick={() => openWindow('leaderboard')}>
                      View Leaderboard
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">
                    Want to see the action first? Pop open the Bug Dashboard and
                    follow a live hunt.
                  </p>
                </Frame>
              </aside>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}

export default memo(JobDescription)
