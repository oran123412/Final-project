import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";

const StarsRating = ({ rating }) => {
  const totalStars = 5;

  return (
    <div>
      {[...Array(totalStars)].map((star, index) => {
        return index < rating ? (
          <FontAwesomeIcon
            key={index}
            icon={faStarSolid}
            style={{ color: "gold", marginLeft: "20px" }}
          />
        ) : (
          <FontAwesomeIcon
            key={index}
            icon={faStarRegular}
            style={{ marginLeft: "20px" }}
          />
        );
      })}
    </div>
  );
};
export default StarsRating;
