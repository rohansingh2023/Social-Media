import { Feed, Leftbar, Rightbar } from "../../components";

const Home = () => {
  return (
    <div className="relative bg-slate-50 font-Segoe">
      <div className="grid grid-cols-12">
        <Leftbar />
        <Feed />
        <Rightbar />
      </div>
    </div>
  );
};

export default Home;
