import ProfileContainer from "../ProfileContainer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getComments } from "store/ProfileSlice";
import { RootState } from "store";
import { NavLink } from "react-router-dom";
import { GetPhotoByUserId, GetUsernameById } from "utils/MeetingsFunctions";
import styles from "./Reviews.module.scss";

const Reviews = () => {
  // Redux
  const dispatch = useDispatch();
  const { data: myInfoData } = useSelector(
    (state: RootState) => state.profile.myInfo
  );

  useEffect(() => {
    if (myInfoData) dispatch(getComments(myInfoData.id));
  }, [myInfoData]);
  const { data: commentsData } = useSelector(
    (state: RootState) => state.profile.comments
  );

  if (!commentsData) return <p>Loading...</p>;

  return (
    <ProfileContainer>
      <h5 className={styles.title}>Комментарии о вас</h5>
      <div className={styles.comments_container}>
        {commentsData?.comments.length === 0 ? (
          <p>Пока что нет комментариев</p>
        ) : (
          commentsData?.comments.map((comment) => (
            <div className={styles.comment_container}>
              <NavLink
                to={`/user/${comment.authorId}`}
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
            </div>
          ))
        )}
      </div>
    </ProfileContainer>
  );
};

export default Reviews;
