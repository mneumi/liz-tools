export interface IProcedureItem {
  title: string
  sql: string
}

const procedureHint = {
  title: "新增存储过程",
  description:
    "如果想给数据库添加存储过程，则在下方选择合适的存储过程代码，复制到云客更新系统中，提交审核执行即可",
}

const procedureList: IProcedureItem[] = [
  {
    title: "存储过程：删除主键（如果主键存在）",
    sql: `--新增订单信息
IF OBJECT_ID (N'PROC_INSERT_ORDER', N'P') IS NOT NULL
    DROP PROCEDURE  PROC_INSERT_ORDER;
GO
CREATE PROCEDURE  PROC_INSERT_ORDER
    @orderid  NVARCHAR(50),
    @city NVARCHAR(20),
    @price FLOAT 
AS 
    INSERT INTO Orders(OrderID,City,Price) 
    VALUES(@orderid,@city,@price)
GO`,
  },
  {
    title: "存储过程：删除主键（如果主键存在）",
    sql: `--新增订单信息
IF OBJECT_ID (N'PROC_INSERT_ORDER', N'P') IS NOT NULL
    DROP PROCEDURE  PROC_INSERT_ORDER;
GO
CREATE PROCEDURE  PROC_INSERT_ORDER
    @orderid  NVARCHAR(50),
    @city NVARCHAR(20),
    @price FLOAT 
AS 
    INSERT INTO Orders(OrderID,City,Price) 
    VALUES(@orderid,@city,@price)
GO
    `,
  },
  {
    title: "存储过程：删除主键（如果主键存在）",
    sql: `--新增订单信息
IF OBJECT_ID (N'PROC_INSERT_ORDER', N'P') IS NOT NULL
    DROP PROCEDURE  PROC_INSERT_ORDER;
GO
CREATE PROCEDURE  PROC_INSERT_ORDER
    @orderid  NVARCHAR(50),
    @city NVARCHAR(20),
    @price FLOAT 
AS 
    INSERT INTO Orders(OrderID,City,Price) 
    VALUES(@orderid,@city,@price)
GO
    `,
  },
  {
    title: "存储过程：删除主键（如果主键存在）",
    sql: `--新增订单信息
IF OBJECT_ID (N'PROC_INSERT_ORDER', N'P') IS NOT NULL
    DROP PROCEDURE  PROC_INSERT_ORDER;
GO
CREATE PROCEDURE  PROC_INSERT_ORDER
    @orderid  NVARCHAR(50),
    @city NVARCHAR(20),
    @price FLOAT 
AS 
    INSERT INTO Orders(OrderID,City,Price) 
    VALUES(@orderid,@city,@price)
GO
    `,
  },
]

export { procedureList, procedureHint }
