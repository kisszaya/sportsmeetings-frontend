import React, { Suspense, useEffect } from "react";
import {
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import { generalRoutes, userRoutes, adminRoutes } from "components/connector";
import {useDispatch, useSelector} from "react-redux";
import { initialize } from "store/authSlice";
import { PopupProvider } from "elements/service/popup/Popup";
import {RootState} from "store";
import {Loading} from "components/general";

import styles from "./App.module.scss";

const App = () => {
  const dispatch = useDispatch();
  const {status} = useSelector((state: RootState) => state.auth.initialize)
  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  if(status === 'loading') return <Loading/>

  return (
    <BrowserRouter>
      <PopupProvider>
        <div className={styles.App}>
          <Routes>
            {[...generalRoutes, ...userRoutes, ...adminRoutes].map(
              (route, index) => (
                <Route
                  element={
                    <Suspense fallback={<Loading/>}>
                      {route.element}
                    </Suspense>
                  }
                  path={route.path}
                  key={index}
                />
              )
            )}
          </Routes>
        </div>
      </PopupProvider>
    </BrowserRouter>
  );
};

export default App;
