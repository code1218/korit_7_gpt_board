/**@jsxImportSource @emotion/react */
import Select from 'react-select';
import * as s from './style';
import { BiSearch } from 'react-icons/bi';
import { emptyButton } from '../../styles/buttons';
import { GrView } from 'react-icons/gr';
import { FcLike } from 'react-icons/fc';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetSearchBoardList } from '../../queries/boardQuery';

function BoardListPage(props) {
    const [ searchParams, setSearchParams ] = useSearchParams(); 
    const page = parseInt(searchParams.get("page") || "1");
    const order = searchParams.get("order") || "recent";
    const searchText = searchParams.get("searchText") || "";
    const searchBoardList = useGetSearchBoardList({
        page,
        limitCount: 15,
        order,
        searchText,
    });

    const [ pageNumbers, setPageNumbers ] = useState([]);

    const orderSelectOptions = [
        {label: "최근 게시글", value: "recent"},
        {label: "오래된 게시글", value: "oldest"},
        {label: "조회수 많은 순", value: "viewsDesc"},
        {label: "조회수 적은 순", value: "viewsAsc"},
        {label: "좋아요 많은 순", value: "likesDesc"},
        {label: "좋아요 적은 순", value: "likesAsc"},
    ];

    useEffect(() => {
        if(!searchBoardList.isLoading) {
            const currentPage = searchBoardList?.data?.data.page || 1;
            const totalPages = searchBoardList?.data?.data.totalPages || 1;
            const startIndex = Math.floor((currentPage - 1) / 5) * 5 + 1;
            const endIndex = startIndex + 4 > totalPages ? totalPages : startIndex + 4;

            let newPageNumbers = []; 
            for(let i = startIndex; i <= endIndex; i++) {
                newPageNumbers = [...newPageNumbers, i];
            }
            setPageNumbers(newPageNumbers);
        }
    }, [searchBoardList.data]);

    useEffect(() => {
        searchBoardList.refetch();
    }, [searchParams]);

    const handlePageNumbersOnClick = (pageNumber) => {
        setSearchParams(prev => ({
            ...prev,
            page: pageNumber,
        }));
    }

    return (
        <div css={s.container}>
            <div css={s.header}>
                <div css={s.title}>
                    <h2>전체 게시글</h2>
                </div>
                <div css={s.searchItems}>
                    <Select 
                        options={orderSelectOptions}
                        styles={{
                            control: (style) => ({
                                ...style,
                                width: "11rem",
                                minHeight: "3rem",
                            }),
                            dropdownIndicator: (style) => ({
                                ...style,
                                padding: "0.3rem",
                            })
                        }}
                    />
                    <div css={s.searchInputBox}>
                        <input type="text" />
                        <button css={emptyButton}><BiSearch /></button>
                    </div>
                </div>
            </div>
            <div css={s.main}>
                <ul css={s.boardListContainer}>
                    <li>
                        <div>No.</div>
                        <div>Title</div>
                        <div>Writer</div>
                        <div>Count</div>
                        <div>Date</div>
                    </li>
                    {
                        searchBoardList.isLoading ||
                        searchBoardList.data.data.boardSearchList.map(boardList => 
                            <li key={boardList.boardId}>
                                <div>{boardList.boardId}</div>
                                <div>{boardList.title}</div>
                                <div css={s.boardWriter}>
                                    <div>
                                        <img src={`http://localhost:8080/image/user/profile/${boardList.profileImg || "default.png"}`} alt="" />
                                    </div>
                                    <span>{boardList.nickname}</span>
                                </div>
                                <div css={s.boardCounts}>
                                    <span>
                                        <GrView />
                                        <span>{boardList.viewCount}</span>
                                    </span>
                                    <span>
                                        <FcLike />
                                        <span>{boardList.likeCount}</span>
                                    </span>
                                </div>
                                <div>{boardList.createdAt}</div>
                            </li>
                        )
                    }
                </ul>
            </div>
            <div css={s.footer}>
                <div css={s.pageNumbers}>
                    <div><GoChevronLeft /></div>
                    {
                        pageNumbers.map(number => 
                            <div css={s.pageNum(page === number)} onClick={() => handlePageNumbersOnClick(number)}><span>{number}</span></div>
                        )
                    }
                    <div><GoChevronRight /></div>
                </div>
            </div>
        </div>
    );
}

export default BoardListPage;