import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';

export function AuctionsListPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Аукционы</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Управляйте грузовыми аукционами и ставками в одном рабочем пространстве.
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          Подготовка данных
        </Badge>
      </div>

      <Card className="mt-6 max-w-2xl">
        <CardHeader>
          <CardTitle>Список аукционов появится здесь</CardTitle>
          <CardDescription>
            На следующем этапе подключим контракт API, MSW-моки, фильтры и пагинацию.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Каркас уже адаптирован для desktop и mobile и готов к наполнению данными.
        </CardContent>
      </Card>
    </main>
  );
}
