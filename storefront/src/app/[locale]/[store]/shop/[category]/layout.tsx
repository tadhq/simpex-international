interface Props extends React.PropsWithChildren {}

export default function Layout({ children }: Props) {
  return <main className="flex-1">{children}</main>;
}
