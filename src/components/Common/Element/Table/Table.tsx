import Button from 'components/Common/Element/Button/Button';
import { formatString } from 'util/format';
import './Table.scss';

interface Item {
  _id: string;
}

interface TableProps {
  style?: React.CSSProperties;
  data: Item[];
  exclude?: string[];
  onEdit?: (item: Object) => void;
  onDelete?: (item: Object) => void;
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
                  {onEdit && (
                    <Button inversed onClick={() => onEdit(item)}>
                      EDIT
                    </Button>
                  )}
                  {onDelete && (
                    <Button inversed onClick={() => onDelete(item)}>
                      DELETE
                    </Button>
                  )}
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
