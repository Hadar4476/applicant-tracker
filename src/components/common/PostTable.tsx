import DataTable from "./DataTable";

interface Post {
  id: string;
  title: string;
  description: string;
  likes: number;
  createdAt: Date;
  isPrivate: boolean;
}

const PostsTable: React.FC = () => {
  const data: Post[] = [
    {
      id: "1",
      title: "Getting Started with React",
      description: "A comprehensive guide to learning React from scratch",
      likes: 245,
      createdAt: new Date("2024-01-15"),
      isPrivate: false,
    },
    {
      id: "2",
      title: "Advanced TypeScript Patterns",
      description: "Exploring complex TypeScript patterns for better code",
      likes: 189,
      createdAt: new Date("2024-02-20"),
      isPrivate: true,
    },
    {
      id: "3",
      title: "Building Scalable APIs",
      description: "Best practices for creating maintainable backend services",
      likes: 321,
      createdAt: new Date("2024-01-08"),
      isPrivate: false,
    },
  ];

  return (
    <DataTable
      data={data}
      config={{
        excludeKeys: ["id"],
        customColumns: {
          title: {
            cell: ({ getValue }) => (
              <div className="font-semibold text-gray-900 truncate max-w-xs">
                {getValue() as string}
              </div>
            ),
          },
          description: {
            cell: ({ getValue }) => (
              <div className="text-gray-600 truncate max-w-sm">
                {getValue() as string}
              </div>
            ),
          },
          likes: {
            cell: ({ getValue }) => (
              <div className="text-center font-semibold text-blue-600">
                {(getValue() as number).toLocaleString()}
              </div>
            ),
          },
          isPrivate: {
            header: "Status",
            cell: ({ getValue }) => {
              const isPrivate = getValue() as boolean;
              return (
                <div className="flex justify-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      isPrivate
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {isPrivate ? "Private" : "Public"}
                  </span>
                </div>
              );
            },
          },
        },
      }}
      title="Posts Table"
    />
  );
};

export default PostsTable;
