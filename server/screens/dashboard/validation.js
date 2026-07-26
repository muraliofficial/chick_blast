export function validateDashboardParams(query) {
  const errors = []
  if (query.month && (isNaN(Number(query.month)) || Number(query.month) < 1 || Number(query.month) > 12)) {
    errors.push('Month must be between 1 and 12')
  }
  if (query.year && (isNaN(Number(query.year)) || Number(query.year) < 2000)) {
    errors.push('Year must be a valid 4-digit year')
  }
  return errors
}
