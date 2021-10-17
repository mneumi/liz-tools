import { Parser, TableInterface, ColumnInterface } from "sql-ddl-to-json-schema"
import { underscoreToCamel, camelToPascal, underscoreToPascal } from "../utils"
import { typeMapping } from "./type-mapping"
import { IModelResult, ITableNameInfo } from "./types"

export class SqlToModel {
  parser: Parser

  constructor() {
    this.parser = new Parser("mysql")
  }

  genAllTableCode(sql: string) {
    const result: IModelResult[] = []

    const tableArray = this.getCompactJson(sql)

    for (const item of tableArray) {
      result.push(this.genOneTableCode(item))
    }
    return result
  }

  getCompactJson(sql: string): TableInterface[] {
    this.parser.feed(sql)

    const parsedJsonFormat = this.parser.results

    const compactJsonArray = this.parser.toCompactJson(parsedJsonFormat)

    return compactJsonArray
  }

  genOneTableCode(table: TableInterface): IModelResult {
    const codeArray: string[] = []

    const tableNameInfo = this.getTableNameInfo(table)

    codeArray.push("package model")
    codeArray.push(this.genTableStructCode(table))
    codeArray.push(this.genTableNameCode(table))

    return {
      tableName: tableNameInfo.underscoreName,
      goCode: codeArray.join("\n\n"),
    }
  }

  genTableStructCode(table: TableInterface): string {
    const { pascalName } = this.getTableNameInfo(table)

    const primaryKey = this.getPrimaryKey(table)

    return `// ${pascalName} ${table?.options?.comment}
type ${pascalName} struct {
    ${this.genAllColumn(table.columns, primaryKey)}
}`
  }

  genAllColumn(columnArray: ColumnInterface[] | undefined, primaryKey: string): string {
    if (!columnArray) {
      return ""
    }

    return columnArray.map((item) => this.genColumn(item, primaryKey)).join("\n    ")
  }

  genColumn(column: ColumnInterface, primaryKey: string): string {
    const columnName = underscoreToPascal(column.name)
    const columnType = this.convertType(column.type.datatype)
    let columnTag = `\`gorm:"column:${column.name};"\``

    // 如果存在单主键，则补充单主键
    if (column.name === primaryKey) {
      columnTag = `\`gorm:"column:${column.name};primary_key;"\``
    }

    let columnComment = ""
    if (column?.options?.comment) {
      columnComment = ` // ${column?.options?.comment}`
    }

    return columnName + " " + columnType + " " + columnTag + " " + columnComment
  }

  genTableNameCode(table: TableInterface): string {
    const { pascalName, underscoreName, firstLetterLower } = this.getTableNameInfo(table)

    return `// 设置表名
func (${firstLetterLower} *${pascalName}) TableName() string {
    return "${underscoreName}"
}
    `
  }

  getTableNameInfo(table: TableInterface): ITableNameInfo {
    const underscoreTableName = table.name
    const camelTableName = underscoreToCamel(underscoreTableName)
    const pascalTableName = camelToPascal(camelTableName)

    const firstLetter = underscoreTableName.slice(0, 1)
    const firstLetterUpper = firstLetter.toUpperCase()
    const firstLetterLower = firstLetter.toLowerCase()

    return {
      underscoreName: underscoreTableName,
      camelName: camelTableName,
      pascalName: pascalTableName,
      firstLetterLower: firstLetterLower,
      firstLetterUpper: firstLetterUpper,
    }
  }

  getPrimaryKey(table: TableInterface): string {
    // 只获取 单主键，不处理联合主键
    if (table?.primaryKey?.columns?.length === 1) {
      return table.primaryKey.columns[0].column ?? ""
    }

    return ""
  }

  convertType(t: string): string {
    return typeMapping(t)
  }
}

export default new SqlToModel()
