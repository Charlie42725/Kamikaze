import { Skeleton, Card } from 'antd-mobile';

export default function Loading() {
  return (
    <div className="p-4">
      <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} style={{ textAlign: 'center' }}>
            <Skeleton.Paragraph lineCount={2} animated />
          </Card>
        ))}
      </div>
      <Skeleton.Paragraph lineCount={4} animated />
    </div>
  );
}
