import { UserWrapper } from "elements/ui";
import { useDispatch } from "react-redux";
import { unregister } from "store/authSlice";

const Profiles = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <UserWrapper>
        <button onClick={() => dispatch(unregister())}>Выйти</button>
        Profiles
      </UserWrapper>
    </div>
  );
};

export default Profiles;
