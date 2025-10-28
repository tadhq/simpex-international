interface IProps {
  as?: any;
  className?: string;
}

const Prose: React.FC<React.PropsWithChildren<IProps>> = ({
  as: Tag = 'article',
  children,
  className,
  ...props
}) => {
  const classNames =
    'prose prose-neutral-600 max-w-none prose-h2:mb-3 prose-strong:font-bold prose-a:underline-offset-2'
      .concat(' ', className ?? '')
      .trim();

  if (typeof children === 'string') {
    return (
      <Tag className={classNames} {...props} dangerouslySetInnerHTML={{ __html: children }}></Tag>
    );
  }

  return <Tag className={classNames}>{children}</Tag>;
};

export default Prose;
