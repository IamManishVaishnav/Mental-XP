const calculateXP = (user, xpToAdd) => {
  let { xp, level } = user;

  xp += xpToAdd;

  while (xp >= level * 100) {
    xp -= level * 100;
    level += 1;
  }

  return { xp, level };
};

module.exports = { calculateXP };
