import { useState, useEffect } from "react";
import "./AuthorsSlider.css";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/ROUTES";

const AuthorsSlider = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const [authors, setAuthors] = useState({
    isLoading: true,
    data: [],
    error: null,
  });
  const [random5, setRandom5] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const category = "21st-century_American_novelists";
      const baseUrl = "https://en.wikipedia.org/w/api.php";
      const categoryUrl = `${baseUrl}?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(
        category
      )}&cmlimit=100&format=json&origin=*`;

      try {
        const categoryResponse = await fetch(categoryUrl);
        const categoryData = await categoryResponse.json();

        const authorsList = categoryData.query.categorymembers;
        const authorDetailsPromises = authorsList.map((author) =>
          fetch(
            `${baseUrl}?action=query&prop=pageimages&titles=${encodeURIComponent(
              author.title
            )}&format=json&pithumbsize=500&origin=*`
          ).then((response) => response.json())
        );

        const authorDetailsResponses = await Promise.all(authorDetailsPromises);
        const authorsWithImages = authorDetailsResponses
          .map((response) => {
            const pageId = Object.keys(response.query.pages)[0];
            const page = response.query.pages[pageId];
            return page.thumbnail
              ? {
                  title: page.title,
                  imageUrl: page.thumbnail.source,
                }
              : null;
          })
          .filter((author) => author !== null);

        setAuthors({ isLoading: false, data: authorsWithImages, error: null });
      } catch (error) {
        setAuthors({ isLoading: false, data: [], error: error.toString() });
      }
    };

    fetchAuthors();
  }, []);

  useEffect(() => {
    if (authors.data.length <= 5) setRandom5(authors.data);
    else {
      const randomsIndeces = [];
      while (randomsIndeces.length < 5) {
        const randomIndex = Math.floor(Math.random() * authors.data.length);
        if (!randomsIndeces.find((val) => val === randomIndex)) {
          randomsIndeces.push(randomIndex);
        }
      }
      setRandom5(randomsIndeces.map((index) => authors.data[index]));
    }
  }, [authors.data]);

  if (authors.isLoading) return <div>Loading...</div>;
  if (authors.error) return <div>Error loading authors: {authors.error}</div>;
  if (authors.data.length === 0) return <div>No authors found.</div>;

  const handleAuthorClick = (title) => {
    navigate(`${ROUTES.AUTHORPAGE}/${encodeURIComponent(title)}`);
  };
  return (
    <div className="pen">
      <div className="stage">
        {random5.map((author, index) => (
          <div
            key={index}
            className={`element ${
              activeIndex === index
                ? "active"
                : activeIndex !== null
                ? "inactive"
                : ""
            }`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onClick={() => handleAuthorClick(author.title)}
            style={{
              backgroundImage: `url(${author.imageUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div className="author-name">{author.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorsSlider;
