import './LikedTabs.css';
import PostModal from '../../components/PostModal/PostModal.js';
import useOnClickOutside from '../../Hooks/useOnClickOutside.js';

import { tooglePostModal } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function LikedTabs(props) {
    const BASE_URL = "http://localhost:4000";

    let mainPostModalVisible = useSelector(state => state.mainPostModalVisible);
    let dispatch = useDispatch();

    // 글 모달 Ref
    const modalRef = useRef();

    useOnClickOutside(modalRef, () => {
        // 모달 외부를 클릭했을 때 실행할 코드
        dispatch(tooglePostModal());
    }, mainPostModalVisible);

    // PostModal 컴포넌트에 전달할 글 ID
    const [postNum, setPostNum] = useState();

    // 유저 아이디
    const [userId, setUserId] = useState({
        userId: props.userId.userId
    });

    // 게시글 목록 데이터
    const [postsData, setPostsData] = useState();

    // 게시글 목록 요청 함수
    const fetchLikedData = async () => {
        try {
            const res = await axios.post(`${BASE_URL}/api/mypage/getLikedData`, userId); //게시글 목록 요청
            const data = res.data;
            await setPostsData(data);

            return data; // 데이터 반환
        } catch (e) {
            console.error(e);
        }
    }

    //회원이 좋아요, 저장한 글 데이터
    const [userLikedSaved, setUserLikedSaved] = useState();

    // 회원이 좋아요, 저장한 글 데이터 요청
    const fetchLikedSaved = async () => {
        try {
            const userIdData = {
                userId: userId
            }
            if (userId === null) {
                return
            } else {
                const res = await axios.post(`${BASE_URL}/api/main/likedSaved`, userIdData);
                const data = res.data;

                setUserLikedSaved(data);

            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchLikedData();
    }, []);

    console.log("유저 아이디 : ", userId);
    console.log("게시글 데이터 : ", postsData);
    return (
        <div className='likedTabs'>
            <div className='myPage_liked'>
                {postsData && postsData.map((item) => (
                    <button onClick={() => {
                        dispatch(tooglePostModal());
                        setPostNum(item.BRD_ID);
                    }} key={item.BRD_ID}>
                        <img src={`http://localhost:4000/postImg/${item.BRD_ID}/${item.BRD_IMAGE1}`} alt="이미지1" />
                    </button>
                ))}
            </div>
            {mainPostModalVisible && <PostModal postNum={postNum} rerenderLikedSaved={fetchLikedSaved} rerenderPostData={fetchLikedData} ref={modalRef} />}
        </div>
    )
}

export default LikedTabs;