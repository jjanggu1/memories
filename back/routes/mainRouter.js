const mainCtrl = require("../controllers/mainCtrl");
const router = require("express").Router();

// 메인페이지 - 게시글목록
router.route('/')
    .get(mainCtrl.getMainPostData)

// 메인페이지 - 해당 글의 댓글
router.route('/comments')
    .post(mainCtrl.getMainPostComment)

// 메인페이지 - 현재 로그인된 회원 이미지 
router.route('/crrUserImg')
    .post(mainCtrl.getMainUserImg)

// 메인페이지 - 현재 로그인된 회원이 좋아요,저장한 글 데이터
router.route('/likedSaved')
    .post(mainCtrl.getMainLikedSaved)

// 메인페이지 - 해당 글의 댓글 작성
router.route('/insertComment')
    .post(mainCtrl.insertMainComment)

module.exports = router;