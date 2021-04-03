import React, { useMemo } from 'react'

export type IconProps = {
  src: string
  size: string
  alt?: string
}

const Icon: React.FC<IconProps> = ({ src, size, alt }) => {
  const imgSize = useMemo(():string => {
    const sizeIndex = ['lg', 'md', 'sm'].indexOf(size)
    let sizeNum = '36'
    switch (sizeIndex) {
      case 0:
        sizeNum = '46'
        break
      case 1:
        sizeNum = '36'
        break
      case 2:
        sizeNum = '26'
        break
      default:
        break
    }
    return sizeNum
  }, [size])
  return <img src={ src } width={ imgSize } height={ imgSize } alt={ alt } />
}
export default Icon