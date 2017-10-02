import React from 'react';

const renderRow = item => {
  return (
    <tr key={ item.id }>
      <th>
        { item.id }
      </th>
      <td>
        { item.type }
      </td>
      <td>
        { item.data }
      </td>
      <td>
        { new Date(item.time).toLocaleDateString() }
      </td>
      <td>
        { item.sum } р.
      </td>
    </tr>
    );
};

const TransactionTable = props => {
  if (props.data.length === 0) return ""
  else return (
      <table className="table">
        <thead>
          <tr>
            <th><abbr title="Номер транзакции">Номер</abbr></th>
            <th><abbr title="Тип транзакции">Тип</abbr></th>
            <th><abbr title="Детали транзакции">Детали</abbr></th>
            <th><abbr title="Дата и время транзакции">Дата</abbr></th>
            <th><abbr title="Сумма в рублях">Сумма</abbr></th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th><abbr title="Номер транзакции">Номер</abbr></th>
            <th><abbr title="Тип транзакции">Тип</abbr></th>
            <th><abbr title="Детали транзакции">Детали</abbr></th>
            <th><abbr title="Дата и время транзакции">Дата</abbr></th>
            <th><abbr title="Сумма в рублях">Сумма</abbr></th>
          </tr>
        </tfoot>
        <tbody>
          { props.data.map(item => renderRow(item)) }
        </tbody>
      </table>
      );
};

export default TransactionTable;