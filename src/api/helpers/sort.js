export function sort(sortCondition, variant) {
  let sortJoin = '';
  if (sortCondition && variant) {
    sortJoin = `ORDER BY ${sortCondition} ${variant}`;
  }
  return sortJoin;
}
