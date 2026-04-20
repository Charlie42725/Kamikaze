import { Skeleton } from 'antd-mobile';

export default function Loading() {
  return (
    <div>
      <div className="h-14 bg-gray-100 dark:bg-gray-800" />
      <div className="h-12 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700" />
      <div className="p-4 space-y-3">
        <Skeleton.Paragraph lineCount={3} animated />
        <Skeleton.Paragraph lineCount={3} animated />
      </div>
    </div>
  );
}
