import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { formatString } from 'util/format';
import './Table.scss';

interface Item {
  _id: string;
  title: string;
}

interface TableProps {
  style?: React.CSSProperties;
  data: Item[];
  exclude?: string[];
  onEdit?: (item: Object) => void;
  onDelete?: (item: { title: string }) => void;
}

const Table: React.FC<TableProps> = ({
  style,
  data,
  exclude = [],
  onEdit,
  onDelete,
}) => {
  return (
    <div className="table" style={style}>
      <table>
        <thead>
          <tr>
            {Object.entries(data[0]).map(
              (keyValue) =>
                !exclude.includes(keyValue[0]) && (
                  <th key={keyValue[0]}>{formatString(keyValue[0])}</th>
                )
            )}
            {(onEdit || onDelete) && <th></th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              {Object.entries(item).map(
                (keyValue) =>
                  !exclude.includes(keyValue[0]) && (
                    <td
                      key={keyValue[0]}
                      data-label={formatString(keyValue[0])}
                    >
                      {keyValue[1]}
                    </td>
                  )
              )}
              {(onEdit || onDelete) && (
                <td className="table__buttons">
                  {onEdit && <EditIcon onClick={() => onEdit(item)} />}
                  {onDelete && <DeleteIcon onClick={() => onDelete(item)} />}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
