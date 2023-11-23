import './PostMore.css';

import { useDispatch } from "react-redux";
// 리덕스툴킷 수정함수 임포트
import { tooglePostMore } from "../../store/store";
import { useContext, useEffect, useState } from 'react';

import { PostMoreContext } from '../../context/context';
import axios from 'axios';

function PostMore() {
    const BASE_URL = "http://localhost:4000";
    
    // Content 컴포넌트에서 받은 value값
    const { postUserIdData, getPostData } = useContext(PostMoreContext);
    console.log("Content.js 로 받은 데이터",postUserIdData);

    // 로컬스토리지의 회원 ID를 상태에 저장
    const [currentUserId, setCurrentUserId] = useState(localStorage.getItem("userId"));

    // 글, 회원 ID 정보 상태
    const [contentId, setContentId] = useState({
        userId: postUserIdData.userId,
        brdId: postUserIdData.brdId,
    })

    // 글작성자와 현재 로그인된 사용자가 일치하는지 여부 상태
    const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);

    // 글작성자, 로그인된 사용자 일치여부 함수 
    const isMatchedUserAuthor = () => {
        currentUserId === contentId.userId ? setIsCurrentUserAuthor(true) : setIsCurrentUserAuthor(false);
    }
    useEffect(() => {
        isMatchedUserAuthor();
    }, [])

    // 글 삭제 요청
    const deletePost = async () => {
        try {
            if(!isCurrentUserAuthor) {
                return
            }
            const res = await axios.post(`${BASE_URL}/api/main/deletePost`, contentId);
            const data = res.data.message;

            // 성공 메시지 출력
            alert(data);

            // 게시글 목록 리렌더링
            getPostData();
            
            // 더보기 팝업 닫기
            dispatch(tooglePostMore())
        } catch (e) {
            console.error(e);
        }
    }

    let dispatch = useDispatch();

    console.log("PostMore로 전송한 데이터 : ", contentId)
    return (
        <div className="postMore_popup">
            <div className="postMore_btns">
                <button>신고</button>
                {isCurrentUserAuthor ? (<button onClick={deletePost}>삭제</button>) : null}
                <button>팔로우 취소</button>
                <button
                    onClick={() => { dispatch(tooglePostMore()) }}
                >취소</button>
            </div>
        </div>
    )
}


export default PostMore;