import React from 'react'
import './LinkPanel.scss'
// dependencies
import { NavLink } from 'react-router-dom'
// atoms
import BasePanel from './../../atoms/BasePanel/BasePanel'
import Icon from './../../atoms/Icon/Icon'

export type LinkPanelProps = {
  linkTo: string
  linkText: string
  iconSrc: string
  iconSize: string
  iconAlt: string
}

const LinkPanel: React.FC<LinkPanelProps> = ({
  linkTo,
  linkText,
  iconSrc,
  iconSize,
  iconAlt
}) => {
  return (
    <NavLink to={ linkTo } className="link-panel__link">
      <BasePanel appendClass="link-panel__panel" >
        <Icon src={ iconSrc } size={ iconSize } alt={ iconAlt } />
        <span>{ linkText }</span>
      </BasePanel>
    </NavLink>
  )
}
export default LinkPanel