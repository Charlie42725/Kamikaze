import { Skeleton } from 'antd-mobile';

export default function Loading() {
  return (
    <div>
      <div className="px-4 pt-4 pb-2">
        <div className="h-7 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="h-12 bg-gray-100 dark:bg-gray-800" />
      <div className="p-4">
        <Skeleton.Paragraph lineCount={5} animated />
      </div>
    </div>
  );
}
