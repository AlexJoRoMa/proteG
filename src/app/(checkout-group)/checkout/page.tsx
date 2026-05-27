import Checkout from '@/components/organisms/Checkout';
import CheckoutProvider from '@/components/providers/CheckoutProvider';
import { contentfulClient } from '@/services/contentful/client';
import { getCopyForComponent } from '@/services/contentful/components';
import { ResumenIcon } from '@/types/ConfiguradorTypes';
import ExitGuard from '@/utils/guards/ExitGuard';
import { EntrySkeletonType } from 'contentful';
import React from 'react';
import PageDataTracker from '@/components/tracking/PageDataTracker';

export const dynamic = 'force-dynamic';
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

  const copysResumen = await getCopyForComponent('Resumen-de-Compra').then((entry) => {
    return entry.resumen
  });

  const ModalesCheckout = await getCopyForComponent('modales-checkout').then((entry) => {
    return entry.modal
  });

  return (
    <main className="min-h-screen w-full">
      <PageDataTracker
        pageType="checkout"
        pageName="Checkout - Configura tu paquete"
        checkoutStep={1}
      />
      <CheckoutProvider initialStep={2} icon={Icon} paypalIcon={PaypalIcon} copyResumen={copysResumen} copyModales={ModalesCheckout}>
        {/* Guard detector de salida del flujo */}
        <ExitGuard />
        <Checkout />
      </CheckoutProvider>
    </main>
  );
}

export default CheckoutPage
