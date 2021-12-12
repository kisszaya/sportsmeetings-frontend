import { NavLink, useParams } from "react-router-dom";
import { UserWrapper } from "elements/ui";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { deleteComment, getComments, userInfo } from "store/ProfileSlice";
import { useContext, useEffect } from "react";
import { PopupContext } from "elements/service";
import { CreateComment } from "./create-comment/CreateComment";
import {
  GetPhotoByUserId,
  GetUsernameById,
} from "../../../utils/MeetingsFunctions";

import styles from "./UserProfile.module.scss";

import { ReactComponent as DeleteSVG } from "./media/delete.svg";

const UserProfile = () => {
  const { id } = useParams();
  const userId = Number(id);

  // Redux
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getComments(userId));
  }, [userId]);
  const { data: commentsData } = useSelector(
    (state: RootState) => state.profile.comments
  );
  const setPopup = useContext(PopupContext);

  const { usersInfo } = useSelector((state: RootState) => state.profile);
  if (!usersInfo.find((user) => user.id === userId)) dispatch(userInfo(userId));
  const { data: myInfo } = useSelector(
    (state: RootState) => state.profile.myInfo
  );

  const userData = usersInfo.find((user) => user.id === userId);
  if (!userData) return <p>Loading...</p>;

  // Delete function
  const onDeleteComment = (commentId: number, userId: number) => {
    dispatch(deleteComment({ commentId: commentId, userId: userId }));
  };

  return (
    <UserWrapper>
      <div className={styles.container}>
        <section className={styles.left_section}>
          <div className={styles.photo}>
            <GetPhotoByUserId userId={userData.id} />
          </div>
          <p className={styles.username}>{userData.username}</p>
          <p
            className={styles.name}
          >{`${userData.firstName} ${userData.lastName}`}</p>
        </section>
        <section className={styles.right_section}>
          <div className={styles.title_container}>
            <h5 className={styles.title}>Комментарии о пользователе</h5>
            <button
              onClick={() => setPopup(<CreateComment userId={userId} />)}
              className={styles.leave_comment_button}
            >
              Оставить комментарий
            </button>
          </div>
          <div className={styles.comments_container}>
            {commentsData?.comments.length === 0 ? (
              <p>Пока что нет комментариев</p>
            ) : (
              commentsData?.comments.map((comment) => (
                <div className={styles.comment_container}>
                  <NavLink
                    to={
                      comment.authorId === myInfo?.id
                        ? `/profile/events`
                        : `/user/${comment.authorId}`
                    }
                    className={styles.comment_user_info}
                  >
                    <div className={styles.comment_photo}>
                      <GetPhotoByUserId userId={comment.authorId} />
                    </div>
                    <p className={styles.comment_username}>
                      <GetUsernameById userId={comment.authorId} />
                    </p>
                  </NavLink>
                  <p className={styles.comment_text}>{comment.text}</p>
                  {comment.authorId === myInfo?.id && (
                    <div
                      onClick={() => onDeleteComment(comment.id, userData.id)}
                      className={styles.comment_delete_button}
                    >
                      <DeleteSVG />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </UserWrapper>
  );
};

export default UserProfile;
