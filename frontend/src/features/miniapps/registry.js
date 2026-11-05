import { lazy } from 'react'

export const miniApps = [
  {
    slug: 'continent-cycle-quiz',
    title: 'Continent Cycle Quiz',
    description: 'Test yourself on world maps',
    component: lazy(() => import('./maps-quiz/MapsQuiz')),
  },
]