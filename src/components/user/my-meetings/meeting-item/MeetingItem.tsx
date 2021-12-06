import { NavLink } from "react-router-dom";
import { MeetingType } from "types/MeetingTypes";

import styles from "./MeetingItem.module.scss";

export const MeetingItem = (props: {
  meeting: MeetingType;
  status: "FINISHED" | "CREATED";
  isMine: boolean;
}) => {
  return <div>ghb</div>;
  // <NavLink
  //   to={`/meetings/attended/${meeting.id}`}
  //   className={styles.itemContainer}
  // ></NavLink>;
};
// <NavLink
//     to={`/meetings/attended/${meeting.id}`}
//     className={styles.itemContainer}
// >
//     <section className={styles.top}>
//         <h3>
//             <GetCategoryName categoryId={meeting.categoryId} />
//         </h3>
//         <div className={styles.placeAndTime}>
//             <p>
//                 <GetConvertedTime text={meeting.startDate} />
//             </p>
//             <p>
//                 <GetConvertedAddress
//                     lng={meeting.longitude}
//                     lat={meeting.latitude}
//                 />
//             </p>
//             <iframe
//                 width="300"
//                 height="170"
//                 frameBorder="0"
//                 scrolling="no"
//                 src={`https://maps.google.com/maps?q=${meeting.latitude},${meeting.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
//             />
//         </div>
//     </section>
//     <section className={styles.bottom}>
//         <p>{meeting.description}</p>
//         <div className={styles.buttons}>
//             <p>
//                 <GetCreatorUsername meeting={meeting} />
//             </p>
//         </div>
//     </section>
// </NavLink>
