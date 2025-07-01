import { contentfulClient } from './client';

export async function getCards(ids) {
  try {
    const entry = await Promise.all(
      ids.map((id) => contentfulClient.getEntry(id))
    );
    return entry;
  } catch (error) {
    console.error(`error`, error);
    return [];
  }
}


/* this is to call contenful data and the use of ids to call a specific
set of cards, this case the ones related to izziFacil */
