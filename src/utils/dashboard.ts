export const calculateTotalBounty = (bugs: Array<{ bounty: number }>): number =>
  bugs.reduce((total, bug) => total + bug.bounty, 0)

export const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
