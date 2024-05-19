import PropType from "prop-types";
const MainComponent = ({ children }) => {
  return <>{children}</>;
};
export default MainComponent;

MainComponent.propType = {
  children: PropType.element.isRequired,
};
