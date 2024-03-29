import './Login.css';

import { ChangeEvent, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login() {

    // ID, PW 입력값 상태 저장
    const [loginAccount, setLoginAccount] = useState({
        userId: "",
        password: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;

        setLoginAccount({
            ...loginAccount,
            [name]: value,
        });
    };

    const BASE_URL = "http://localhost:4000";

    const loginForm = async () => {
        try {
            const res = await axios.post(`${BASE_URL}/api/login`, loginAccount);
            const data = res.data;

            if (res.status === 200) {
                alert("로그인에 성공하였습니다.");
                localStorage.setItem("userId", data.userData.userId);
                localStorage.setItem("userNick", data.userData.userNickname);
                localStorage.setItem("userImg", data.userData.userImage);
                window.location.href = "/";
            }

        } catch (error: any) {
            if (error.response.status === 401) {
                alert("로그인에 실패하였습니다.");
            } else {
                console.error('에러발생 : ', error);
            }
        }
    }

    const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginForm();
        }
    };

    return (
        <div className="login">
            <div className='login_main'>
                <div className='login_main_logo'>
                    <span><Link to="/">memories</Link></span>
                </div>
                <form className='login_main_input'>
                    <input type="text" name='userId' placeholder='아이디' onChange={(e) => {
                        handleChange(e)
                    }} />
                    <input
                        type="password"
                        name='password'
                        placeholder='비밀번호'
                        onChange={(e) => handleChange(e)}
                        onKeyDown={handleEnterKeyPress}
                        maxLength={150}
                    />
                </form>
                <div className='login_main_submit'>
                    <input type="submit" value={"로그인"}
                        onClick={loginForm} />
                </div>
                <div className='login_main_division'>
                    <div className='division'></div>
                    <span>또는</span>
                    <div className='division'></div>
                </div>
                <div className='login_main_googleLogin'>
                    <a href="/">
                        <i className="fa-brands fa-google"></i>
                        Google로 로그인</a>
                </div>
                <div className='login_main_forgetPw'>
                    <a href="/">비밀번호를 잊으셨나요?</a>
                </div>
            </div>
            <div className='login_sub'>
                <a href="/join" className='login_sub_join'>
                    <span>계정이 없으신가요?</span>
                    <span>가입하기</span>
                </a>
            </div>
        </div>
    )

}

export default Login;