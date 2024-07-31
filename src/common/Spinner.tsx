const Spinner = ({ btn }: { btn?: boolean }) => {
  return (
    <>
      {btn ? (
        <div className="w-[50px] h-[20px] flex items-center justify-center">
          <img
            loading="lazy"
            src="/applogo.png"
            alt="rara"
            className="object-cover py-1 h-[45px]"
          />
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="w-32">
            <img
              loading="lazy"
              src="/applogo.png"
              alt="rara"
              className="object-cover py-1"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Spinner;
