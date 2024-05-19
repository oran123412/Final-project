import SearchIcon from "@mui/icons-material/Search";
import Search from "./Search";
import SearchIconWrapper from "./SearchIconWrapper";
import StyledInputBase from "./StyledInputBase";
import { useContext } from "react";
import { SearchContext } from "../../../store/searchContext";

const FilterComponent = () => {
  const { search, setSearch } = useContext(SearchContext);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Search>
      <SearchIconWrapper sx={{ color: "black" }}>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        value={search}
        onChange={handleSearch}
      />
    </Search>
  );
};

export default FilterComponent;
