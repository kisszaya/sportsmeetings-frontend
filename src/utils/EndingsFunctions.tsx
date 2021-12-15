export const PlacesText = (nowAmount: number, maxAmount: number) => {
  const amount = maxAmount - nowAmount;
  if (amount === 0) return "Нет свободных мест";
  else if (
    amount % 10 === 0 ||
    amount % 10 === 5 ||
    amount % 10 === 6 ||
    amount % 10 === 7 ||
    amount % 10 === 8 ||
    amount % 10 === 9 ||
    amount === 11 ||
    amount === 14 ||
    amount === 13 ||
    amount === 14
  )
    return `${amount} мест свободно`;
  else if (amount % 10 === 1) return `${amount} место свободно`;
  else if (amount % 10 === 2 || amount % 10 === 3 || amount % 10 === 4)
    return `${amount} места свободно`;
  else return "Нет свободных мест";
};

export const RequestsText = (amount: number) => {
  if (amount === 0) return "Нет заявок";
  else if (
    amount % 10 === 0 ||
    amount % 10 === 5 ||
    amount % 10 === 6 ||
    amount % 10 === 7 ||
    amount % 10 === 8 ||
    amount % 10 === 9 ||
    amount === 11 ||
    amount === 14 ||
    amount === 13 ||
    amount === 14
  )
    return `${amount} заявок`;
  else if (amount % 10 === 1) return `${amount} заявка`;
  else if (amount % 10 === 2 || amount % 10 === 3 || amount % 10 === 4)
    return `${amount} заявки`;
  else return `${amount} заявок`;
};
