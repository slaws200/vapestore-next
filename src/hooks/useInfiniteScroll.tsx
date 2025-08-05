import { FC, ReactEventHandler, ReactNode } from "react";

interface IProps {
  children: ReactNode;
  loadMore: () => void;
  loader: ReactNode;
  isLoading: boolean;
  hasMore: boolean;
  height: number;
  threshold: number;
}

export const InfiniteScroll: FC<IProps> = ({
  children,
  loadMore,
  loader,
  isLoading,
  hasMore,
  height,
  threshold = 21,
}) => {
  const handleScroll: ReactEventHandler<HTMLDivElement> = (e) => {
    if (!isLoading && hasMore) {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollTop >= scrollHeight - clientHeight - threshold) {
        loadMore();
      }
    }
  };

  return (
    <div onScroll={handleScroll} style={{ maxHeight: height }}>
      <div>{children}</div>
      {isLoading && loader}
    </div>
  );
};
