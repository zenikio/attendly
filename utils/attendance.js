export const DEFAULT_TARGET = 75;
const WARNING_MARGIN = 15;

export const calculatePercentage = (attended, total) =>
  total === 0 ? 0 : (attended / total) * 100;

export const getStatus = (percentage, target) => {
  if (percentage >= target) return 'success';
  if (percentage >= Math.max(0, target - WARNING_MARGIN)) return 'warning';
  return 'danger';
};

export const getStatusColor = (percentage, target, colors) =>
  colors[getStatus(percentage, target)];

export const classesCanSkip = (attended, total, target) =>
  Math.max(0, Math.floor(attended / (target / 100)) - total);

export const classesToAttend = (attended, total, target) => {
  const t = target / 100;
  if (t >= 1) return attended >= total ? 0 : Infinity;
  return Math.max(0, Math.ceil((t * total - attended) / (1 - t)));
};

export const getAdvice = ({ attended, total, isFixed, target }) => {
  if (total === 0) return null;
  if (isFixed) {
    const needed = Math.ceil((target / 100) * total) - attended;
    return needed > 0 ? { type: 'attend', count: needed } : { type: 'ontrack' };
  }
  if (calculatePercentage(attended, total) >= target) {
    const count = classesCanSkip(attended, total, target);
    return count > 0 ? { type: 'skip', count } : { type: 'ontrack' };
  }
  return { type: 'attend', count: classesToAttend(attended, total, target) };
};

export const getWeightedTotals = (subjects) =>
  subjects.reduce(
    (acc, s) => ({
      attended: acc.attended + s.attended * s.value,
      total: acc.total + s.total * s.value,
    }),
    { attended: 0, total: 0 }
  );

export const describeHistoryRemoval = (isPresent, isFixed) => {
  if (isFixed) {
    return isPresent
      ? 'Classes attended will go down by 1. Total classes stays the same (Fixed Total Mode).'
      : 'Your counts will not change, because absent marks do not change counts in Fixed Total Mode.';
  }
  return isPresent
    ? 'Classes attended and total classes will each go down by 1.'
    : 'Total classes will go down by 1. Classes attended stays the same.';
};
