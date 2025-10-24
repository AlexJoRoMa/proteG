import Checkout from '@/components/organisms/Checkout'
import CheckoutProvider from '@/components/providers/CheckoutProvider'
import { contentfulClient } from '@/services/contentful/client'
import { ResumenIcon } from '@/types/ConfiguradorTypes'
import { EntrySkeletonType } from 'contentful'
import React from 'react'

const CheckoutPage = async () => {

  const Icon = await contentfulClient.getEntries({
    content_type: 'media',
    'fields.internalName': 'Resumen-Icono-Promociones',
    include: 5,
  }).then((entriesResponse) => {
    return entriesResponse.items[0]
  }) as unknown as EntrySkeletonType<ResumenIcon>;

  const PaypalIcon = await contentfulClient.getEntries({
    content_type: 'media',
    'fields.internalName': 'logo-paypal',
    include: 5,
  }).then((entriesResponse) => {
    return entriesResponse.items[0]
  }) as unknown as EntrySkeletonType<ResumenIcon>;


  return (
    <main className="min-h-screen">
      <CheckoutProvider totalSteps={6} initialStep={2} icon={Icon} paypalIcon={PaypalIcon}>
        <Checkout />
      </CheckoutProvider>
    </main>
  )
}

export default CheckoutPage
