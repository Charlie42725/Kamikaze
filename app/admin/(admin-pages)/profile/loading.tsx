import { Card, Skeleton } from 'antd-mobile';

export default function Loading() {
  return (
    <div className="p-4">
      <Card style={{ marginBottom: 16 }}>
        <Skeleton.Paragraph lineCount={2} animated />
      </Card>
      <Skeleton.Paragraph lineCount={3} animated />
    </div>
  );
}
