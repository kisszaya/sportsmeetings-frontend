import { NavLink, useParams } from "react-router-dom";
import { UserWrapper } from "elements/ui";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { deleteComment, getComments, userInfo } from "store/ProfileSlice";
import { useContext, useEffect } from "react";
import { PopupContext } from "elements/service";
import { CreateComment } from "./create-comment/CreateComment";
import { GetUsernameById } from "../../../utils/MeetingsFunctions";

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
  const { data: myInfo } = useSelector((state: RootState) => state.profile.myInfo);

  const userData = usersInfo.find((user) => user.id === userId);
  if (!userData) return <p>Loading...</p>;

  // Delete function
  const onDeleteComment = (commentId: number, userId: number) => {
    dispatch(deleteComment({ commentId: commentId, userId: userId }));
  };

  return (
    <UserWrapper>
      <>
        <section>
          <p>{userData.username}</p>
          <p>{`${userData.firstName} ${userData.lastName}`}</p>
        </section>
        <section>
          <button onClick={() => setPopup(<CreateComment userId={userId} />)}>
            Оставить комментарий
          </button>
          <div>
            {commentsData?.comments.length === 0 ? (
              <p>Пока что нет комментариев</p>
            ) : (
              commentsData?.comments.map((comment) => (
                <>
                  {comment.authorId === myInfo?.id && (
                    <div>
                      <NavLink to={`/profile/events`}>
                        <GetUsernameById userId={comment.authorId} />
                      </NavLink>
                      <p>{comment.text}</p>
                      <button
                        onClick={() => onDeleteComment(comment.id, userData.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                  {comment.authorId !== myInfo?.id && (
                    <div>
                      <NavLink to={`/user/${comment.authorId}`}>
                        <GetUsernameById userId={comment.authorId} />
                      </NavLink>
                      <p>{comment.text}</p>
                    </div>
                  )}
                </>
              ))
            )}
          </div>
        </section>
      </>
    </UserWrapper>
  );
};

export default UserProfile;
