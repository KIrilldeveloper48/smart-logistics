import { Link } from '@tanstack/react-router';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';

export function AuctionDetailNotFoundState() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Аукцион не найден</CardTitle>
        <CardDescription>Возможно, ссылка устарела или аукцион больше недоступен.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link to="/" search={{ page: 1, perPage: 20 }}>
            К списку аукционов
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
