const Quest = require('../models/Quest')
const Coupon = require('../models/Coupon')

const quests = [
  // ── BREATHING ──────────────────────────────────────────────────────────────
  {
    title: 'Box Breathing',
    description: 'A powerful breathing technique used by Navy SEALs to reduce stress and regain focus under pressure.',
    instructions: [
      'Sit upright in a comfortable position and close your eyes.',
      'Follow the animated circle — it guides each phase automatically.',
      'Inhale for 4 seconds as the circle expands.',
      'Hold for 4 seconds at full size.',
      'Exhale for 4 seconds as it contracts.',
      'Hold for 4 seconds before the next cycle.',
      'Complete all 4 cycles to finish the quest.',
    ],
    category: 'breathing',
    difficulty: 'easy',
    xpReward: 10,
    durationMinutes: 5,
    componentType: 'breathing_timer',
    componentConfig: {
      phases: [
        { label: 'Inhale',     duration: 4, instruction: 'Breathe in slowly...' },
        { label: 'Hold',       duration: 4, instruction: 'Hold gently...' },
        { label: 'Exhale',     duration: 4, instruction: 'Release slowly...' },
        { label: 'Hold',       duration: 4, instruction: 'Rest before the next cycle...' },
      ],
      totalCycles: 4,
    },
  },
  {
    title: '4-7-8 Breathing',
    description: 'A calming technique that activates your parasympathetic nervous system. Often called a "natural tranquiliser".',
    instructions: [
      'Sit or lie down comfortably.',
      'Place the tip of your tongue behind your upper front teeth.',
      'Follow the animated circle through each phase.',
      'Inhale through your nose for 4 seconds.',
      'Hold your breath for 7 seconds.',
      'Exhale completely through your mouth for 8 seconds.',
      'Complete 3 full cycles to finish.',
    ],
    category: 'breathing',
    difficulty: 'medium',
    xpReward: 15,
    durationMinutes: 7,
    componentType: 'breathing_timer',
    componentConfig: {
      phases: [
        { label: 'Inhale',  duration: 4, instruction: 'Breathe in through your nose...' },
        { label: 'Hold',    duration: 7, instruction: 'Hold — feel the stillness...' },
        { label: 'Exhale',  duration: 8, instruction: 'Breathe out completely...' },
      ],
      totalCycles: 3,
    },
  },

  // ── GRATITUDE ──────────────────────────────────────────────────────────────
  {
    title: 'Three Good Things',
    description: 'A research-backed gratitude practice. Write three specific things that went well today and why they happened.',
    instructions: [
      'Find a quiet moment — morning or evening works best.',
      'Think about your day or the past 24 hours.',
      'Write 3 specific things that went well, no matter how small.',
      'For each one, add a sentence about why it happened.',
      'Be specific — "my colleague helped me debug" beats "work was okay".',
    ],
    category: 'gratitude',
    difficulty: 'easy',
    xpReward: 10,
    durationMinutes: 6,
    componentType: 'journal_entry',
    componentConfig: {
      prompts: [
        { id: 'thing1', label: 'Good thing #1', placeholder: 'Something that went well today…', minWords: 5 },
        { id: 'why1',   label: 'Why it happened', placeholder: 'Because…', minWords: 3 },
        { id: 'thing2', label: 'Good thing #2', placeholder: 'Another thing you appreciated…', minWords: 5 },
        { id: 'why2',   label: 'Why it happened', placeholder: 'Because…', minWords: 3 },
        { id: 'thing3', label: 'Good thing #3', placeholder: 'One more positive moment…', minWords: 5 },
        { id: 'why3',   label: 'Why it happened', placeholder: 'Because…', minWords: 3 },
      ],
    },
  },
  {
    title: 'Gratitude Letter',
    description: 'Write a short letter of appreciation to someone who has positively impacted your life recently.',
    instructions: [
      'Think of someone who helped, supported, or inspired you recently.',
      'Write 3-5 sentences to them directly — use "Dear [name]".',
      'Be specific about what they did and how it made you feel.',
      'You do not need to send it — the act of writing is the practice.',
    ],
    category: 'gratitude',
    difficulty: 'medium',
    xpReward: 15,
    durationMinutes: 10,
    componentType: 'journal_entry',
    componentConfig: {
      prompts: [
        { id: 'recipient', label: 'Who is this for?', placeholder: 'A colleague, friend, mentor, family member…', minWords: 1 },
        { id: 'letter',    label: 'Your letter', placeholder: 'Dear ___,\n\nI wanted to tell you…', minWords: 30, multiline: true, rows: 7 },
      ],
    },
  },
  {
    title: 'Morning Gratitude Scan',
    description: 'Start your day by identifying three things you are genuinely looking forward to — however small.',
    instructions: [
      'Do this within 10 minutes of waking up, before checking your phone.',
      'Think of 3 things ahead of you today that you feel good about.',
      'They can be tiny — a coffee, a conversation, finishing a task.',
      'Set an intention for how you want to feel today.',
    ],
    category: 'gratitude',
    difficulty: 'easy',
    xpReward: 10,
    durationMinutes: 5,
    componentType: 'journal_entry',
    componentConfig: {
      prompts: [
        { id: 'look1',     label: 'Looking forward to #1', placeholder: 'Something ahead today…', minWords: 3 },
        { id: 'look2',     label: 'Looking forward to #2', placeholder: 'Another thing…', minWords: 3 },
        { id: 'look3',     label: 'Looking forward to #3', placeholder: 'One more…', minWords: 3 },
        { id: 'intention', label: 'My intention for today', placeholder: 'Today I want to feel / be / do…', minWords: 4 },
      ],
    },
  },

  // ── REFRAMING / CBT ────────────────────────────────────────────────────────
  {
    title: 'Thought Record',
    description: 'Identify and challenge an automatic negative thought using cognitive behavioural therapy. The most clinically powerful exercise here.',
    instructions: [
      'Think of one negative thought you have had recently.',
      'Walk through each step of the CBT thought record.',
      'Be honest — this only works if you engage with real thoughts.',
      'The goal is not to "think positively" but to find a balanced view.',
    ],
    category: 'reframe',
    difficulty: 'hard',
    xpReward: 20,
    durationMinutes: 12,
    componentType: 'cbt_form',
    componentConfig: {
      steps: [
        { id: 'situation',    label: 'What happened?',                         placeholder: 'Describe the situation briefly…',                           minWords: 5  },
        { id: 'thought',      label: 'What was the automatic thought?',        placeholder: 'The exact thought that came to mind…',                     minWords: 5  },
        { id: 'belief',       label: 'How strongly do you believe it? (0–100)', placeholder: 'e.g. 75',                                                  type: 'slider' },
        { id: 'evidence_for', label: 'Evidence that supports this thought',    placeholder: 'List facts that seem to back it up…',                      minWords: 8  },
        { id: 'evidence_against', label: 'Evidence against this thought',      placeholder: 'What facts contradict it or tell a different story?',      minWords: 8  },
        { id: 'balanced',     label: 'A more balanced thought',                placeholder: 'A realistic alternative that accounts for both sides…',    minWords: 8  },
        { id: 'belief_after', label: 'How strongly do you believe the original thought now? (0–100)', placeholder: 'e.g. 45',                           type: 'slider' },
      ],
    },
  },
  {
    title: 'Best Possible Self',
    description: 'Visualise and write about your ideal future self. Builds optimism and helps clarify what truly matters to you.',
    instructions: [
      'Imagine yourself 5 years from now at your very best.',
      'Think about relationships, career, health, and mindset.',
      'Write freely — no editing or judgment.',
      'Underline one thing you can act on this week.',
    ],
    category: 'reframe',
    difficulty: 'medium',
    xpReward: 15,
    durationMinutes: 15,
    componentType: 'journal_entry',
    componentConfig: {
      prompts: [
        { id: 'future_work',    label: 'Your work & career in 5 years',      placeholder: 'What does your professional life look like?', minWords: 15, multiline: true, rows: 4 },
        { id: 'future_life',    label: 'Your personal life & relationships',  placeholder: 'Who are you with? Where are you?',            minWords: 15, multiline: true, rows: 4 },
        { id: 'future_self',    label: 'Who you are as a person',            placeholder: 'How do you feel? What have you become?',      minWords: 15, multiline: true, rows: 4 },
        { id: 'action_this_week', label: 'One thing I can do THIS WEEK',    placeholder: 'One concrete step toward that vision…',       minWords: 5  },
      ],
    },
  },

  // ── GROUNDING ──────────────────────────────────────────────────────────────
  {
    title: '5-4-3-2-1 Grounding',
    description: 'Anchor yourself in the present moment using all five senses. Especially effective for anxiety and racing thoughts.',
    instructions: [
      'Stop what you are doing and take one slow deep breath.',
      'For each sense, type what you notice right now in this moment.',
      'Be specific — "blue coffee mug on my desk" not just "objects".',
      'Work through all five senses to complete the quest.',
    ],
    category: 'grounding',
    difficulty: 'easy',
    xpReward: 10,
    durationMinutes: 5,
    componentType: 'grounding_checklist',
    componentConfig: {
      senses: [
        { id: 'see',   count: 5, emoji: '👁️',  label: 'Things you can SEE',   placeholder: 'Something you can see right now…' },
        { id: 'touch', count: 4, emoji: '✋',  label: 'Things you can FEEL',  placeholder: 'A physical sensation right now…' },
        { id: 'hear',  count: 3, emoji: '👂',  label: 'Things you can HEAR',  placeholder: 'A sound you can hear…' },
        { id: 'smell', count: 2, emoji: '👃',  label: 'Things you can SMELL', placeholder: 'A scent, or "no smell right now"…' },
        { id: 'taste', count: 1, emoji: '👅',  label: 'Thing you can TASTE',  placeholder: 'A taste in your mouth right now…' },
      ],
    },
  },

  // ── JOURNAL ────────────────────────────────────────────────────────────────
  {
    title: 'Daily Reflection',
    description: 'A single open-ended prompt to close the day with intention. What you write here is only yours.',
    instructions: [
      'Take 5-10 minutes at the end of your workday.',
      'Read the prompt and write honestly — no right or wrong answer.',
      'Aim for at least 50 words to give your thoughts proper space.',
    ],
    category: 'journal',
    difficulty: 'easy',
    xpReward: 10,
    durationMinutes: 8,
    componentType: 'journal_entry',
    componentConfig: {
      // Prompt rotates by day of week so it feels fresh every day
      prompts: [
        { id: 'reflection', label: 'Today\'s prompt', placeholder: 'Describe a moment today when you felt most like yourself. What were you doing? Who were you with?', minWords: 50, multiline: true, rows: 8, dailyRotation: true },
      ],
      rotatingPrompts: [
        'Describe a moment today when you felt most like yourself.',
        'What is one thing you learned today — about work, or about yourself?',
        'What drained your energy today, and what would you do differently?',
        'Who made a positive difference in your day, and how?',
        'What would you tell yourself this morning if you could go back?',
        'What are you grateful for that you did not expect today?',
        'What is something you are avoiding, and what is one small step toward it?',
      ],
    },
  },
  {
    title: 'Win Log',
    description: 'Write down one professional win from today — no matter how small. Directly targets imposter syndrome.',
    instructions: [
      'Think about your workday — any size win counts.',
      '"I helped a colleague" counts. "I shipped a bug fix" counts. "I got through a hard meeting" counts.',
      'Write what the win was, why it matters, and how it made you feel.',
    ],
    category: 'journal',
    difficulty: 'easy',
    xpReward: 10,
    durationMinutes: 5,
    componentType: 'journal_entry',
    componentConfig: {
      prompts: [
        { id: 'win',     label: 'My win today',       placeholder: 'Something I did well, completed, or contributed…', minWords: 5 },
        { id: 'why',     label: 'Why it matters',     placeholder: 'The reason this is worth noting…',                 minWords: 5 },
        { id: 'feeling', label: 'How it made me feel', placeholder: 'Proud, relieved, surprised, satisfied…',          minWords: 3 },
      ],
    },
  },
  {
    title: 'Micro Journal',
    description: 'A free-write with a single deep prompt. No structure, no format — just you and your thoughts for 5 minutes.',
    instructions: [
      'Read the prompt below.',
      'Write whatever comes to mind — stream of consciousness is perfect.',
      'Do not edit as you write. Just let it flow.',
      'Minimum 50 words to unlock completion.',
    ],
    category: 'journal',
    difficulty: 'medium',
    xpReward: 15,
    durationMinutes: 10,
    componentType: 'journal_entry',
    componentConfig: {
      prompts: [
        { id: 'freewrite', label: 'Free write', placeholder: 'Start writing and do not stop…', minWords: 50, multiline: true, rows: 10 },
      ],
      rotatingPrompts: [
        'What does "doing well" look like for you right now — not what others expect, but what you actually want?',
        'Describe the last time you felt genuinely calm. What was happening? How can you create more of that?',
        'What story are you telling yourself about a current challenge that might not be the full truth?',
        'If your stress could speak, what would it say it needs from you?',
        'What boundary do you need to set — with work, a person, or yourself?',
      ],
    },
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
    // Reseed if empty OR if existing quests are old format (no componentType field)
    const hasNewFormat = await Quest.findOne({ componentType: { $exists: true } })
    if (questCount === 0 || !hasNewFormat) {
      await Quest.deleteMany({})
      await Quest.insertMany(quests)
      console.log(`✅ ${quests.length} quests seeded (fresh)`)
    } else {
      console.log(`ℹ️  Quests already seeded (${questCount} found) — skipping`)
    }

    const couponCount = await Coupon.countDocuments()
    if (couponCount === 0) {
      await Coupon.insertMany(coupons)
      console.log(`✅ ${coupons.length} coupons seeded`)
    } else {
      console.log(`ℹ️  Coupons already seeded — skipping`)
    }
  } catch (err) {
    console.error('Seed error:', err.message)
  }
}

module.exports = seedData