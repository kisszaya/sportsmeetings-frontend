export const PlacesText = (amount: number) => {
  if (
    amount % 10 === (0 || 5 || 6 || 7 || 8 || 9) ||
    amount === (11 || 12 || 13 || 14)
  )
    return `${amount} мест`;
  else if (amount % 10 === 1) return `${amount} место`;
  else if (amount % 10 === (2 || 3 || 4)) return `${amount} места`;
  else return "Нет мест";
};

export const RequestsText = (amount: number) => {
  if (amount === 0) return "Нет заявок";
  else if (
    amount % 10 === (0 || 5 || 6 || 7 || 8 || 9) ||
    amount === (11 || 12 || 13 || 14)
  )
    return `${amount} заявок`;
  else if (amount % 10 === 1) return `${amount} заявка`;
  else if (amount % 10 === (2 || 3 || 4)) return `${amount} заявки`;
  else return `${amount} заявок`;
};
