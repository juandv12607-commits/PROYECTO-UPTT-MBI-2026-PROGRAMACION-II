class Table{
  constructor(TableName,ColumnsName,Rows,SelectedTable,FileSelectedTable){
    this.TableName = TableName;
    this.ColumnsName = ColumnsName;
    this.Rows = Rows;
    this.SelectedTable = SelectedTable;
    this.FileSelectedTable = FileSelectedTable;
  }
}
module.exports = Table;