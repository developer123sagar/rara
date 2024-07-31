import { baseImgUrl } from "@/routes";

const CartStepper = ({
  imgSrc,
  logoImgSrc,
  restroName,
}: {
  imgSrc: string;
  logoImgSrc: string;
  restroName: string;
}) => {
  return (
    <div className="w-full relative h-[40vh] md:h-[40vh] text-white flex justify-center items-center">
      <img
        src={`${baseImgUrl}/${imgSrc}`}
        alt={restroName}
        className="w-full h-full object-cover"
      />
      <img
        src={`${baseImgUrl}/${logoImgSrc}`}
        alt={`${baseImgUrl}/${restroName}`}
        className="w-20 h-20 rounded-full absolute -bottom-8 border border-gray-100 left-[48%]"
      />
    </div>
  );
};

export default CartStepper;
