import { TableTd, TableTr } from '@/lib/mantine';

const SkeletonLineItem = () => {
  return (
    <TableTr className="w-full m-4">
      <TableTd className="p-4 w-24">
        <div className="flex w-24 h-24 p-4 bg-base-200 animate-pulse" />
      </TableTd>
      <TableTd className="text-left">
        <div className="flex flex-col gap-y-2">
          <div className="w-32 h-4 bg-base-200 animate-pulse" />
          <div className="w-24 h-4 bg-base-200 animate-pulse" />
        </div>
      </TableTd>
      <TableTd>
        <div className="flex gap-2 items-center">
          <div className="w-6 h-8 bg-base-200 animate-pulse" />
          <div className="w-14 h-10 bg-base-200 animate-pulse" />
        </div>
      </TableTd>
      <TableTd>
        <div className="flex gap-2">
          <div className="w-12 h-6 bg-base-200 animate-pulse" />
        </div>
      </TableTd>
      <TableTd>
        <div className="flex gap-2 justify-end">
          <div className="w-12 h-6 bg-base-200 animate-pulse" />
        </div>
      </TableTd>
    </TableTr>
  );
};

export default SkeletonLineItem;
