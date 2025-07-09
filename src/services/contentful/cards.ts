import { contentfulClient } from './client';
import type { TabbedCardEntry, TabbedCardSkeleton } from '@/types/Cards';
import { CONTENT_TYPE_TABBED_CARD_ID } from '@/constants/stepTabEntry';


export async function getTabbedCard(ids: string[]): Promise<TabbedCardEntry[]>{

  try{
    const response = await contentfulClient.getEntries<TabbedCardSkeleton>({
      content_type: CONTENT_TYPE_TABBED_CARD_ID,
      'sys.id[in]': ids.join(','),
      include: 5,
      limit: ids.length,
    });
    const fetchCardsMap = new Map( response.items.map(item => [item.sys.id, item]));
    const orderedCards = ids.map(id => fetchCardsMap.get(id)).filter((card): card is TabbedCardEntry => card !== undefined);

    return orderedCards;
  } catch (error) {
    console.error(`error`, error);
    throw error;
  }
}
