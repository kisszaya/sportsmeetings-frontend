import ProfileContainer from "../ProfileContainer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getComments } from "store/ProfileSlice";
import { RootState } from "store";
import { NavLink } from "react-router-dom";
import { GetUsernameById } from "utils/MeetingsFunctions";

const Reviews = () => {
  // Redux
  const dispatch = useDispatch();
  const { data: myInfoData } = useSelector((state: RootState) => state.profile.myInfo);

  useEffect(() => {
    if (myInfoData) dispatch(getComments(myInfoData.id));
  }, [myInfoData]);
  const { data: commentsData } = useSelector(
    (state: RootState) => state.profile.comments
  );

  if (!commentsData) return <p>Loading...</p>;

  return (
    <div>
      <ProfileContainer>
        <div>
          {commentsData?.comments.length === 0 ? (
            <p>Пока что нет комментариев</p>
          ) : (
            commentsData?.comments.map((comment) => (
              <div>
                <NavLink to={`/user/${comment.authorId}`}>
                  <GetUsernameById userId={comment.authorId} />
                </NavLink>
                <p>{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </ProfileContainer>
    </div>
  );
};

export default Reviews;
