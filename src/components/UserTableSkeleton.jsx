const UserTableSkeleton = () => {
    const skeletonRows = Array(5).fill(0);
    
    return (
      <tbody>
        {skeletonRows.map((_, index) => (
          <tr key={`skeleton-${index}`}>
            <td className="border p-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="border p-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="border p-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            </td>
            <td className="border p-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            </td>
            <td className="border p-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
            </td>
            <td className="border p-2">
              <div className="flex gap-2">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };


  export default UserTableSkeleton