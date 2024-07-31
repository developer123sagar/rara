/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/redux/store";
import { useAppSelector } from "@/redux/store";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { fetchStories, saveRestroId } from "@/redux/restaurant/restaurantSlice";
import { baseImgUrl, baseVideoUrl } from "@/routes";

import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";

const Story = () => {
  const { id } = useParams();
  const [filteredStory, setFilteredStory] = useState<any>();
  const [restStory, setRestStory] = useState<any>();

  const dispatch = useAppDispatch();

  const { story } = useAppSelector((state: RootState) => state.restaurant);
  const { newPlace } = useAppSelector((state: RootState) => state.map);

  const filterRestro = story.filter((item: any) => item._id === id);
  const [firstRestro] = filterRestro;

  useEffect(() => {
    dispatch(fetchStories({ long: newPlace.long, lat: newPlace.lat }));
  }, [dispatch]);

  useEffect(() => {
    const fetchStory = () => {
      if (story && story?.length > 1) {
        const filteredStory = story.filter((st: any) => st._id === id);
        const restStory = story.filter((st: any) => st._id !== id);
        filteredStory[0] && setFilteredStory(filteredStory[0]);
        restStory && setRestStory(restStory);
      } else {
        setRestStory(story);
        const [firstElemet] = story;
        setFilteredStory(firstElemet);
      }
    };
    fetchStory();
  }, [story, id]);

  const navigate = useNavigate();

  return (
    <div className="flex -mt-20">
      <div className="hidden md:block pt-1 sm:px-6 bg-[rgb(220,220,220)]  h-screen  overflow-auto relative">
        <div className="flex justify-between items-center">
          <div
            onClick={() => navigate("/rest_details/noId")}
            className=" cursor-pointer "
          >
            <RxCross1 size={35} color={"gray"} />
          </div>
          <Link to="/rest_details/:catName">
            <img
              src="/logo.png"
              alt="rara"
              width={200}
              height={100}
              className="object-contain h-28 w-28 absolute right-1 -top-7"
            />
          </Link>
        </div>
        <h1 className="text-[20px] font-bold mt-20"> RARA Special </h1>
        {restStory &&
          restStory.length > 0 &&
          restStory.map((rs: any, id: number) => (
            <Link to={`/story/${rs._id}`} key={id} className="h">
              <div className="flex justify-center  items-center gap-3 mt-5 p-2 rounded">
                <img
                  src={`${baseImgUrl}/${rs.restaurantId.logo}`}
                  className="h-[50px] w-[50px] rounded-full"
                />
                <h1> {rs.restaurantId.name} </h1>
              </div>
            </Link>
          ))}
      </div>

      <div className="flex-1 sm:gap-10 flex group relative sm justify-center items-center h-screen">
        <div>
          {restStory && restStory[0] && (
            <Link
              to={`/story/${restStory[0]._id}`}
              className=" bg-white md:bg-none rounded-full md:flex absolute group-hover:block opacity-50 hover:opacity-50 cursor-pointer z-10 hidden  left-0 md:p-2"
            >
              <IoIosArrowBack size={36} />
            </Link>
          )}
        </div>
        <div>
          {filteredStory &&
            restStory &&
            filteredStory.restaurantId &&
            restStory[0] && (
              <div
                key={id}
                className="sm:flex-none relative h-screen w-full sm:w-[500px]   bg-black border border-[rgb(200,200,200)] cursor-pointer"
              >
                <div className="flex justify-center  items-center gap-4 absolute left-[10px] top-[10px]">
                  <img
                    src={`${baseImgUrl}/${filteredStory.restaurantId.logo}`}
                    className=" h-[40px]  w-[40px] rounded-full border border-[rgb(200,200,200)]"
                  />
                  <h1 className="text-white">
                    {" "}
                    {filteredStory.restaurantId.name}{" "}
                  </h1>
                </div>
                <video
                  className="md:h-[80vh] h-[70vh] "
                  controls
                  autoPlay
                  width="500"
                >
                  <source
                    src={`${baseVideoUrl}/${filteredStory.video}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <div className="md:p-5 p-2">
                  <p className="text-white text-[12px] md:text-[16px] text-justify truncate">
                    {filteredStory.restaurantId.description}
                  </p>
                  <div
                    onClick={() => {
                      dispatch(saveRestroId(firstRestro?.restaurantId?._id));
                      navigate(
                        `/food_details/${firstRestro?.restaurantId.name}`
                      );
                    }}
                    className="flex justify-center"
                  >
                    <button className="mt-5 text-white shadow inset-y-0 right-0 bottom-0 top-0 font-bold px-3 py-2 bg-[#e01f2d] focus:outline-none pl-5 pr-5">
                      Visit buisness
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>
        <div>
          {restStory && restStory[0] && (
            <Link
              to={`/story/${restStory[0]._id}`}
              className="bg-white md:bg-none rounded-full  absolute md:flex opacity-50 hover:opacity-50 group-hover:block cursor-pointer z-10 hidden  right-0 md:p-2"
            >
              <IoIosArrowForward size={36} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Story;
