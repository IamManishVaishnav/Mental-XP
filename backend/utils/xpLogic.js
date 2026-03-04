const calculateXP = (user, xpToAdd) => {
  let { xp, level } = user
  const previousLevel = level

  xp += xpToAdd

  while (xp >= level * 100) {
    xp -= level * 100
    level += 1
  }

  return { xp, level, previousLevel, leveledUp: level > previousLevel }
}

module.exports = { calculateXP }