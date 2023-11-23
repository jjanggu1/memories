import './CommentMore.css';

import { useDispatch } from "react-redux";
// 리덕스툴킷 수정함수 임포트
import { toogleCommentMore } from "../../store/store";

import { CommentMoreContext } from '../../context/context';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';


function CommentMore() {
    const BASE_URL = "http://localhost:4000";

    // Content 컴포넌트에서 받은 value값
    const {commentUserIdData, getCommentData} = useContext(CommentMoreContext);
    console.log("Content.js 로 받은 데이터",commentUserIdData);

    // 로컬스토리지의 회원 ID를 상태에 저장
    const [currentUserId, setCurrentUserId] = useState(localStorage.getItem("userId"));

    // 댓글, 회원 ID 정보 상태
    const [contentId, setContentId] = useState({
        userId: commentUserIdData.userId,
        comId: commentUserIdData.comId,
    })

    // 댓글작성자와 현재 로그인된 사용자가 일치하는지 여부 상태
    const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);

    // 댓글작성자, 로그인된 사용자 일치여부 함수 
    const isMatchedUserAuthor = () => {
        currentUserId === contentId.userId ? setIsCurrentUserAuthor(true) : setIsCurrentUserAuthor(false);
    }

    useEffect(() => {
        isMatchedUserAuthor();
    }, [])

    // 댓글 삭제 요청
    const deleteComment = async () => {
        try {
            if(!isCurrentUserAuthor) {
                return
            }
            const res = await axios.post(`${BASE_URL}/api/main/deleteComment`, contentId);
            const data = res.data.message;

            // 성공 메시지 출력
            alert(data);

            // 댓글 목록 리렌더링
            getCommentData();
            
            // 더보기 팝업 닫기
            dispatch(toogleCommentMore())
        } catch (e) {
            console.error(e);
        }
    }

    let dispatch = useDispatch();

    return (
        <div className="commentMore_popup">
            <div className="commentMore_btns">
                <button>신고</button>
                {isCurrentUserAuthor ? (<button onClick={deleteComment}>삭제</button>) : null}
                <button
                    onClick={() => { dispatch(toogleCommentMore()) }}
                >취소</button>
            </div>
        </div>
    )
}


export default CommentMore;