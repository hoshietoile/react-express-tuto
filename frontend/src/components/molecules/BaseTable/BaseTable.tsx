import React from 'react'
import './BaseTable.scss'

import { headerType } from './../../organisms/MigrationTable/MigrationTable'
import { itemType } from './../../pages/Migration/Migration'

export type baseTableProps = {
  headers: headerType[]
  items: itemType[]
  rowRenderCb: (items: itemType[]) => React.ReactNode[]
}

const BaseTable: React.FC<baseTableProps> = ({
  headers,
  items,
  rowRenderCb
}) => {
  /**
   * コールバックでマッピングしたDOM配列のレンダリング
   */
  const renderItems = (renderItems: React.ReactNode[]) => {
    if (renderItems && renderItems.length > 0) {
      return renderItems.map((item, index) => (
        <tr key={ index } className="table__row">{ item }</tr>
      ))
    } else {
      const colspan = headers.length
      return <tr>
        <td colSpan={ colspan } className="nodata">
          There's no data to be shown...
        </td>
      </tr>
    }
  }
  /**
   * テーブルレンダリング処理
   */
  const renderTable = () => {
    const headerLabels = headers
      .sort((a: headerType, b: headerType) => a.order - b.order)
      .map((header: headerType) => header.text)
    // テーブル行マッピング
    const mapTargets = items.slice()
    const rows = rowRenderCb(mapTargets)
    // テーブルレンダリング
    return (
      <div className="table__wrapper">
        <table className="table">
          <thead className="table__header">
            <tr>
              { headerLabels.map((header, index) => (
                  <th key={ index } className="table__header--column">{ header }</th>
                ))
              }
            </tr>
          </thead>
          <tbody className="table__body">
            { (() => renderItems(rows))() }
          </tbody>
        </table>
      </div>
    )
  }
  return (
    (() => renderTable())()
  )
}
export default BaseTable