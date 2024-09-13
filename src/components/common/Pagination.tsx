import { Link } from 'react-router-dom';
import Select from 'react-select';

type PaginationProps = {
    handleChangePagasize?: any,
    meta?: any,
    total?: number | string,
    totalPage?: number | 0,
    page: number,
    url: string
}

export default function Pagination(props: PaginationProps) {
    const { handleChangePagasize, meta, total, totalPage, page, url} = props
    return(
        <div className="row w-100">
            <div className="col-md-6 text-italic">
                <span>Hiển thị</span>
                <select className="ml-1 mr-1" onChange={(val) => handleChangePagasize(val?.target?.value)}>
                    <option selected={meta.page_size == 20} value="20">20</option>
                    <option selected={meta.page_size == 30} value="30">30</option>
                    <option selected={meta.page_size == 50} value="50">50</option>
                    <option selected={meta.page_size == 100} value="100">100</option>
                    <option selected={meta.page_size == 200} value="200">200</option>
                </select>
                <span>bản ghi trên tổng số {total} bản ghi</span>
            </div>
            <div className="col-md-6">
                <ul className="pagination pagination-sm m-0 float-right">
                    <li className="page-item">
                        {page > 2 &&
                        <Link className="page-link" to={`/admin/${url}?page=1`}>
                            <i className="fas fa-angle-double-left"></i>
                        </Link>
                        }
                    </li>
                    <li className="page-item">
                        {page > 1 &&
                        <Link className="page-link" to={`/admin/${url}?page=${page - 1}`}>
                            <i className="fas fa-angle-left"></i>
                        </Link>
                        }
                    </li>
                    {Array(totalPage)
                        .fill(0)
                        .map((_, index) => {
                            if ((index + 1) >= (page - 2) && (index + 1) <= (page + 2)){
                                const pageNumber = index + 1
                                const isActive = page === pageNumber
                                
                                return (
                                    <li key={pageNumber} className={isActive ? "page-item active" : "page-item"}>
                                        <Link className="page-link" to={`/admin/${url}?page=${pageNumber}`}>{pageNumber}</Link>
                                    </li>
                                )
                            }
                        }
                    )}
                    <li className="page-item">
                        {page != totalPage && totalPage as Number > 0 &&
                        <Link className="page-link" to={`/admin/${url}?page=${page + 1}`}>
                            <i className="fas fa-angle-right"></i>
                        </Link>
                        }
                    </li>
                    <li className="page-item">
                        {((page + 1) < Number(totalPage)) &&
                        <Link className="page-link" to={`/admin/${url}?page=${totalPage}`}>
                            <i className="fas fa-angle-double-right"></i>
                        </Link>
                        }
                    </li>
                </ul>
            </div>
        </div>
    )
}