import ThankYou from '@/components/organisms/Thank-You'
import ThankYouProvider from '@/components/providers/ThankYouProvider'
import { contentfulClient } from '@/services/contentful/client'
import { getCopyForComponent } from '@/services/contentful/components'
import { ResumenIcon } from '@/types/ConfiguradorTypes'
import { EntrySkeletonType } from 'contentful'
import React from 'react'

const ThankYouPage = async () => {

    const Icon = await contentfulClient.getEntries({
        content_type: 'media',
        'fields.internalName': 'Resumen-Icono-Promociones',
        include: 5,
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    }) as unknown as EntrySkeletonType<ResumenIcon>;

    const copys = await getCopyForComponent('thankyou-page').then((entry) => {
        return entry.thankyou
    });

    return (
        <main className="min-h-screen w-full">
            <ThankYouProvider
                icon={Icon}
                copys={copys}
            >
                <ThankYou />
            </ThankYouProvider>
        </main>
    )
}

export default ThankYouPage
