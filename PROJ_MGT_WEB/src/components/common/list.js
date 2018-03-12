import React, { PropTypes } from 'react';
import { Table } from 'antd';
import styles from './list.less';

function list ({ loading, dataSource, pagination, onPageChange, rowSelection, columns }) {
  const onRowClick = (record) => {
    if (rowSelection) {
      let savedIndex = rowSelection.selectedRowKeys.indexOf(record.id);
      savedIndex >= 0 ? rowSelection.selectedRowKeys.splice(savedIndex, 1) : rowSelection.selectedRowKeys.push(record.id);

      rowSelection.onChange(rowSelection.selectedRowKeys);
    }
  };

  return (
    <div>
      <Table
        className={styles.table}
        bordered
        scroll={{ x: 900 }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        onChange={onPageChange}
        onRowClick={onRowClick}
        pagination={pagination || false}
        simple
        rowKey={record => record.id}
      />
    </div>
  );
}

list.propTypes = {
  loading: PropTypes.bool,
  dataSource: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  rowSelection: PropTypes.object,
  location: PropTypes.object,
  columns: PropTypes.array,
};

export default list;
