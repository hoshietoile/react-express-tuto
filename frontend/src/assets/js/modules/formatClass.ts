/**
 * クラスフォーマット用関数
 * @param {string} baseClass 
 * @param {string} appendClass 
 * @param {function} cb 
 * @returns {string}
 */
const formatClass = (baseClass: string, appendClass: string = '', cb?: () => string | unknown) => {
  const cbResult = cb ? cb() : ''
  return `${baseClass} ${appendClass} ${cbResult}`.trim()
}
export default formatClass