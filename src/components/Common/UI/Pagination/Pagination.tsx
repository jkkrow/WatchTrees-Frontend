import { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';

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
  const location = useLocation();

  const totalPage = useMemo(
    () => Math.ceil(count / itemsPerPage),
    [count, itemsPerPage]
  );

  const pageHandler = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPage) {
      pageNumber = currentPage;
    }

    const destinationUrl = `${location.pathname}${
      keyword ? `?search=${keyword}&page=${pageNumber}` : `?page=${pageNumber}`
    }`;

    return destinationUrl;
  };

  return totalPage > 1 ? (
    <div className="pagination">
      <Link to={pageHandler(1)}>
        <Button inversed>
          <AngleLeftDoubleIcon />
        </Button>
      </Link>
      <Link to={pageHandler(currentPage - 1)}>
        <Button inversed>
          <AngleLeftIcon />
        </Button>
      </Link>
      {currentPage >= 3 && (
        <Link to={pageHandler(currentPage - 2)}>
          <Button inversed>{currentPage - 2}</Button>
        </Link>
      )}
      {currentPage >= 2 && (
        <Link to={pageHandler(currentPage - 1)}>
          <Button inversed>{currentPage - 1}</Button>
        </Link>
      )}
      <Button>{currentPage}</Button>
      {totalPage - currentPage >= 1 && (
        <Link to={pageHandler(currentPage + 1)}>
          <Button inversed>{currentPage + 1}</Button>
        </Link>
      )}
      {totalPage - currentPage >= 2 && (
        <Link to={pageHandler(currentPage + 2)}>
          <Button inversed>{currentPage + 2}</Button>
        </Link>
      )}
      <Link to={pageHandler(currentPage + 1)}>
        <Button inversed>
          <AngleRightIcon />
        </Button>
      </Link>
      <Link to={pageHandler(totalPage)}>
        <Button inversed>
          <AngleRightDoubleIcon />
        </Button>
      </Link>
    </div>
  ) : null;
};

export default Pagination;
