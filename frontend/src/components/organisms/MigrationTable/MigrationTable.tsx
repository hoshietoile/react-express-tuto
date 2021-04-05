import React from 'react'
import './MigrationTable.scss'

// icons
import KeyIcon from './../../../assets/images/key.svg'
import EditIcon from './../../../assets/images/checksheet.svg'
import DeleteIcon from './../../../assets/images/dustbox.svg'
// atoms
import Icon from './../../atoms/Icon/Icon'
// molecules
import BaseTable from './../../molecules/BaseTable/BaseTable'
// consts
import { consts } from './../../../config/consts'
// types
import {
  itemType,
  selectOptionType
} from './../../pages/Migration/Migration'

export type headerType = {
  order: number
  value: string
  text: string
}

const headers: headerType[] = [
  {
    order: 0,
    value: 'primary_key',
    text: ''
  },
  {
    order: 1,
    value: 'column_name',
    text: 'ColumnName'
  },
  {
    order: 2,
    value: 'concrete_name',
    text: 'ConcreteName'
  },
  {
    order: 3,
    value: 'data_type',
    text: 'DataType'
  },
  {
    order: 4,
    value: 'constraints',
    text: 'Constraints'
  },
  {
    order: 5,
    value: 'edit_action',
    text: ''
  },
  {
    order: 6,
    value: 'delete_action',
    text: ''
  },
]

const dataTypeOptions: selectOptionType[] = consts.DATA_TYPES
const constraintsOptions: selectOptionType[] = consts.CONSTRAINTS

export type migrationTableProps = {
  items: itemType[]
  handleEditClick: (item: itemType, index: number) => void
  handleDeleteClick: (item: itemType, index: number) => void
}

const MigrationTable: React.FC<migrationTableProps> = ({
  items,
  handleEditClick,
  handleDeleteClick
}) => {
  /**
   * テーブル行制約
   */
  const renderConstraints = (constraints: number[]) => {
    const render = constraintsOptions.filter((opt) => constraints.indexOf(opt.value) !== -1).map((opt) => opt.text)
    return render.join(', ')
  }
  /**
   * テーブル行データ型
   */
  const renderDataType = (dataType: string) => {
    const target = dataTypeOptions.find((op) => op.value === parseInt(dataType))
    return target ? target.text : ''
  }
  /**
   * テーブル行レンダリング処理
   */
  const renderRowFunc = (mapTargets: itemType[]) => {
    return mapTargets.map((item: itemType, index) => (
      <>
        <td className="table__row--column">
          { item.primary_key ? <Icon src={ KeyIcon } size="sm" /> : null }
        </td>
        <td className="table__row--column">{ item['column_name'] }</td>
        <td className="table__row--column">{ item['concrete_name'] }</td>
        <td className="table__row--column">{ renderDataType(item['data_type']) }</td>
        <td className="table__row--column">{ renderConstraints(item['constraints']) }</td>
        <td className="table__row--column clickable"
          onClick={ () => handleEditClick(item, index) }
        >
          <Icon src={ EditIcon } size="sm" />
        </td>
        <td className="table__row--column clickable"
          onClick={ () => handleDeleteClick(item, index) }
        >
          <Icon src={ DeleteIcon } size="sm" />
        </td>
      </>
    ))
  }
  return (
    <BaseTable
      items={ items }
      headers={ headers }
      rowRenderCb={ renderRowFunc }
    />
  )
}
export default MigrationTable