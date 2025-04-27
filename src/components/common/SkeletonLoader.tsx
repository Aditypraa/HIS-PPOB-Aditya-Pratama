export const SkeletonLoader = ({
  count = 8,
  width = "w-16",
  height = "h-16",
}) => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4 mb-8 justify-items-center">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center p-2">
          <div
            className={`bg-gray-200 rounded-lg mb-1 ${width} ${height} animate-pulse`}
          ></div>
          <div className="h-2 w-10 bg-gray-200 rounded animate-pulse mt-1"></div>
        </div>
      ))}
    </div>
  );
};
