import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import ROUTES from "./ROUTES";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import AboutUsPage from "./../pages/AboutUsPage";
import EditCardPage from "../pages/EditCardPage/EditCardPage";
import BizGuard from "../guard/BizGuard";
import BooksDetailPage from "../pages/BooksDetailPage/BooksDetailPage";
import CreateCardPage from "../pages/CreateCardPage/CreateCardPage";
import LikedPage from "../pages/LikedPage/LikedPage";
import MyCardsPage from "../pages/CreateCardPage/MyCardsPage";
import NotFoundPage from "../pages/NotFoundPage";
import Sandbox from "../sandbox/Sandbox";
import AuthorPage from "../pages/AuthorPage/AuthorPage";
import CartPage from "../pages/CartPage/CartPage";
import CardsPage from "../pages/CardsPage/CardsPage";
const Router = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.ABOUT} element={<AboutUsPage />} />
      <Route path={ROUTES.CREATECARD} element={<CreateCardPage />} />
      <Route path={`${ROUTES.BOOKSDETAIL}/:id`} element={<BooksDetailPage />} />
      <Route path={ROUTES.LIKEDPAGE} element={<LikedPage />} />
      <Route path={`${ROUTES.AUTHORPAGE}/:title`} element={<AuthorPage />} />
      <Route path={ROUTES.MYCARDS} element={<MyCardsPage />} />
      <Route path={ROUTES.CARTPAGE} element={<CartPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path={ROUTES.SANDBOX} element={<Sandbox />} />
      <Route path={`${ROUTES.CARDSPAGE}/:id`} element={<CardsPage />} />

      <Route
        path={`${ROUTES.EDITCARD}/:id`}
        element={
          <BizGuard>
            <EditCardPage />
          </BizGuard>
        }
      />
    </Routes>
  );
};
export default Router;
