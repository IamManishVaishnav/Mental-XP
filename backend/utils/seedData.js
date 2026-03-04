const Quest = require('../models/Quest')
const Coupon = require('../models/Coupon')

const quests = [
  {
    title: 'Box Breathing',
    description: 'A powerful breathing technique used by Navy SEALs to reduce stress and regain focus.',
    instructions: [
      'Sit upright in a comfortable position and close your eyes.',
      'Exhale completely through your mouth.',
      'Inhale through your nose for 4 seconds.',
      'Hold your breath for 4 seconds.',
      'Exhale through your mouth for 4 seconds.',
      'Hold your breath for 4 seconds.',
      'Repeat this cycle 4 times.',
    ],
    category: 'breathing',
    difficulty: 'easy',
    xpReward: 10,
    durationMinutes: 5,
  },
  {
    title: '4-7-8 Breathing',
    description: 'A calming technique that activates your parasympathetic nervous system within minutes.',
    instructions: [
      'Sit or lie down in a comfortable position.',
      'Place the tip of your tongue behind your upper front teeth.',
      'Exhale completely through your mouth making a whoosh sound.',
      'Close your mouth and inhale through your nose for 4 seconds.',
      'Hold your breath for 7 seconds.',
      'Exhale through your mouth for 8 seconds.',
      'Repeat the cycle 3 more times.',
    ],
    category: 'breathing',
    difficulty: 'medium',
    xpReward: 15,
    durationMinutes: 7,
  },
  {
    title: 'Three Good Things',
    description: 'A research-backed gratitude practice that rewires your brain toward positivity over time.',
    instructions: [
      'Find a quiet moment — morning or evening works best.',
      'Think about your day or the past 24 hours.',
      'Write down 3 specific things that went well, no matter how small.',
      'For each one, write one sentence about why it happened.',
      'Reflect on how these things made you feel.',
      'Close your eyes and sit with that feeling for 30 seconds.',
    ],
    category: 'gratitude',
    difficulty: 'easy',
    xpReward: 10,
    durationMinutes: 6,
  },
  {
    title: 'Gratitude Letter',
    description: 'Write a short letter of appreciation to someone who has positively impacted your life.',
    instructions: [
      'Think of someone who has helped, supported, or inspired you recently.',
      'Open a notes app or grab a piece of paper.',
      'Write 3-5 sentences explaining what they did and how it affected you.',
      'Be specific — mention the exact moment or action.',
      'You do not have to send it. The act of writing is the exercise.',
      'Read it back to yourself once you are done.',
    ],
    category: 'gratitude',
    difficulty: 'medium',
    xpReward: 15,
    durationMinutes: 10,
  },
  {
    title: 'Thought Record',
    description: 'Identify and challenge an automatic negative thought using cognitive behavioural therapy.',
    instructions: [
      'Think of one negative thought you have had recently.',
      'Write it down exactly as it appeared in your mind.',
      'Rate how strongly you believe it from 0 to 100.',
      'List 3 pieces of evidence that support this thought.',
      'List 3 pieces of evidence that contradict this thought.',
      'Write a balanced, realistic alternative thought.',
      'Rate how strongly you believe the original thought now.',
    ],
    category: 'reframe',
    difficulty: 'hard',
    xpReward: 20,
    durationMinutes: 12,
  },
  {
    title: 'The 5-4-3-2-1 Grounding',
    description: 'A mindfulness technique to anchor yourself in the present moment and reduce anxiety.',
    instructions: [
      'Stop what you are doing and take a slow deep breath.',
      'Name 5 things you can see right now.',
      'Name 4 things you can physically feel.',
      'Name 3 things you can hear.',
      'Name 2 things you can smell.',
      'Name 1 thing you can taste.',
      'Take another slow deep breath and notice how you feel.',
    ],
    category: 'reframe',
    difficulty: 'easy',
    xpReward: 10,
    durationMinutes: 5,
  },
  {
    title: 'Best Possible Self',
    description: 'Visualise your ideal future self to build optimism and clarify personal goals.',
    instructions: [
      'Find a quiet space and set a 10-minute timer.',
      'Imagine yourself 5 years from now at your very best.',
      'Think about your relationships, career, health, and mindset.',
      'Write freely about what your life looks like in detail.',
      'Do not edit or judge — just write whatever comes to mind.',
      'Read it back and underline one thing you can act on this week.',
    ],
    category: 'reframe',
    difficulty: 'medium',
    xpReward: 15,
    durationMinutes: 15,
  },
  {
    title: 'Morning Gratitude Scan',
    description: 'Start your day by scanning for three things you are looking forward to.',
    instructions: [
      'Do this within 5 minutes of waking up, before checking your phone.',
      'Lie still or sit up in bed.',
      'Think of 3 things you are genuinely looking forward to today.',
      'They can be tiny — a cup of coffee, a conversation, finishing a task.',
      'Say each one to yourself and take one breath between each.',
      'Set an intention for how you want to feel today.',
    ],
    category: 'gratitude',
    difficulty: 'easy',
    xpReward: 10,
    durationMinutes: 5,
  },
]

const coupons = [
  {
    code: 'LEVELUP10',
    description: '10% off your next wellness app subscription',
    discountPercent: 10,
    partner: 'Calm App',
    triggerType: 'level_up',
    triggerValue: 1,
    expiryDays: 30,
  },
  {
    code: 'MILESTONE5-15',
    description: '15% off meditation sessions',
    discountPercent: 15,
    partner: 'Headspace',
    triggerType: 'milestone',
    triggerValue: 5,
    expiryDays: 45,
  },
  {
    code: 'MILESTONE10-20',
    description: '20% off online therapy session',
    discountPercent: 20,
    partner: 'BetterHelp',
    triggerType: 'milestone',
    triggerValue: 10,
    expiryDays: 60,
  },
  {
    code: 'MILESTONE15-25',
    description: '25% off mindfulness course',
    discountPercent: 25,
    partner: 'Mindvalley',
    triggerType: 'milestone',
    triggerValue: 15,
    expiryDays: 60,
  },
  {
    code: 'MILESTONE20-30',
    description: '30% off annual wellness subscription',
    discountPercent: 30,
    partner: 'Noom',
    triggerType: 'milestone',
    triggerValue: 20,
    expiryDays: 90,
  },
]

const seedData = async () => {
  try {
    const questCount = await Quest.countDocuments()
    if (questCount === 0) {
      await Quest.insertMany(quests)
      console.log('Quests seeded successfully')
    }

    const couponCount = await Coupon.countDocuments()
    if (couponCount === 0) {
      await Coupon.insertMany(coupons)
      console.log('Coupons seeded successfully')
    }
  } catch (err) {
    console.error('Seed error:', err.message)
  }
}

module.exports = seedData