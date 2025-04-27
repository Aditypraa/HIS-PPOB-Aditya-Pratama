import { getFallbackIcon } from "../../utils/serviceIcons";

interface ServiceIconProps {
  iconUrl: string;
  label: string;
  serviceCode: string;
  onClick: () => void;
}

function ServiceIcon({
  iconUrl,
  label,
  onClick,
  serviceCode,
}: ServiceIconProps) {
  const FallbackIcon = getFallbackIcon(serviceCode);

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center text-center p-2 hover:bg-gray-100 rounded-lg transition duration-150 ease-in-out w-16 sm:w-20 group"
    >
      <div className="p-3 bg-gray-100 group-hover:bg-red-100 rounded-lg mb-1 transition duration-150 ease-in-out flex items-center justify-center w-12 h-12">
        <img
          src={iconUrl}
          alt={label}
          className="w-full h-full object-contain"
        />
        <FallbackIcon
          className="text-gray-600 group-hover:text-red-600"
          size={24}
          style={{ display: "none" }}
        />
      </div>
      <span className="text-xs text-gray-700 font-medium group-hover:text-red-700">
        {label}
      </span>
    </button>
  );
}

export default ServiceIcon;
