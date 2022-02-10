import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import { ReactComponent as AngleRightIcon } from 'assets/icons/angle-right.svg';
import { ReactComponent as AngleLeftDoubleIcon } from 'assets/icons/angle-left-double.svg';
import { ReactComponent as AngleRightDoubleIcon } from 'assets/icons/angle-right-double.svg';
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
  const navigate = useNavigate();
  const location = useLocation();

  const totalPage = useMemo(
    () => Math.ceil(count / itemsPerPage),
    [count, itemsPerPage]
  );

  const pageHandler = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPage) {
      return;
    }

    const destinationUrl = `${location.pathname}${
      keyword ? `?search=${keyword}&page=${pageNumber}` : `?page=${pageNumber}`
    }`;

    navigate(destinationUrl);
  };

  return totalPage > 1 ? (
    <div className="pagination">
      <div onClick={() => pageHandler(1)}>
        <Button inversed>
          <AngleLeftDoubleIcon />
        </Button>
      </div>
      <div onClick={() => pageHandler(currentPage - 1)}>
        <Button inversed>
          <AngleLeftIcon />
        </Button>
      </div>
      {currentPage >= 3 && (
        <div onClick={() => pageHandler(currentPage - 2)}>
          <Button inversed>{currentPage - 2}</Button>
        </div>
      )}
      {currentPage >= 2 && (
        <div onClick={() => pageHandler(currentPage - 1)}>
          <Button inversed>{currentPage - 1}</Button>
        </div>
      )}
      <Button>{currentPage}</Button>
      {totalPage - currentPage >= 1 && (
        <div onClick={() => pageHandler(currentPage + 1)}>
          <Button inversed>{currentPage + 1}</Button>
        </div>
      )}
      {totalPage - currentPage >= 2 && (
        <div onClick={() => pageHandler(currentPage + 2)}>
          <Button inversed>{currentPage + 2}</Button>
        </div>
      )}
      <div onClick={() => pageHandler(currentPage + 1)}>
        <Button inversed>
          <AngleRightIcon />
        </Button>
      </div>
      <div onClick={() => pageHandler(totalPage)}>
        <Button inversed>
          <AngleRightDoubleIcon />
        </Button>
      </div>
    </div>
  ) : null;
};

export default Pagination;
