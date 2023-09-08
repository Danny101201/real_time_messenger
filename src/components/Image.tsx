import Image from 'next/image'
import React from 'react'

function ImageComponent() {
  return (
    <Image
      loader={({ src, width, quality, }) => {
        console.log({ src, width, quality })
        return `${src}/${width}/300`
      }}
      fill
      style={{ objectFit: 'cover' }}
      src={'https://picsum.photos'}
      alt=''
    />
  )
}

export default ImageComponent