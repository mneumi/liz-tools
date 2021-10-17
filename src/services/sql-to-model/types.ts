export interface ITableNameInfo {
  underscoreName: string // 下划线形式的表名
  camelName: string // 驼峰形式的表名
  pascalName: string // Pascal形式的表明
  firstLetterLower: string // 表名的首字母小写形式
  firstLetterUpper: string // 表名的首字母大写形式
}

export interface IModelResult {
  tableName: string // 表名
  goCode: string // Go代码
}
