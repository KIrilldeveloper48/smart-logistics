import type { TBetViewModel } from '../../model';

export const getAuctionParticipantsCount = (bets: readonly TBetViewModel[]): number => {
  const participants = new Set<string>();

  bets.forEach((bet) => {
    if (bet.organizationId !== null) {
      participants.add(`organization:${bet.organizationId}`);
      return;
    }

    if (bet.transporterName !== null && bet.transporterName.trim() !== '') {
      participants.add(`name:${bet.transporterName.trim().toLocaleLowerCase('ru-RU')}`);
      return;
    }

    if (bet.id !== null) {
      participants.add(`bet:${bet.id}`);
    }
  });

  return participants.size;
};

export const formatParticipantsCount = (count: number): string =>
  `${count.toLocaleString('ru-RU')} участник${count % 10 === 1 && count % 100 !== 11 ? '' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'а' : 'ов'}`;
