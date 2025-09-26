import { contentfulClient } from '@/services/contentful/client'
import { Entry, EntrySkeletonType } from 'contentful'
import { Document } from '@contentful/rich-text-types'
import React from 'react'
import RichTextComponent from '../molecules/RichTextComponent'

const RichTextComponentServer = async ({id}) => {

    const entryRich:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
        content_type: "richTextContent",
        'sys.id': id,
        select: ['fields.content']
      }).then((entriesResponse) => {
        return entriesResponse.items
      })


  return (
    <div className='my-16 4xl:px-[200px] 2xl:px-[144px] xl:px-[80px] md:px-[80px] xsm:px-[16px]'>
        <RichTextComponent document={entryRich?.[0]?.fields?.content as Document} className='text-center mx-auto items-center !gap-6' />
    </div>
  )
}

export default RichTextComponentServer
