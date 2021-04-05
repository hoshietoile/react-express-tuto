import React, { useCallback } from 'react'
import formatClass from '../../../assets/js/modules/formatClass'
import './MigrationTab.scss'

export type migrationTabProps = {
  tabTexts: string[]
  children: React.ReactNode[]
  activeTab: number
  handleTabClick: (index: number) => void
}

const MigrationTab: React.FC<migrationTabProps> = ({ tabTexts, children, activeTab, handleTabClick }) => {
  /**
   * タブヘッダクラス
   */
  const tabHeaderClass = useCallback((index: number) => {
    return formatClass("tab__header--label", '', () => {
      return index === activeTab ? 'active' : ''
    })
  }, [activeTab])
  /**
   * タブヘッダー
   */
  const mapTabHeader = () => {
    return children.map((_, index: number) => {
      return (
        <div
          key={ index }
          className={ (() => tabHeaderClass(index))() }
          onClick={ () => handleTabClick(index) }
        >
          { tabTexts[index] }
        </div>
      )
    })
  }
  /**
   * タブボディ
   */
  const mapTabBody = () => {
    return children.filter((child: React.ReactNode, index: number) => {
      if (index === activeTab) {
        return <div key={ index } className="tab__content column">
          { child }
        </div>
      }
    })
  }
  return (
    <div className="tab">
      <div className="tab__header">
        { mapTabHeader() }
      </div>
      
      {/* タブ */}
      <div className="tab__body">
        { mapTabBody() }
      </div>
    </div>
  )
}
export default MigrationTab