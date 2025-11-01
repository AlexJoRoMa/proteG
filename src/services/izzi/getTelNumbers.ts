
let cachedNumber: string | undefined;

const phone_List = {
    'paquetes': '800 607 7070',
    'paquetes1': '800 607 7082',
    'paquetes2': '800 607 7083',
    'paquetes3': '800 607 7084',
    'paquetes8': '800 607 7080',
    'paquetes12': '800 607 7096',
    'paquetes13': '800 607 7085',
    'paquetes6': '800 607 7087',
    'paquetes5b': '800 607 7091',
    'paquetes5': '800 120 9729',
    'paquetes11': '800 120 9702',
    'paquetes7': '800 607 7088',
    'paquetes1m': '800 120 9699',
    'paquetes2m': '800 120 9700',
    'paquetes3m': '800 120 9705',
    'paquetes8m': '800 120 9707',
    'paquetes4m': '800 120 9712',
    'paquetes7m': '800 120 9717',
    'paquetes6m': '800 120 9724',
    'paquetes4/fbk/la': '804 120 9711',
    'paquetes4/fbk/pr1': '800 120 9754',
    'paquetes14/otr/pr1': '800 120 9723',
    'paquetes14/otr/pr2': '800 120 9725',
    'paquetes7/goo/dsp': '800 120 9715',
    'paquetes7/goo/vid': '800 607 7098',
    'paquetes7/goo/dsc': '800 120 9719',
    'paquetes7/goo/pmx': '800 607 7097',
    'paquetes7/goo/pr1': '800 607 7099',
    'paquetes7/pro/br/ul': '800 607 7088',
    'paquetes7/sms/br/ul': '800 120 9726',
    'paquetes7/tvsa/br': '800 120 9727',
    'paquetes7/goo/co': '800 120 9732',
    'paquetes7/goo/pr2': '800 120 9733',
} as const;

type SlugPath = keyof typeof phone_List;
type PhoneNumber = (typeof phone_List)[SlugPath];

export function setTelNumber(fullPath: string): PhoneNumber | undefined {

    const mapNumber = (fullPath in phone_List) ? phone_List[fullPath as SlugPath] : undefined;
    cachedNumber = mapNumber;
    
    
    return mapNumber;
}