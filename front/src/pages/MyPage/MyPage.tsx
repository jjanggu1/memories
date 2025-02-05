import "./MyPage.css";

import Header from "../../components/Header/Header";
import Follower from "../../components/Follower/Follower";
import Following from "../../components/Following/Following";
import MyPageTabs from "../../components/MyPageTabs/MyPageTabs";

import { useSelector, useDispatch } from "react-redux";
// 리덕스툴킷 수정함수 임포트
import { RootState, toggleFollower } from "../../store/store";
import { toggleFollowing } from "../../store/store";
import { chooseTabs } from "../../store/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface UserData {
  USER_ID: string;
  USER_NAME: string;
  USER_NICKNAME: string;
  USER_INTRO: string;
  USER_IMAGE: string;
}
interface UserPostCountData {
  totalPostCount: number;
}

function MyPage() {
  const BASE_URL = "http://localhost:4000";

  let isFollowerVisible = useSelector(
    (state: RootState) => state.followerVisible
  );
  let isFollowingVisible = useSelector(
    (state: RootState) => state.followingVisible
  );
  let contentsVisible = useSelector(
    (state: RootState) => state.contentsVisible
  );
  let dispatch = useDispatch();

  // const [isFollowerVisible, setFollowerVisible] = useState(false);

  // const toggleFollower = () => {
  //     setFollowerVisible(!isFollowerVisible);
  // }

  // 유저 아이디
  const [userId, setUserId] = useState({
    userId: localStorage.getItem("userId"),
  });

  // 회원 데이터
  const [userData, setUserData] = useState<UserData[]>([]);

  // 회원데이터 요청 함수
  const fetchUserData = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/mypage`, userId); //게시글 목록 요청
      const data = res.data;
      await setUserData(data);

      return data; // 데이터 반환
    } catch (e) {
      console.error(e);
    }
  };

  // 회원 데이터
  const [userPostCountData, setUserPostCountData] = useState<UserPostCountData[]>([]);

  // 작성한 게시물 수 요청 함수
  const fetchPostCountData = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/mypage/getUserPostCount`,
        userId
      ); //작성한 게시물 수 요청
      const data = res.data;
      await setUserPostCountData(data);

      return data; // 데이터 반환
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPostCountData();
    fetchUserData();
  }, []);
  console.log("마이페이지회원 데이터", userData);
  console.log("마이페이지회원 게시글 수 : ", userPostCountData);
  return (
    <div className="myPage_wrap">
      <Header />
      <div className="myPage">
        <div className="myPage_header">
          <div className="myPage_header_userImg">
            <img
              src={`http://localhost:4000/profileImg/${
                userData[0]?.USER_IMAGE
              }`}
              alt="프로필이미지"
            />
          </div>
          <div className="myPage_header_user">
            <div className="myPage_header_user_info">
              <span>{userData[0]?.USER_NICKNAME}</span>
              <Link to="/userupdate">
                프로필 편집
                <i className="fa-solid fa-gear"></i>
              </Link>
            </div>
            <div className="myPage_header_user_community">
              <span>
                게시물{" "}
                <strong>
                  {userPostCountData[0]?.totalPostCount}
                </strong>
              </span>
              <span
                onClick={() => {
                  dispatch(toggleFollower());
                }}
              >
                팔로워 <strong>3</strong>
              </span>
              <span
                onClick={() => {
                  dispatch(toggleFollowing());
                }}
              >
                팔로우 <strong>3</strong>
              </span>
            </div>
            <div className="myPage_header_user_name">
              <span>{userData[0]?.USER_NAME}</span>
            </div>
            <div className="myPage_header_user_introduction">
              <span>{userData[0]?.USER_INTRO}</span>
            </div>
          </div>
        </div>
        <div className="myPage_category">
          <span
            onClick={() => {
              dispatch(chooseTabs("Posts"));
            }}
            className={`myPage_category_span ${
              contentsVisible === "Posts" ? "myPage_category_span_border" : ""
            }`}
          >
            <i className="fa-solid fa-border-all"></i>
            게시물
          </span>
          <span
            onClick={() => {
              dispatch(chooseTabs("Saved"));
            }}
            className={`myPage_category_span ${
              contentsVisible === "Saved" ? "myPage_category_span_border" : ""
            }`}
          >
            <i className="fa-regular fa-bookmark"></i>
            저장됨
          </span>
          <span
            onClick={() => {
              dispatch(chooseTabs("Liked"));
            }}
            className={`myPage_category_span ${
              contentsVisible === "Liked" ? "myPage_category_span_border" : ""
            }`}
          >
            <i className="fa-regular fa-heart"></i>
            좋아요
          </span>
        </div>
        <MyPageTabs userId={userId} />
      </div>
      {isFollowerVisible && <Follower />}
      {isFollowingVisible && <Following />}
    </div>
  );
}

export default MyPage;
