import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';

import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import { ReactComponent as AngleRightIcon } from 'assets/icons/angle-right.svg';
import { ReactComponent as DoubleAngleLeftIcon } from 'assets/icons/double-angle-left.svg';
import { ReactComponent as DoubleAngleRightIcon } from 'assets/icons/double-angle-right.svg';
import './Pagination.scss';

interface PaginationProps {
  count: number;
  currentPage: number;
  itemsPerPage: number;
  keyword?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  count,
  currentPage = 1,
  itemsPerPage,
  keyword,
}) => {
  const location = useLocation();
  const history = useHistory();
  const totalPage = useMemo(
    () => Math.ceil(count / itemsPerPage),
    [count, itemsPerPage]
  );

  const pageHandler = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPage || pageNumber === currentPage)
      return;

    const destinationUrl = `${location.pathname}${
      keyword ? `${keyword}/` : ''
    }?page=${pageNumber}`;

    history.push(destinationUrl);
  };

  return totalPage > 1 ? (
    <div className="pagination">
      <Button inversed onClick={() => pageHandler(1)}>
        <DoubleAngleLeftIcon />
      </Button>
      <Button inversed onClick={() => pageHandler(currentPage - 1)}>
        <AngleLeftIcon />
      </Button>
      {currentPage >= 3 && (
        <Button inversed onClick={() => pageHandler(currentPage - 2)}>
          {currentPage - 2}
        </Button>
      )}
      {currentPage >= 2 && (
        <Button inversed onClick={() => pageHandler(currentPage - 1)}>
          {currentPage - 1}
        </Button>
      )}
      <Button>{currentPage}</Button>
      {totalPage - currentPage >= 1 && (
        <Button inversed onClick={() => pageHandler(currentPage + 1)}>
          {currentPage + 1}
        </Button>
      )}
      {totalPage - currentPage >= 2 && (
        <Button inversed onClick={() => pageHandler(currentPage + 2)}>
          {currentPage + 2}
        </Button>
      )}
      <Button inversed onClick={() => pageHandler(currentPage + 1)}>
        <AngleRightIcon />
      </Button>
      <Button inversed onClick={() => pageHandler(totalPage)}>
        <DoubleAngleRightIcon />
      </Button>
    </div>
  ) : null;
};

export default Pagination;
