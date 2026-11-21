const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const formatDateTime = (value) => {
  if (!value) {
    return '—';
  }
  return dateFormatter.format(new Date(value));
};
